import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import {
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Hệ thống cửa hàng",
  description:
    "Hệ thống cửa hàng Laptop Chính Nguyễn tại Đà Nẵng. Địa chỉ, giờ mở cửa, dịch vụ và hotline hỗ trợ.",
};

const STORES = [
  {
    name: "Chính Nguyễn - Hải Châu",
    address: "123 Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng",
    phone: "1900 6789",
    hours: "8:00 - 21:00 (T2 - CN)",
  },
  {
    name: "Chính Nguyễn - Thanh Khê",
    address: "456 Điện Biên Phủ, Q. Thanh Khê, Đà Nẵng",
    phone: "1900 6789",
    hours: "8:00 - 21:00 (T2 - CN)",
  },
  {
    name: "Chính Nguyễn - Ngũ Hành Sơn",
    address: "789 Ngũ Hành Sơn, Q. Ngũ Hành Sơn, Đà Nẵng",
    phone: "1900 6789",
    hours: "8:00 - 21:00 (T2 - CN)",
  },
];

const SERVICES = [
  "Tư vấn chọn máy theo nhu cầu và ngân sách, tận tình 1-1.",
  "Trải nghiệm sản phẩm trực tiếp trước khi mua.",
  "Trung tâm bảo hành, sửa chữa và vệ sinh máy tại chỗ.",
  "Hỗ trợ trả góp 0%, duyệt hồ sơ nhanh trong 15 phút.",
  "Cài đặt phần mềm, chuyển dữ liệu và hướng dẫn sử dụng miễn phí.",
  "Thu cũ đổi mới, trợ giá hấp dẫn.",
];

export default function StoresPage() {
  return (
    <StaticPage
      title="Hệ thống cửa hàng"
      lead="Ghé thăm các cửa hàng Laptop Chính Nguyễn tại Đà Nẵng để được tư vấn và trải nghiệm sản phẩm trực tiếp."
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Hệ thống cửa hàng" },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Giới thiệu hệ thống */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-3 text-[18px] font-bold text-ink">
            Về hệ thống của chúng tôi
          </h2>
          <div className="flex flex-col gap-3 text-[14.5px] leading-relaxed text-ink-2">
            <p>
              Laptop Chính Nguyễn hiện có mặt tại nhiều quận trung tâm của thành
              phố Đà Nẵng, giúp khách hàng dễ dàng ghé thăm, trải nghiệm sản phẩm
              và nhận hỗ trợ nhanh chóng. Mỗi cửa hàng đều được đầu tư không gian
              hiện đại, sản phẩm trưng bày đa dạng và đội ngũ nhân viên chuyên
              nghiệp.
            </p>
            <p>
              Chúng tôi luôn cố gắng mang đến trải nghiệm mua sắm thoải mái, nơi
              bạn có thể tự do trải nghiệm máy, đặt câu hỏi và nhận được tư vấn
              trung thực nhất trước khi quyết định.
            </p>
          </div>
        </section>

        {/* Dịch vụ tại cửa hàng */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Dịch vụ tại cửa hàng
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-2"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Danh sách cửa hàng */}
        <section>
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Địa chỉ các cửa hàng
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {STORES.map((store) => (
              <div
                key={store.name}
                className="overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-green-tint to-green-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green text-white shadow-md">
                    <MapPinIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[15.5px] font-bold text-ink">
                    {store.name}
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2.5 text-[13.5px] text-ink-2">
                    <li className="flex items-start gap-2.5">
                      <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                      {store.address}
                    </li>
                    <li className="flex items-center gap-2.5">
                      <PhoneIcon className="h-4 w-4 shrink-0 text-green" />
                      Hotline: <b className="text-ink">{store.phone}</b>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <ClockIcon className="h-4 w-4 shrink-0 text-green" />
                      {store.hours}
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-line bg-green-tint p-6 text-center text-[14px] text-ink-2">
          Muốn biết cửa hàng gần bạn nhất? Gọi{" "}
          <b className="text-green-d">1900 6789</b> để được hướng dẫn đường đi
          chi tiết.
        </div>
      </div>
    </StaticPage>
  );
}
