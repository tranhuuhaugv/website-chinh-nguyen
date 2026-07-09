"use client";

import type { ReactNode } from "react";
import { useSiteSettings } from "./SiteSettingsContext";

// Ẩn/hiện khối Flash Sale theo cài đặt admin. FlashSale vẫn render phía server
// (truyền qua children) — gate chỉ quyết định hiển thị hay không.
export function FlashSaleGate({ children }: { children: ReactNode }) {
  const { settings } = useSiteSettings();
  if (!settings.flashSaleEnabled) return null;
  return <>{children}</>;
}
