import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import type { OrderInput } from "./validations/order";
import { formatPrice } from "./format";
import { SITE } from "./site";

// Gửi email thông báo đơn hàng về Gmail. Chạy phía server (API route).
// Cần đặt biến môi trường (server, KHÔNG có NEXT_PUBLIC):
//   GMAIL_USER           = địa chỉ Gmail dùng để gửi
//   GMAIL_APP_PASSWORD   = App Password của Gmail (bật 2FA rồi tạo)
//   MAIL_TO              = nơi nhận thông báo (mặc định = GMAIL_USER)
// Chưa đặt -> không gửi (chế độ demo), trả về false.

const { GMAIL_USER, GMAIL_APP_PASSWORD, MAIL_TO } = process.env;

export const mailReady = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

// Bảng màu (khớp giao diện site).
const C = {
  green: "#0F7C39",
  greenD: "#0A5C2A",
  ink: "#17201A",
  ink2: "#3E4A42",
  muted: "#7A857E",
  sale: "#E23A34",
  line: "#E4E8E3",
  bg: "#F2F5F2",
  soft: "#EAF5EE",
};

/**
 * Ảnh sản phẩm trong email được NHÚNG THẲNG vào thư (đính kèm dạng cid) thay vì
 * trỏ link ra website.
 *
 * Vì sao: Gmail CHẶN ảnh ngoài với thư từ người gửi chưa xác thực -> thư báo
 * shop (gửi cho chính mình) thì hiện ảnh, còn thư gửi KHÁCH thì mất ảnh, dù
 * HTML hai thư giống hệt nhau. Ảnh nhúng thì luôn hiện, không phụ thuộc Gmail,
 * và cũng đỡ bị đánh spam hơn (ảnh remote là một dấu hiệu spam).
 *
 * Ảnh nằm sẵn trên đĩa VPS (public/uploads) -> đọc thẳng bằng fs, không gọi HTTP.
 */
function cidCuaAnh(url: string): string {
  // cid phải là chuỗi an toàn, không trùng nhau giữa các ảnh trong 1 thư.
  return `anh-${createHash("md5").update(url).digest("hex").slice(0, 12)}`;
}

/** Đọc file ảnh trong public/uploads -> phần đính kèm cid. Ảnh lỗi -> null. */
async function docAnhDeNhung(
  url: string,
): Promise<{ filename: string; content: Buffer; cid: string } | null> {
  // Chỉ nhận ảnh tự host. Chặn ../ để không đọc lung tung ngoài thư mục uploads.
  const m = /^\/uploads\/([A-Za-z0-9._-]+)$/.exec(url);
  if (!m) return null;
  try {
    const duongDan = path.join(process.cwd(), "public", "uploads", m[1]);
    const content = await readFile(duongDan);
    // Ảnh quá nặng thì thôi, đừng để thư phình to.
    if (content.byteLength > MAX_ANH_NHUNG) return null;
    return { filename: m[1], content, cid: cidCuaAnh(url) };
  } catch {
    return null;
  }
}

/** Ảnh nhúng tối đa cho mỗi ảnh (thư quá nặng dễ bị chặn / vào spam). */
const MAX_ANH_NHUNG = 2 * 1024 * 1024;

/**
 * URL ảnh dùng trong HTML email:
 *  - Ảnh tự host -> "cid:..." (nhúng kèm thư).
 *  - Ảnh http(s) bên ngoài -> giữ nguyên link.
 */
function srcAnhEmail(url: string | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `cid:${cidCuaAnh(url)}`;
}

// 1 dòng thông tin (nhãn trái / giá trị phải).
function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:9px 0;color:${C.muted};font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:9px 0 9px 16px;color:${C.ink};font-size:14px;font-weight:600;text-align:right">${value}</td>
    </tr>`;
}

// Khung ngoài + header + footer dùng chung cho mọi email.
function shell(headTitle: string, headSub: string, inner: string): string {
  return `
  <div style="margin:0;padding:24px 12px;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
      <tr><td style="background:#ffffff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">

        <!-- Header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:linear-gradient(135deg,${C.greenD},${C.green});padding:22px 28px">
            <div style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:.2px">${SITE.name}</div>
            <div style="color:#D8F0E1;font-size:13px;margin-top:2px">${headSub}</div>
          </td></tr>
        </table>

        <!-- Tiêu đề -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:24px 28px 4px">
            <div style="font-size:16px;font-weight:800;color:${C.ink}">${headTitle}</div>
          </td></tr>
        </table>

        ${inner}

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 28px 26px;border-top:1px solid ${C.line}">
            <div style="font-size:12.5px;color:${C.muted};line-height:1.7">
              <b style="color:${C.ink2}">${SITE.name}</b><br/>
              Hotline: ${SITE.hotline} · ${SITE.email}<br/>
              ${SITE.hours}
            </div>
          </td></tr>
        </table>

      </td></tr>
    </table>
    <div style="text-align:center;color:${C.muted};font-size:11.5px;margin-top:14px">
      Email tự động từ website ${SITE.name}
    </div>
  </div>`;
}

// Khối card bo góc bên trong (tiêu đề mục + nội dung).
function card(title: string, body: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:12px 28px 0">
      <div style="border:1px solid ${C.line};border-radius:12px;overflow:hidden">
        <div style="background:${C.soft};padding:10px 16px;font-size:12.5px;font-weight:700;color:${C.greenD};text-transform:uppercase;letter-spacing:.4px">${title}</div>
        <div style="padding:6px 16px 14px">${body}</div>
      </div>
    </td></tr>
  </table>`;
}

// 1 sản phẩm: thumbnail + tên + (số lượng × đơn giá) + thành tiền.
function itemRow(i: {
  name: string;
  price: number;
  qty: number;
  image?: string;
}): string {
  const src = srcAnhEmail(i.image);
  const pic = src
    ? `<img src="${src}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;border-radius:10px;border:1px solid ${C.line};object-fit:cover;background:#fff" />`
    : `<div style="width:56px;height:56px;border-radius:10px;border:1px solid ${C.line};background:${C.bg}"></div>`;
  return `
    <tr>
      <td style="padding:10px 0;width:56px;vertical-align:top">${pic}</td>
      <td style="padding:10px 0 10px 12px;vertical-align:top">
        <div style="font-size:14px;font-weight:600;color:${C.ink};line-height:1.4">${i.name}</div>
        <div style="font-size:12.5px;color:${C.muted};margin-top:3px">${i.qty} × ${formatPrice(i.price)}</div>
      </td>
      <td style="padding:10px 0;vertical-align:top;text-align:right;white-space:nowrap;font-size:14px;font-weight:700;color:${C.ink}">${formatPrice(i.price * i.qty)}</td>
    </tr>`;
}

// ——— Các khối nội dung dùng lại cho cả email shop lẫn email khách ———

function tradeInfoCards(order: Extract<OrderInput, { type: "tradein" }>): string {
  const info = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Họ và tên", order.name)}
      ${row("Số điện thoại", order.phone)}
      ${row("Email", order.email)}
      ${row("Địa chỉ", order.address)}
    </table>`;
  const trade = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Mẫu máy cần thu", order.model)}
      ${order.upgradeTo ? row("Muốn lên đời", order.upgradeTo) : ""}
      ${order.note ? row("Mô tả tình trạng", order.note) : ""}
    </table>`;
  return card("Thông tin khách hàng", info) + card("Máy cần thu", trade);
}

function purchaseCards(
  order: Extract<OrderInput, { type: "purchase" }>,
  /** Email khách (nếu có) — chỉ hiện ở thư báo shop để tiện liên hệ lại. */
  customerEmail?: string | null,
): string {
  const info = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Họ và tên", order.name)}
      ${row("Số điện thoại", order.phone)}
      ${customerEmail ? row("Email", customerEmail) : ""}
      ${row("Địa chỉ giao", order.address)}
      ${order.note ? row("Ghi chú", order.note) : ""}
    </table>`;
  const products = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${order.items.map(itemRow).join("")}
      <tr><td colspan="3" style="border-top:1px solid ${C.line};padding-top:12px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:14px;font-weight:800;color:${C.ink}">Tổng cộng</td>
          <td style="text-align:right;font-size:18px;font-weight:800;color:${C.sale}">${formatPrice(order.total)}</td>
        </tr></table>
      </td></tr>
    </table>`;
  return card("Thông tin giao hàng", info) + card("Sản phẩm", products);
}

// Khối "cam kết" trong email GỬI KHÁCH.
function commitmentsCard(type: OrderInput["type"]): string {
  const lines =
    type === "purchase"
      ? [
          "Trong vòng <b>15 phút</b>, chúng tôi sẽ liên hệ để xác nhận đơn hàng.",
          "Đơn đặt từ <b>21h30 tối đến 8h sáng</b> hôm sau sẽ được liên hệ xác nhận <b>trước 9h sáng</b> cùng ngày.",
          "Thanh toán khi nhận hàng (COD) — Quý khách được kiểm tra máy trước khi thanh toán.",
        ]
      : [
          "Trong vòng <b>15 phút</b>, kỹ thuật viên sẽ liên hệ để định giá máy cũ của Quý khách.",
          "Yêu cầu gửi từ <b>21h30 tối đến 8h sáng</b> hôm sau sẽ được liên hệ <b>trước 9h sáng</b> cùng ngày.",
          "Định giá minh bạch, trừ thẳng vào giá máy mới khi Quý khách lên đời.",
        ];
  const body = lines
    .map(
      (l) =>
        `<div style="font-size:13.5px;color:${C.ink2};line-height:1.6;padding:5px 0">• ${l}</div>`,
    )
    .join("");
  return card("Cam kết của chúng tôi", body);
}

// Email GỬI SHOP (thông báo có đơn mới).
function buildAdminEmail(
  order: OrderInput,
  customerEmail?: string | null,
): { subject: string; html: string } {
  if (order.type === "tradein") {
    return {
      subject: `[Thu cũ đổi mới] ${order.name} - ${order.model}`,
      html: shell(
        "Yêu cầu thu cũ đổi mới",
        "Có khách gửi yêu cầu thu cũ đổi mới",
        tradeInfoCards(order),
      ),
    };
  }
  return {
    subject: `[Đơn hàng mới] ${order.name} - ${formatPrice(order.total)}`,
    html: shell(
      "Đơn hàng mới (COD)",
      "Có đơn hàng mới trên website",
      purchaseCards(order, customerEmail),
    ),
  };
}

// Email GỬI KHÁCH (xác nhận + cảm ơn).
function buildCustomerEmail(order: OrderInput): { subject: string; html: string } {
  const greeting = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:4px 28px 0;font-size:14px;color:${C.ink2};line-height:1.7">
        Chào <b style="color:${C.ink}">${order.name}</b>,<br/>
        Cảm ơn Quý khách đã ${order.type === "purchase" ? "đặt hàng" : "gửi yêu cầu thu cũ đổi mới"} tại <b style="color:${C.greenD}">${SITE.name}</b>. Chúng tôi đã ghi nhận thông tin của Quý khách.
      </td></tr>
    </table>`;

  if (order.type === "tradein") {
    return {
      subject: `Xác nhận yêu cầu thu cũ đổi mới - ${SITE.name}`,
      html: shell(
        "Đã nhận yêu cầu thu cũ đổi mới",
        "Cảm ơn Quý khách",
        greeting + tradeInfoCards(order) + commitmentsCard("tradein"),
      ),
    };
  }
  return {
    subject: `Xác nhận đơn hàng - ${SITE.name}`,
    html: shell(
      "Đặt hàng thành công!",
      "Cảm ơn Quý khách đã mua hàng",
      greeting + purchaseCards(order) + commitmentsCard("purchase"),
    ),
  };
}

// Transporter dạng singleton + pool: giữ sẵn kết nối tới Gmail thay vì bắt tay
// SMTP lại từ đầu cho từng email (mỗi lần bắt tay tốn ~1-2 giây).
const globalForMail = globalThis as unknown as {
  mailTransporter?: nodemailer.Transporter;
};

function getTransporter(): nodemailer.Transporter {
  const transporter =
    globalForMail.mailTransporter ??
    nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      pool: true,
      maxConnections: 2,
    });
  globalForMail.mailTransporter = transporter;
  return transporter;
}

async function sendMail(
  subject: string,
  html: string,
  to: string,
  /** Bấm "Trả lời" trong thư báo shop -> gửi thẳng cho khách. */
  replyTo?: string,
  /** Ảnh nhúng kèm thư (src="cid:..." trong html). */
  attachments?: { filename: string; content: Buffer; cid: string }[],
): Promise<boolean> {
  if (!mailReady || !to) return false;
  await getTransporter().sendMail({
    from: `"${SITE.name}" <${GMAIL_USER}>`,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
    ...(attachments?.length ? { attachments } : {}),
  });
  return true;
}

/**
 * Gửi email cho đơn: (1) thông báo về shop, (2) xác nhận cho khách (nếu có email).
 * Email khách: đơn thu cũ lấy từ form; đơn mua lấy từ `customerEmail` (ô email
 * hoặc email tài khoản). Trả về true nếu email SHOP gửi thành công.
 */
export async function sendOrderEmail(
  order: OrderInput,
  customerEmail?: string | null,
): Promise<boolean> {
  const toCustomer =
    order.type === "tradein" ? order.email : (customerEmail ?? "").trim();
  const admin = buildAdminEmail(order, toCustomer);

  // Đọc ảnh sản phẩm để nhúng kèm thư (cả 2 thư dùng chung bộ đính kèm).
  const anhKem =
    order.type === "purchase" ? await docAnhSanPham(order.items) : [];

  // Gửi song song: email khách không phải chờ email shop xong.
  const [adminOk] = await Promise.all([
    sendMail(
      admin.subject,
      admin.html,
      MAIL_TO || GMAIL_USER || "",
      toCustomer || undefined,
      anhKem,
    ),
    (async () => {
      if (!toCustomer) return false;
      const cust = buildCustomerEmail(order);
      // Không để lỗi gửi khách làm hỏng kết quả chung.
      return sendMail(
        cust.subject,
        cust.html,
        toCustomer,
        undefined,
        anhKem,
      ).catch((err) => {
        console.error("Gửi email xác nhận cho khách lỗi:", err);
        return false;
      });
    })(),
  ]);

  return adminOk;
}

/** Đọc ảnh của các sản phẩm trong đơn -> danh sách đính kèm (khử trùng ảnh). */
async function docAnhSanPham(
  items: { image?: string }[],
): Promise<{ filename: string; content: Buffer; cid: string }[]> {
  const urls = Array.from(
    new Set(items.map((i) => i.image).filter((u): u is string => Boolean(u))),
  );
  const ket = await Promise.all(urls.map(docAnhDeNhung));
  return ket.filter((a): a is NonNullable<typeof a> => a !== null);
}

/**
 * Gửi link đặt lại mật khẩu cho khách. `link` phải là URL tuyệt đối.
 * Trả về false nếu chưa cấu hình Gmail (chế độ demo).
 */
export async function sendPasswordResetEmail(
  to: string,
  link: string,
  minutes: number,
): Promise<boolean> {
  const body = `
    <div style="font-size:14px;color:${C.ink2};line-height:1.7;padding:6px 0">
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <b style="color:${C.ink}">${to}</b>.
      Bấm nút bên dưới để đặt mật khẩu mới.
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px 0 6px">
      <tr><td style="border-radius:10px;background:${C.green}">
        <a href="${link}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none">
          Đặt lại mật khẩu
        </a>
      </td></tr>
    </table>
    <div style="font-size:12.5px;color:${C.muted};line-height:1.7;padding-top:6px">
      Link chỉ dùng được <b>1 lần</b> và hết hạn sau <b>${minutes} phút</b>.<br/>
      Nút không bấm được thì sao chép link này vào trình duyệt:<br/>
      <span style="color:${C.ink2};word-break:break-all">${link}</span><br/><br/>
      Nếu Quý khách <b>không</b> yêu cầu đặt lại mật khẩu, hãy bỏ qua email này —
      mật khẩu hiện tại vẫn giữ nguyên.
    </div>`;
  const html = shell(
    "Đặt lại mật khẩu",
    "Yêu cầu đặt lại mật khẩu",
    card("Xác nhận yêu cầu", body),
  );
  return sendMail(`Đặt lại mật khẩu - ${SITE.name}`, html, to);
}

export async function sendRegisterEmail(user: {
  name: string;
  email: string;
  phone: string;
}): Promise<boolean> {
  const subject = `[Tài khoản mới] ${user.name}`;
  const info = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Họ và tên", user.name)}
      ${row("Email", user.email)}
      ${row("Số điện thoại", user.phone)}
    </table>`;
  const html = shell(
    "Khách hàng vừa đăng ký tài khoản",
    "Có tài khoản mới trên website",
    card("Thông tin tài khoản", info),
  );
  return sendMail(subject, html, MAIL_TO || GMAIL_USER || "");
}
