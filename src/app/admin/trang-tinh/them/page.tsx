"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";

// Tạo trang nội dung mới: nhập tên + slug -> sang trình soạn (điền nội dung ->
// bấm Lưu sẽ tạo trang thật). Slug hợp lệ: chữ thường/số/gạch.
export default function CreatePagePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slugRaw, setSlugRaw] = useState("");

  const slug = (slugRaw || slugify(title)).trim();
  const valid = title.trim().length >= 2 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

  const inputCls =
    "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-green";

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <Link
          href="/admin/trang-tinh"
          className="text-[13px] text-muted transition hover:text-green-d"
        >
          ← Quay lại
        </Link>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <h1 className="mb-5 text-[17px] font-bold text-ink">Thêm trang nội dung</h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-ink">
              Tên trang *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Tuyển dụng, Câu hỏi thường gặp…"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-ink">
              Đường dẫn (slug) — để trống sẽ tự tạo từ tên
            </label>
            <input
              value={slugRaw}
              onChange={(e) => setSlugRaw(e.target.value)}
              placeholder={slugify(title) || "tuyen-dung"}
              className={inputCls}
            />
            <p className="mt-1.5 text-[12.5px] text-muted">
              Trang sẽ ở địa chỉ: <code className="text-ink-2">/chinh-sach/{slug || "…"}</code>
            </p>
          </div>

          <button
            type="button"
            disabled={!valid}
            onClick={() =>
              router.push(
                `/admin/trang-tinh/${slug}?title=${encodeURIComponent(title.trim())}`,
              )
            }
            className="mt-1 h-11 rounded-xl bg-green px-6 text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-50"
          >
            Tiếp tục — soạn nội dung
          </button>
          <p className="text-[12.5px] text-muted">
            Bấm tiếp tục để soạn nội dung; trang chỉ được tạo thật khi bạn bấm
            <b> Lưu</b> ở bước sau.
          </p>
        </div>
      </div>
    </div>
  );
}
