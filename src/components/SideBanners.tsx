"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BannerAccent, BannerItem, SideBanner } from "@/lib/types";
import { CloseIcon } from "./icons";

// Banner treo dọc 2 bên trang. Chỉ hiện khi màn hình đủ rộng (>=1560px) để không
// đè lên nội dung (khung giữa 1200px). Có nút đóng. Client Component vì cần state đóng.

const GRADIENT: Record<BannerAccent, string> = {
  green: "bg-[linear-gradient(160deg,#159A48,#0B5E2C)]",
  blue: "bg-[linear-gradient(160deg,#1E5FA8,#123E70)]",
  purple: "bg-[linear-gradient(160deg,#6D3FB0,#3F2470)]",
};

function SideFrame({
  side,
  href,
  onClose,
  children,
}: {
  side: "left" | "right";
  href: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={`fixed top-[130px] z-40 hidden w-[150px] min-[1560px]:block ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng banner"
          className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-ink-2 shadow transition hover:text-ink"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
        <Link href={href} className="block">
          {children}
        </Link>
      </div>
    </aside>
  );
}

function ArtBody({ banner }: { banner: SideBanner }) {
  return (
    <span
      className={`flex h-[430px] flex-col justify-end rounded-xl p-4 text-white shadow-lg transition hover:brightness-105 ${
        GRADIENT[banner.accent]
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">
        Ưu đãi
      </span>
      <b className="mt-1 block text-lg font-bold leading-tight">
        {banner.title}
      </b>
      {banner.subtitle && (
        <p className="mt-1 text-[12.5px] text-white/85">{banner.subtitle}</p>
      )}
      <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
        Xem ngay →
      </span>
    </span>
  );
}

export function SideBanners({
  left,
  right,
  images = [],
}: {
  left: SideBanner;
  right: SideBanner;
  /** Ảnh admin tải lên (tối đa 2): [0]=trái, [1]=phải. Có ảnh -> thay art mặc định. */
  images?: BannerItem[];
}) {
  const [hidden, setHidden] = useState({ left: false, right: false });

  const sides: {
    key: "left" | "right";
    href: string;
    body: React.ReactNode;
  }[] = [
    {
      key: "left",
      href: images[0]?.image ? images[0].href : left.href,
      body: images[0]?.image ? (
        <span className="relative block h-[430px] overflow-hidden rounded-xl shadow-lg">
          <Image
            src={images[0].image}
            alt=""
            fill
            sizes="150px"
            className="object-cover"
          />
        </span>
      ) : (
        <ArtBody banner={left} />
      ),
    },
    {
      key: "right",
      href: images[1]?.image ? images[1].href : right.href,
      body: images[1]?.image ? (
        <span className="relative block h-[430px] overflow-hidden rounded-xl shadow-lg">
          <Image
            src={images[1].image}
            alt=""
            fill
            sizes="150px"
            className="object-cover"
          />
        </span>
      ) : (
        <ArtBody banner={right} />
      ),
    },
  ];

  return (
    <>
      {sides.map((s) =>
        hidden[s.key] ? null : (
          <SideFrame
            key={s.key}
            side={s.key}
            href={s.href}
            onClose={() => setHidden((h) => ({ ...h, [s.key]: true }))}
          >
            {s.body}
          </SideFrame>
        ),
      )}
    </>
  );
}
