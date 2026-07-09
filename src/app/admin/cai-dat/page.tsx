"use client";

import { useSiteSettings, type SiteSettings } from "@/components/SiteSettingsContext";

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        on ? "bg-green" : "bg-line"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

const OPTIONS: {
  key: keyof SiteSettings;
  title: string;
  desc: string;
}[] = [
  {
    key: "flashSaleEnabled",
    title: "Khối Flash Sale",
    desc: "Bật/tắt hiển thị khối Flash Sale trên trang chủ.",
  },
];

export default function AdminSettingsPage() {
  const { settings, setSetting } = useSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Cài đặt hiển thị</h1>

      <section className="divide-y divide-line rounded-2xl border border-line bg-white">
        {OPTIONS.map((opt) => (
          <div
            key={opt.key}
            className="flex items-center justify-between gap-4 p-5"
          >
            <div>
              <b className="text-[14.5px] text-ink">{opt.title}</b>
              <p className="mt-0.5 text-[13px] text-muted">{opt.desc}</p>
            </div>
            <Toggle
              on={settings[opt.key]}
              onChange={(v) => setSetting(opt.key, v)}
            />
          </div>
        ))}
      </section>

      <p className="rounded-xl bg-green-tint px-4 py-3 text-[12.5px] text-green-d">
        Lưu ý: cài đặt hiện lưu trên trình duyệt (demo). Khi kết nối database, cài
        đặt sẽ áp dụng cho toàn bộ khách truy cập.
      </p>
    </div>
  );
}
