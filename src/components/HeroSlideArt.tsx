import type { BannerAccent, HeroSlide } from "@/lib/types";

// Ảnh banner placeholder cho 1 slide (SVG). Khi có ảnh thật, thay component này
// bằng next/image (priority ở slide đầu để tối ưu LCP).

const ACCENT: Record<
  BannerAccent,
  {
    bg: [string, string];
    scr: [string, string];
    badge: string;
    sub: string;
    ctaText: string;
  }
> = {
  green: {
    bg: ["#0F7C39", "#0B5E2C"],
    scr: ["#1FB05B", "#0C6E34"],
    badge: "#8FE9AF",
    sub: "#CFEFD9",
    ctaText: "#0F7C39",
  },
  blue: {
    bg: ["#1E5FA8", "#123E70"],
    scr: ["#3D86D6", "#134A86"],
    badge: "#AECBEE",
    sub: "#D3E4F7",
    ctaText: "#123E70",
  },
  purple: {
    bg: ["#6D3FB0", "#3F2470"],
    scr: ["#9A6BD6", "#4A2A85"],
    badge: "#D3BEEF",
    sub: "#E7DAF7",
    ctaText: "#3F2470",
  },
};

export function HeroSlideArt({ slide }: { slide: HeroSlide }) {
  const c = ACCENT[slide.accent];
  const bgId = `hero-bg-${slide.id}`;
  const scrId = `hero-scr-${slide.id}`;

  return (
    <svg
      viewBox="0 0 1200 380"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.bg[0]} />
          <stop offset="1" stopColor={c.bg[1]} />
        </linearGradient>
        <linearGradient id={scrId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.scr[0]} />
          <stop offset="1" stopColor={c.scr[1]} />
        </linearGradient>
      </defs>
      <rect width="1200" height="380" fill={`url(#${bgId})`} />
      <circle cx="1050" cy="70" r="230" fill="#ffffff" opacity="0.05" />
      <circle cx="140" cy="360" r="180" fill="#ffffff" opacity="0.04" />
      {slide.badge && (
        <text
          x="80"
          y="120"
          fill={c.badge}
          fontFamily="Arial"
          fontSize="20"
          fontWeight="700"
          letterSpacing="3"
        >
          {slide.badge}
        </text>
      )}
      <text
        x="78"
        y="188"
        fill="#ffffff"
        fontFamily="Arial"
        fontSize="58"
        fontWeight="700"
      >
        {slide.title1}
      </text>
      {slide.title2 && (
        <text
          x="78"
          y="250"
          fill="#ffffff"
          fontFamily="Arial"
          fontSize="58"
          fontWeight="700"
        >
          {slide.title2}
        </text>
      )}
      {slide.subtitle && (
        <text x="80" y="298" fill={c.sub} fontFamily="Arial" fontSize="21">
          {slide.subtitle}
        </text>
      )}
      {slide.cta && (
        <>
          <rect x="80" y="318" width="200" height="46" rx="23" fill="#ffffff" />
          <text
            x="180"
            y="347"
            fill={c.ctaText}
            fontFamily="Arial"
            fontSize="18"
            fontWeight="700"
            textAnchor="middle"
          >
            {slide.cta} →
          </text>
        </>
      )}
      <g transform="translate(760,70)">
        <ellipse cx="210" cy="250" rx="200" ry="20" fill="#000" opacity="0.12" />
        <rect x="70" y="30" width="280" height="180" rx="14" fill="#141A20" />
        <rect x="84" y="44" width="252" height="152" rx="6" fill={`url(#${scrId})`} />
        <circle cx="150" cy="95" r="40" fill="#ffffff" opacity="0.14" />
        <circle cx="270" cy="150" r="30" fill="#ffffff" opacity="0.12" />
        <path d="M40 210 H380 L420 254 H0 Z" fill="#D7DBE0" />
        <rect x="175" y="213" width="70" height="7" rx="3" fill="#AEB4BB" />
      </g>
    </svg>
  );
}
