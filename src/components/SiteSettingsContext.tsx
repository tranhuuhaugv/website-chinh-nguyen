"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Cài đặt hiển thị của site (bật/tắt các khối). Lưu localStorage cho tới khi có DB.
// Khi có backend: đọc/ghi từ bảng settings thay cho localStorage.

const STORAGE_KEY = "cn_settings_v1";

export interface SiteSettings {
  flashSaleEnabled: boolean;
}

const DEFAULTS: SiteSettings = {
  flashSaleEnabled: false,
};

interface SiteSettingsValue {
  settings: SiteSettings;
  ready: boolean;
  setSetting: <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => void;
}

const SiteSettingsContext = createContext<SiteSettingsValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      // bỏ qua dữ liệu hỏng
    }
    setReady(true);
  }, []);

  const setSetting = useCallback<SiteSettingsValue["setSetting"]>((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // bỏ qua nếu không ghi được
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ settings, ready, setSetting }),
    [settings, ready, setSetting],
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx)
    throw new Error("useSiteSettings phải dùng trong <SiteSettingsProvider>");
  return ctx;
}
