"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Gửi 1 "lượt xem" tới /api/track mỗi khi khách mở/đổi trang (trừ khu admin).
// Định danh phiên bằng id ngẫu nhiên lưu ở localStorage (để ước lượng đang online).
export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    let vid = "";
    try {
      vid = localStorage.getItem("cn_vid") || "";
      if (!vid) {
        vid =
          (crypto.randomUUID && crypto.randomUUID()) ||
          String(Date.now()) + Math.random().toString(36).slice(2);
        localStorage.setItem("cn_vid", vid);
      }
    } catch {
      /* localStorage không dùng được -> vẫn đếm lượt xem, chỉ thiếu 'đang online' */
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vid, path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
