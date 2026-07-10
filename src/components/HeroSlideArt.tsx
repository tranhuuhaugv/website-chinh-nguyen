import type { BannerAccent, HeroSlide } from "@/lib/types";

// Nội dung 1 slide hero (HTML — chữ nét, dùng font site). Nền gradient nhiều lớp
// + quầng sáng + laptop mockup (SVG). Khi có ảnh banner thật -> thay bằng next/image
// (priority ở slide đầu để tối ưu LCP).

const ACCENT: Record<
  BannerAccent,
  {
    from: string;
    to: string;
    glow: string;
    scr: [string, string];
    badgeText: string;
    subText: string;
    ctaText: string;
  }
> = {
  green: {
    from: "#16A34E",
    to: "#0A5629",
    glow: "#1FB05B",
    scr: ["#2ED06E", "#0C6E34"],
    badgeText: "#B7F0CC",
    subText: "#D6F2E0",
    ctaText: "#0F7C39",
  },
  blue: {
    from: "#1E5FA8",
    to: "#123E70",
    glow: "#3D86D6",
    scr: ["#57A0EA", "#134A86"],
    badgeText: "#C4DBF6",
    subText: "#DCEAFA",
    ctaText: "#123E70",
  },
  purple: {
    from: "#6D3FB0",
    to: "#3F2470",
    glow: "#9A6BD6",
    scr: ["#B387EC", "#4A2A85"],
    badgeText: "#E0CEF7",
    subText: "#ECE1FA",
    ctaText: "#3F2470",
  },
};

// Laptop mockup gọn (SVG) — nét, scale mượt theo container.
function DeviceArt({ scr }: { scr: [string, string] }) {
  const id = `scr-${scr[0].replace("#", "")}`;
  return (
    <svg viewBox="0 0 460 300" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={scr[0]} />
          <stop offset="1" stopColor={scr[1]} />
        </linearGradient>
      </defs>
      <ellipse cx="230" cy="270" rx="200" ry="20" fill="#000" opacity="0.16" />
      <rect x="90" y="40" width="280" height="184" rx="16" fill="#10151B" />
      <rect x="104" y="54" width="252" height="156" rx="7" fill={`url(#${id})`} />
      <circle cx="170" cy="108" r="42" fill="#ffffff" opacity="0.16" />
      <circle cx="292" cy="160" r="32" fill="#ffffff" opacity="0.13" />
      <rect x="150" y="86" width="160" height="10" rx="5" fill="#ffffff" opacity="0.22" />
      <rect x="150" y="112" width="110" height="8" rx="4" fill="#ffffff" opacity="0.16" />
      <path d="M56 224 H404 L444 270 H16 Z" fill="#DCE0E6" />
      <path d="M56 224 H404 L406 231 H54 Z" fill="#00000018" />
      <rect x="196" y="227" width="68" height="7" rx="3.5" fill="#AEB4BB" />
    </svg>
  );
}

export function HeroSlideArt({ slide }: { slide: HeroSlide }) {
  const c = ACCENT[slide.accent];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `linear-gradient(120deg, ${c.from} 0%, ${c.to} 100%)`,
      }}
    >
      {/* Lớp quầng sáng + hoạ tiết cho có chiều sâu */}
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full opacity-60"
        style={{
          background: `radial-gradient(circle, ${c.glow}66 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, ${c.glow}55 0%, transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,transparent_35%)]" />

      {/* Nội dung */}
      <div className="relative flex h-full items-center justify-between gap-6 px-[6%] max-[720px]:px-6">
        <div className="max-w-[560px]">
          {slide.badge && (
            <span
              className="inline-block rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm"
              style={{ color: c.badgeText }}
            >
              {slide.badge}
            </span>
          )}
          <h2 className="mt-4 text-[46px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white max-[1024px]:text-[38px] max-[720px]:text-[28px]">
            {slide.title1}
            {slide.title2 && (
              <>
                <br />
                {slide.title2}
              </>
            )}
          </h2>
          {slide.subtitle && (
            <p
              className="mt-4 text-[17px] font-medium max-[720px]:text-[13.5px]"
              style={{ color: c.subText }}
            >
              {slide.subtitle}
            </p>
          )}
          {slide.cta && (
            <span
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[15px] font-bold shadow-[0_10px_26px_rgba(0,0,0,0.22)] transition group-hover:-translate-y-0.5 max-[720px]:mt-4 max-[720px]:px-5 max-[720px]:py-2.5 max-[720px]:text-[13.5px]"
              style={{ color: c.ctaText }}
            >
              {slide.cta}
              <span aria-hidden="true">→</span>
            </span>
          )}
        </div>

        <div className="w-[42%] max-w-[440px] shrink-0 max-[720px]:hidden">
          <DeviceArt scr={c.scr} />
        </div>
      </div>
    </div>
  );
}
