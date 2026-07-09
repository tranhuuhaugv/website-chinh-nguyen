import type { ReactNode } from "react";
import Link from "next/link";

// Khung dùng chung cho trang đăng nhập / đăng ký: logo + thẻ trắng canh giữa.
// Server Component. Thẻ <h1> ở đây là h1 duy nhất của trang (SEO).

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-green-tint to-bg px-4 py-10">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center">
        <Link
          href="/"
          className="mb-6 self-center text-[26px] font-bold tracking-[-0.02em] text-green"
        >
          Chính <span className="text-green-dd">Nguyễn</span>
        </Link>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-8">
          <h1 className="text-xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-[13.5px] text-ink-2">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <p className="mt-5 text-center text-[13.5px] text-ink-2">{footer}</p>
        )}
        <Link
          href="/"
          className="mt-4 self-center text-[13px] text-muted transition hover:text-green-d"
        >
          ← Về trang chủ
        </Link>
      </div>
    </main>
  );
}
