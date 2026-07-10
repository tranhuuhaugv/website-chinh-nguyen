import type { ReactNode } from "react";
import { Container } from "../Container";

// Bộ khối dựng bố cục kiểu "landing/tạp chí" cho các trang tĩnh:
// các dải (band) full-width xen kẽ nền trắng / xám, nhiều khoảng trắng,
// hạn chế viền/ô để trang thoáng và dễ đọc.

/** 1 dải section full-width. tone: "white" | "tint" (xám nhạt) | "green" (gradient). */
export function Band({
  tone = "white",
  children,
  className = "",
}: {
  tone?: "white" | "tint" | "green";
  children: ReactNode;
  className?: string;
}) {
  const bg =
    tone === "tint"
      ? "bg-bg"
      : tone === "green"
        ? "bg-gradient-to-br from-green-d via-green to-green-dd text-white"
        : "bg-white";
  return (
    <section className={`py-16 max-[600px]:py-11 ${bg} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Tiêu đề section kiểu landing: eyebrow nhỏ + heading lớn + mô tả (tuỳ chọn). */
export function SectionIntro({
  eyebrow,
  title,
  desc,
  center = false,
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
  /** invert=true khi đặt trên nền tối (band green). */
  invert?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`mb-2.5 text-[12.5px] font-bold uppercase tracking-[0.16em] ${
            invert ? "text-white/80" : "text-green-d"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[30px] font-extrabold leading-[1.12] tracking-[-0.02em] max-[600px]:text-[24px] ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-3.5 text-[15px] leading-relaxed ${
            invert ? "text-white/85" : "text-ink-2"
          }`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
