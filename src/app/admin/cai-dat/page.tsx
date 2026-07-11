import { SettingToggle } from "@/components/admin/SettingToggle";
import { getSetting } from "@/lib/data";

export const metadata = { title: "Cài đặt" };
export const dynamic = "force-dynamic";

const OPTIONS: { key: string; title: string; desc: string }[] = [
  {
    key: "flashSaleEnabled",
    title: "Khối Flash Sale",
    desc: "Bật/tắt hiển thị khối Flash Sale trên trang chủ.",
  },
];

export default async function AdminSettingsPage() {
  const values = await Promise.all(OPTIONS.map((o) => getSetting(o.key)));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Cài đặt hiển thị</h1>

      <section className="divide-y divide-line rounded-2xl border border-line bg-white">
        {OPTIONS.map((opt, i) => (
          <div
            key={opt.key}
            className="flex items-center justify-between gap-4 p-5"
          >
            <div>
              <b className="text-[14.5px] text-ink">{opt.title}</b>
              <p className="mt-0.5 text-[13px] text-muted">{opt.desc}</p>
            </div>
            <SettingToggle settingKey={opt.key} initial={values[i] === "true"} />
          </div>
        ))}
      </section>

      <p className="rounded-xl bg-green-tint px-4 py-3 text-[12.5px] text-green-d">
        Cài đặt được lưu vào database và áp dụng cho toàn bộ khách truy cập ngay.
      </p>
    </div>
  );
}
