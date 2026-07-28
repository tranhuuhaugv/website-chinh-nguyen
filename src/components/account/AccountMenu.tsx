"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartIcon, UserIcon } from "@/components/icons";

// Nút tài khoản trên Header. Đổi giao diện theo trạng thái đăng nhập:
// - Chưa đăng nhập: link "Tài khoản" -> /dang-nhap.
// - Đã đăng nhập: hiện tên + menu (thông tin, đơn hàng, đăng xuất).
// Tự lấy trạng thái qua /api/me (client) để Header vẫn là component tĩnh, cache được.
export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setUserName(d?.user?.name ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!userName) {
    return (
      <Link
        href="/dang-nhap"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink transition hover:bg-bg"
      >
        <UserIcon className="h-5 w-5" />
        <span className="max-[900px]:hidden">Tài khoản</span>
      </Link>
    );
  }

  const firstName = userName.trim().split(/\s+/).pop() || userName;

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setOpen(false);
    setUserName(null);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink transition hover:bg-bg"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-soft text-[13px] font-bold uppercase text-green-d">
          {firstName.charAt(0)}
        </span>
        <span className="max-[900px]:hidden">{firstName}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-line bg-white py-1.5 text-ink shadow-lg">
          <div className="border-b border-line px-4 py-2.5">
            <p className="text-[11px] text-muted">Xin chào</p>
            <p className="truncate text-[13.5px] font-semibold text-ink">
              {userName}
            </p>
          </div>
          <Link
            href="/tai-khoan"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition hover:bg-bg"
          >
            <UserIcon className="h-[18px] w-[18px] text-muted" />
            Thông tin tài khoản
          </Link>
          <Link
            href="/tai-khoan/don-hang"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition hover:bg-bg"
          >
            <CartIcon className="h-[18px] w-[18px] text-muted" />
            Đơn hàng của tôi
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 border-t border-line px-4 py-2.5 text-left text-[13.5px] text-sale transition hover:bg-bg"
          >
            <svg
              className="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
