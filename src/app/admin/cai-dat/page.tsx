import { SettingToggle } from "@/components/admin/SettingToggle";
import { SettingInput } from "@/components/admin/SettingInput";
import { FlashSaleSchedule } from "@/components/admin/FlashSaleSchedule";
import { NeedsManager } from "@/components/admin/NeedsManager";
import { VouchersManager } from "@/components/admin/VouchersManager";
import { getNeeds, getSetting, getVouchers } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata = { title: "Cài đặt" };
export const dynamic = "force-dynamic";

const OPTIONS: { key: string; title: string; desc: string }[] = [
  {
    key: "comingSoon",
    title: 'Website đang hoàn thiện ("Coming soon")',
    desc: 'Bật để trang chủ hiện trang "Website đang hoàn thiện" thay cho nội dung. Nhớ TẮT khi đưa vào vận hành lại.',
  },
  {
    key: "flashSaleEnabled",
    title: "Khối Flash Sale",
    desc: "Bật/tắt hiển thị khối Flash Sale trên trang chủ.",
  },
  {
    key: "vouchersEnabled",
    title: "Khối mã giảm giá",
    desc: "Bật/tắt dải voucher 100K - 200K - 500K trên trang chủ (khách sao chép mã, nhập ở giỏ hàng).",
  },
  {
    key: "bctEnabled",
    title: "Badge Bộ Công Thương (footer)",
    desc: "Bật khi đã được duyệt + đã dán link online.gov.vn ở ô bên dưới.",
  },
  {
    key: "dmcaEnabled",
    title: "Badge DMCA Protected (footer)",
    desc: "Bật khi đã có link bảo hộ DMCA ở ô bên dưới.",
  },
];

// Link cho 2 badge chứng nhận ở footer (BCT online.gov.vn / DMCA).
const CERTS: { key: string; title: string; desc: string; placeholder: string }[] =
  [
    {
      key: "bctUrl",
      title: "Link Bộ Công Thương",
      desc: "Dán link trang xác nhận của web bạn trên online.gov.vn (lấy khi được duyệt).",
      placeholder: "https://online.gov.vn/...",
    },
    {
      key: "dmcaUrl",
      title: "Link DMCA",
      desc: "Dán link trang bảo hộ DMCA (VD https://www.dmca.com/Protection/Status.aspx?ID=...).",
      placeholder: "https://www.dmca.com/...",
    },
  ];

// 3 nút liên hệ nổi (góc phải dưới): gọi điện / Messenger / Zalo.
const CONTACTS: {
  key: string;
  title: string;
  desc: string;
  placeholder: string;
}[] = [
  {
    key: "floatPhone",
    title: "Nút gọi điện",
    desc: "Số điện thoại nút gọi (chỉ nhập số, VD 0936122144).",
    placeholder: SITE.hotlineTel,
  },
  {
    key: "floatMessenger",
    title: "Nút Messenger",
    desc: "Link Messenger đầy đủ (VD https://m.me/tenpage).",
    placeholder: SITE.messenger,
  },
  {
    key: "floatZalo",
    title: "Nút Zalo",
    desc: "Link Zalo đầy đủ (VD https://zalo.me/0936122144).",
    placeholder: `https://zalo.me/${SITE.hotlineTel}`,
  },
];

export default async function AdminSettingsPage() {
  const [
    toggleValues,
    contactValues,
    certValues,
    needs,
    vouchers,
    flashStart,
    flashEnd,
  ] = await Promise.all([
      Promise.all(OPTIONS.map((o) => getSetting(o.key))),
      Promise.all(CONTACTS.map((c) => getSetting(c.key))),
      Promise.all(CERTS.map((c) => getSetting(c.key))),
      getNeeds(),
      getVouchers(),
      getSetting("flashSaleStart"),
      getSetting("flashSaleEnd"),
    ]);

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
            <SettingToggle settingKey={opt.key} initial={toggleValues[i] === "true"} />
          </div>
        ))}
      </section>

      {/* Lịch Flash Sale: đặt ngày + giờ bắt đầu/kết thúc cho chương trình */}
      <div>
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Lịch Flash Sale (ngày &amp; giờ)
        </h2>
        <p className="mb-3 text-[13px] text-muted">
          Đặt khung giờ chạy Flash Sale. Khối chỉ hiện trong khoảng này (khi công
          tắc “Khối Flash Sale” đang bật) và đồng hồ đếm ngược tới giờ kết thúc.
        </p>
        <section className="rounded-2xl border border-line bg-white p-5">
          <FlashSaleSchedule start={flashStart ?? ""} end={flashEnd ?? ""} />
        </section>
      </div>

      {/* Nút liên hệ nổi — 3 ô nhập link để đổi nhanh */}
      <div>
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Nút liên hệ nổi (góc phải dưới)
        </h2>
        <p className="mb-3 text-[13px] text-muted">
          Đổi số điện thoại / link cho 3 nút Gọi · Messenger · Zalo. Để trống sẽ
          dùng giá trị mặc định.
        </p>
        <section className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5">
          {CONTACTS.map((c, i) => (
            <div key={c.key}>
              <b className="text-[14px] text-ink">{c.title}</b>
              <p className="mb-2 mt-0.5 text-[12.5px] text-muted">{c.desc}</p>
              <SettingInput
                settingKey={c.key}
                initial={contactValues[i] ?? ""}
                placeholder={c.placeholder}
              />
            </div>
          ))}
        </section>
      </div>

      {/* Link badge chứng nhận (BCT / DMCA) — bật/tắt ở công tắc phía trên */}
      <div>
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Chứng nhận footer (Bộ Công Thương / DMCA)
        </h2>
        <p className="mb-3 text-[13px] text-muted">
          Dán link vào ô dưới, rồi bật công tắc tương ứng ở phần trên để badge
          hiện ở footer. Chưa duyệt thì cứ để tắt.
        </p>
        <section className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5">
          {CERTS.map((c, i) => (
            <div key={c.key}>
              <b className="text-[14px] text-ink">{c.title}</b>
              <p className="mb-2 mt-0.5 text-[12.5px] text-muted">{c.desc}</p>
              <SettingInput
                settingKey={c.key}
                initial={certValues[i] ?? ""}
                placeholder={c.placeholder}
              />
            </div>
          ))}
        </section>
      </div>

      {/* Mã giảm giá — admin tự thêm/sửa; khối trang chủ + giỏ hàng dùng theo */}
      <div>
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Danh sách mã giảm giá
        </h2>
        <p className="mb-3 text-[13px] text-muted">
          Sửa mã / số tiền giảm / đơn tối thiểu / số lượt phát hành. Bật/tắt hiển
          thị khối này ở công tắc “Khối mã giảm giá” phía trên.
        </p>
        <section className="rounded-2xl border border-line bg-white p-5">
          <VouchersManager initial={vouchers} />
        </section>
      </div>

      {/* Nhu cầu sử dụng — admin tự thêm/sửa; form thêm SP + bộ lọc web dùng theo */}
      <div>
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Nhu cầu sử dụng
        </h2>
        <p className="mb-3 text-[13px] text-muted">
          Danh sách nhu cầu để tick khi thêm sản phẩm và làm bộ lọc ngoài web
          (Gaming, Văn phòng…). Đổi tên / thêm / xoá rồi bấm “Lưu danh sách”.
        </p>
        <section className="rounded-2xl border border-line bg-white p-5">
          <NeedsManager initial={needs} />
        </section>
      </div>

      <p className="rounded-xl bg-green-tint px-4 py-3 text-[12.5px] text-green-d">
        Cài đặt được lưu vào database và áp dụng cho toàn bộ khách truy cập ngay.
      </p>
    </div>
  );
}
