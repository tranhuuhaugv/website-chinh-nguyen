"use client";

import { useRouter } from "next/navigation";

// Chọn tháng để lọc số liệu dashboard. Đổi tháng -> cập nhật ?thang=YYYY-MM.
// `value` là tháng đang xem (từ server) -> để input LUÔN khớp URL (controlled),
// tránh trường hợp hiển thị 1 tháng nhưng số liệu là tháng khác.
export function MonthPicker({ value }: { value: string }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-[13px] text-ink-2">
      <span className="font-medium">Xem tháng:</span>
      <input
        // key = tháng đang xem -> input remount mỗi lần server đổi tháng, luôn
        // khớp dữ liệu đang hiển thị (giữ uncontrolled cho native picker mượt).
        key={value}
        type="month"
        defaultValue={value}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) return;
          router.push(`/admin?thang=${v}`);
          // Ép lấy lại dữ liệu từ server (bỏ mọi bản cache phía client) để
          // biểu đồ đồng bộ ngay với tháng vừa chọn.
          router.refresh();
        }}
        className="h-9 rounded-lg border border-line bg-white px-2.5 text-[13px] text-ink outline-none focus:border-green"
      />
    </label>
  );
}
