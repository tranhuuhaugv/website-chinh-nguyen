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
    <div className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-black px-1 text-[18px] font-extrabold tabular-nums text-white ring-1 ring-white/10">
      {children}
    </div>
  );

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[12px] font-bold uppercase tracking-wide text-white">
        Kết thúc trong
      </span>
      <div className="flex items-center gap-1.5">
        <Box>{hh}</Box>
        <span className="font-extrabold text-white">:</span>
        <Box>{mm}</Box>
        <span className="font-extrabold text-white">:</span>
        <Box>{ss}</Box>
      </div>
    </div>
  );
}
