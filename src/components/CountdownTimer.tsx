"use client";

import { useEffect, useState } from "react";

// Đếm ngược tới hết ngày (23:59:59). Chỉ đây mới cần Client Component;
// phần còn lại của Flash Sale render phía server.

function secondsUntilEndOfDay(): number {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function CountdownTimer() {
  // null ở lần render đầu để server và client khớp nhau (tránh hydration mismatch).
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    setLeft(secondsUntilEndOfDay());
    const id = setInterval(() => setLeft(secondsUntilEndOfDay()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = left === null ? "--" : pad(Math.floor(left / 3600));
  const mm = left === null ? "--" : pad(Math.floor((left % 3600) / 60));
  const ss = left === null ? "--" : pad(left % 60);

  const Box = ({ children }: { children: string }) => (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[14px] font-bold text-green-dd">
      {children}
    </div>
  );

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-[12.5px] text-[#DFF3E6]">Kết thúc sau</span>
      <Box>{hh}</Box>
      <span className="font-bold text-white">:</span>
      <Box>{mm}</Box>
      <span className="font-bold text-white">:</span>
      <Box>{ss}</Box>
    </div>
  );
}
