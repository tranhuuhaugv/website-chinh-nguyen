"use client";

import { useRouter } from "next/navigation";

// Chọn tháng để lọc số liệu dashboard. Đổi tháng -> cập nhật ?thang=YYYY-MM.
// `key={value}` khiến input remount theo tháng đang xem (từ server) nên LUÔN
// khớp URL, kể cả khi bấm back/forward — tránh hiện 1 tháng mà số liệu tháng khác.
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
          // scroll:false -> đổi tháng KHÔNG nhảy lên đầu trang. Bỏ router.refresh
          // (ép tải lại toàn bộ) -> back/forward là điều hướng mềm, Next tự khôi
          // phục vị trí cuộn, không reload cả trang. Trang /admin đã force-dynamic
          // nên mỗi URL tháng vẫn tự lấy số liệu mới từ server.
          router.push(`/admin?thang=${v}`, { scroll: false });
        }}
        className="h-9 rounded-lg border border-line bg-white px-2.5 text-[13px] text-ink outline-none focus:border-green"
      />
    </label>
  );
}
