"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";

// Xoá 1 trang nội dung TUỲ CHỈNH (admin tự tạo).
export function DeletePageButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm(`Xoá trang "${title}"? Thao tác không thể hoàn tác.`)) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/pages?id=${encodeURIComponent(slug)}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        router.refresh();
      } else {
        alert("Xoá thất bại, thử lại.");
        setBusy(false);
      }
    } catch {
      alert("Lỗi kết nối máy chủ.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={del}
      aria-label="Xoá trang"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-40"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
