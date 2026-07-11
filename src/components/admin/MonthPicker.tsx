"use client";

import { useRouter } from "next/navigation";

// Chọn tháng để lọc số liệu dashboard. Đổi tháng -> cập nhật ?thang=YYYY-MM.
export function MonthPicker({ value }: { value: string }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-[13px] text-ink-2">
      <span className="font-medium">Xem tháng:</span>
      <input
        type="month"
        defaultValue={value}
        onChange={(e) => {
          if (e.target.value) router.push(`/admin?thang=${e.target.value}`);
        }}
        className="h-9 rounded-lg border border-line bg-white px-2.5 text-[13px] text-ink outline-none focus:border-green"
      />
    </label>
  );
}
