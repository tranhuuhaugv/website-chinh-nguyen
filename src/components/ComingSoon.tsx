import { SITE } from "@/lib/site";

// Trang chủ tạm thời "Website đang hoàn thiện" — bật/tắt qua Setting "comingSoon"
// ở admin. Tự chứa (không Header/Footer) để trông như một trang chờ độc lập.

export function ComingSoon() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B1F12] via-[#0E2A18] to-[#07130B] px-6 py-16 text-center text-white">
      {/* Vầng sáng nền */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-[#0B5E2C]/30 blur-[130px]" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.25em] text-white/80">
          Laptop Chính Nguyễn
        </span>

        {/* Icon bánh răng */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#12A150] to-[#0B5E2C] shadow-[0_12px_44px_rgba(11,94,44,0.55)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-white"
            aria-hidden="true"
          >
            <path
              d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M19.4 13a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-[30px] font-extrabold leading-tight sm:text-[40px]">
          Website đang hoàn thiện
        </h1>

        <p className="text-[15px] leading-relaxed text-white/70">
          Chúng tôi đang hoàn thiện những khâu cuối và chuẩn bị đưa vào vận hành.
          Vui lòng quay lại sau — cảm ơn bạn đã ghé thăm!
        </p>

        {/* Thanh tiến trình trang trí */}
        <div className="mt-1 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#12A150] to-[#7EE0A0]" />
        </div>

        {/* Liên hệ */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-[13px] text-white/55">
            Liên hệ tư vấn / đặt hàng
          </span>
          <a
            href={`tel:${SITE.hotlineTel}`}
            className="text-[24px] font-black text-[#7EE0A0]"
          >
            {SITE.hotline}
          </a>
        </div>
      </div>

      <p className="absolute bottom-6 text-[12px] text-white/40">
        © 2026 {SITE.name}
      </p>
    </main>
  );
}
