import Link from "next/link";
import { Container } from "./Container";
import {
  ArrowRightIcon,
  CheckIcon,
  InstallmentIcon,
  PhoneIcon,
  ShieldIcon,
} from "./icons";
import { SITE } from "@/lib/site";

// Khối kêu gọi THU CŨ ĐỔI MỚI ở trang chủ — kéo khách sang trang định giá.
// Nội dung bám đúng chính sách thật ở /thu-cu-doi-moi (trợ giá tốt, định
// giá minh bạch, thu mọi hãng) — KHÔNG bịa số liệu.

const PERKS = [
  {
    Icon: InstallmentIcon,
    title: "Trợ giá tốt",
    desc: "Bù thêm chút là lên đời máy mới",
  },
  {
    Icon: ShieldIcon,
    title: "Định giá minh bạch",
    desc: "Kiểm tra rõ ràng, đúng tình trạng",
  },
  {
    Icon: CheckIcon,
    title: "Thu mọi hãng máy",
    desc: "Dell, HP, Lenovo, Asus, MacBook…",
  },
];

export function TradeInCTA() {
  return (
    <section className="py-6 max-[900px]:py-4">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-d to-green-dd px-8 py-9 text-white shadow-product max-[640px]:px-5 max-[640px]:py-7">
          {/* Đốm sáng trang trí (không chặn tương tác) */}
          <span className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-[#16A34A]/25 blur-3xl" />

          <div className="relative flex items-center gap-10 max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-7">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wide ring-1 ring-white/25">
                Thu cũ đổi mới
              </span>
              <h2 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight max-[640px]:text-[21px]">
                Lên đời laptop — trợ giá tốt
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/85 max-[640px]:text-[13.5px]">
                Mang máy cũ tới, định giá minh bạch tại chỗ và trừ thẳng vào giá
                máy mới. Máy cũ của bạn đáng giá hơn bạn nghĩ.
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {PERKS.map(({ Icon, title, desc }) => (
                  <li key={title} className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="leading-tight">
                      <b className="block text-[13.5px] font-bold">{title}</b>
                      <span className="block text-[11.5px] text-white/70">
                        {desc}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex shrink-0 flex-col gap-3 max-[860px]:w-full max-[860px]:flex-row max-[860px]:flex-wrap">
              <Link
                href="/thu-cu-doi-moi"
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[14.5px] font-extrabold text-green-d shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Định giá máy cũ ngay
                <ArrowRightIcon className="h-[18px] w-[18px] transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${SITE.hotlineTel}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-[14px] font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20"
              >
                <PhoneIcon className="h-[17px] w-[17px]" />
                Gọi {SITE.hotline}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
