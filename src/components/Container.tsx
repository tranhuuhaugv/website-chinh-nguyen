import type { ReactNode } from "react";

/** Khung nội dung tối đa 1200px, canh giữa — dùng lại ở mọi section. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-wrap px-5 ${className}`}>
      {children}
    </div>
  );
}
