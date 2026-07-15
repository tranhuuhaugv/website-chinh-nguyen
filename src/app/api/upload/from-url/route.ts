import { NextResponse } from "next/server";
import { lookup } from "dns/promises";
import { isIP } from "net";
import {
  IMAGE_EXT,
  MAX_IMAGE_BYTES,
  requireAdmin,
  saveImage,
} from "@/lib/upload-server";

// Tải ảnh TỪ LINK WEB về VPS (admin dán link thay vì chọn file trên máy).
// Ảnh lưu y như upload thường: public/uploads -> phục vụ tại /uploads/...
export const runtime = "nodejs";

const TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 3;

/**
 * Địa chỉ nội bộ (localhost, 10.x, 192.168.x, link-local...).
 * Server tự đi tải URL do người dùng nhập -> phải chặn link trỏ ngược vào
 * hạ tầng nội bộ của chính VPS (Postgres, API admin...) — lỗi SSRF.
 */
function isPrivateIp(raw: string): boolean {
  const ip = raw.startsWith("::ffff:") ? raw.slice(7) : raw;

  if (isIP(ip) === 6) {
    const l = ip.toLowerCase();
    return (
      l === "::1" ||
      l === "::" ||
      l.startsWith("fc") || // unique local
      l.startsWith("fd") ||
      l.startsWith("fe80") // link-local
    );
  }

  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n))) return true;
  const [a, b] = p;
  return (
    a === 0 ||
    a === 127 || // loopback
    a === 10 || // private
    (a === 172 && b >= 16 && b <= 31) || // private
    (a === 192 && b === 168) || // private
    (a === 169 && b === 254) || // link-local (metadata cloud)
    a >= 224 // multicast / reserved
  );
}

class BadUrl extends Error {
  constructor(public code: string) {
    super(code);
  }
}

/** Chỉ cho http/https trỏ tới địa chỉ công khai. Ném BadUrl nếu không đạt. */
async function assertPublicUrl(raw: string): Promise<void> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new BadUrl("bad_url");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new BadUrl("bad_protocol");
  }
  // Host là IP -> kiểm tra thẳng; là tên miền -> phải phân giải rồi mới biết.
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host)) {
    if (isPrivateIp(host)) throw new BadUrl("private_host");
    return;
  }
  let addrs;
  try {
    addrs = await lookup(host, { all: true });
  } catch {
    throw new BadUrl("dns_failed");
  }
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) {
    throw new BadUrl("private_host");
  }
}

/**
 * Tải URL, tự đi theo redirect nhưng KIỂM TRA LẠI từng chặng — nếu chỉ kiểm tra
 * link đầu rồi để fetch tự follow, link công khai vẫn có thể redirect về nội bộ.
 */
async function fetchImage(rawUrl: string): Promise<Response> {
  let url = rawUrl;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicUrl(url);
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Một số site chặn request không có UA.
      headers: { "user-agent": "Mozilla/5.0 (compatible; LaptopChinhNguyenBot)" },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new BadUrl("bad_redirect");
      url = new URL(loc, url).toString();
      continue;
    }
    return res;
  }
  throw new BadUrl("too_many_redirects");
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { url?: string } | null;
  const link = body?.url?.trim();
  if (!link) {
    return NextResponse.json({ ok: false, error: "no_url" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetchImage(link);
  } catch (err) {
    if (err instanceof BadUrl) {
      return NextResponse.json({ ok: false, error: err.code }, { status: 400 });
    }
    console.error("Tải ảnh từ link lỗi:", err);
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 400 });
  }

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 400 });
  }

  // Bỏ phần ";charset=..." nếu có.
  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = IMAGE_EXT[type];
  if (!ext) {
    return NextResponse.json({ ok: false, error: "bad_type" }, { status: 400 });
  }

  // Chặn sớm theo content-length để khỏi tải về file khổng lồ.
  const declared = Number(res.headers.get("content-length") ?? 0);
  if (declared > MAX_IMAGE_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  // Không phải site nào cũng khai content-length -> kiểm tra lại sau khi tải.
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  if (buffer.byteLength === 0) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  const url = await saveImage(buffer, ext);
  return NextResponse.json({ ok: true, url });
}
