import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { Band, SectionIntro } from "@/components/static/Band";
import { SITE } from "@/lib/site";
import { CheckIcon, ClockIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Hệ thống cửa hàng",
  description:
    "Hệ thống cửa hàng Laptop Chính Nguyễn tại Đà Nẵng. Địa chỉ, giờ mở cửa, dịch vụ và hotline hỗ trợ.",
};

const SERVICES = [
  "Tư vấn chọn máy theo nhu cầu và ngân sách, tận tình 1-1.",
  "Trải nghiệm sản phẩm trực tiếp trước khi mua.",
  "Bảo hành, sửa chữa và vệ sinh máy tại chỗ.",
  "Hỗ trợ trả góp 0%, duyệt hồ sơ trong 15 phút.",
  "Cài phần mềm, chuyển dữ liệu, hướng dẫn miễn phí.",
  "Thu cũ đổi mới, trợ giá hấp dẫn.",
];

export default function StoresPage() {
  return (
    <StaticPage
      title="Hệ thống cửa hàng tại Đà Nẵng"
      lead="Ghé thăm Chính Nguyễn để được tư vấn tận tình và trải nghiệm sản phẩm trực tiếp trước khi quyết định."
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Hệ thống cửa hàng" },
      ]}
      hero={
        <div className="rounded-2xl border border-line bg-white p-5 text-center shadow-card">
          <p className="text-[34px] font-extrabold text-green">
            {SITE.stores.length}
          </p>
          <p className="text-[12.5px] text-muted">cơ sở tại Đà Nẵng</p>
        </div>
      }
    >
      {/* Giới thiệu hệ thống */}
      <Band tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionIntro
            eyebrow="Về hệ thống"
            title="Không gian mua sắm hiện đại"
          />
          <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-ink-2">
            <p>
              Chính Nguyễn có mặt tại nhiều quận trung tâm Đà Nẵng, giúp bạn dễ
              dàng ghé thăm, trải nghiệm sản phẩm và nhận hỗ trợ nhanh chóng. Mỗi
              cửa hàng đều được đầu tư không gian hiện đại và đội ngũ chuyên
              nghiệp.
            </p>
            <p>
              Chúng tôi mang đến trải nghiệm mua sắm thoải mái — nơi bạn tự do
              trải nghiệm máy, đặt câu hỏi và nhận tư vấn trung thực nhất trước khi
              quyết định.
            </p>
          </div>
        </div>
      </Band>

      {/* Danh sách cửa hàng */}
      <Band tone="tint">
        <SectionIntro center eyebrow="Địa chỉ" title="Các cửa hàng của chúng tôi" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SITE.stores.map((store) => (
            <div
              key={store.name}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-card"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-green to-green-dd">
                <MapPinIcon className="h-10 w-10 text-white/90" />
              </div>
              <div className="p-6">
                <h3 className="text-[16px] font-bold text-ink">{store.name}</h3>
                <ul className="mt-3 flex flex-col gap-2.5 text-[14px] text-ink-2">
                  <li className="flex items-start gap-2.5">
                    <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                    {store.address}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <PhoneIcon className="h-4 w-4 shrink-0 text-green" />
                    Hotline: <b className="text-ink">{SITE.hotline}</b>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ClockIcon className="h-4 w-4 shrink-0 text-green" />
                    {SITE.hours}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* Dịch vụ tại cửa hàng */}
      <Band tone="white">
        <SectionIntro center eyebrow="Tại cửa hàng" title="Dịch vụ dành cho bạn" />
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-white">
                <CheckIcon className="h-4 w-4" />
              </span>
              <p className="text-[14.5px] leading-relaxed text-ink-2">{s}</p>
            </div>
          ))}
        </div>
      </Band>
    </StaticPage>
  );
}
