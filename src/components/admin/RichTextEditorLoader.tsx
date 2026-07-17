"use client";

import dynamic from "next/dynamic";

// CKEditor đụng tới `window` -> phải nạp ở trình duyệt (ssr: false).
// Nạp động luôn giữ cho CKEditor CHỈ tải ở trang admin, không lọt vào trang khách.
export const RichTextEditorLoader = dynamic(
  () => import("./RichTextEditor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-line bg-bg px-3 py-6 text-center text-[13px] text-muted">
        Đang tải trình soạn thảo…
      </div>
    ),
  },
);
