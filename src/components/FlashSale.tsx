import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Container } from "./Container";
import { CountdownTimer } from "./CountdownTimer";
import { FlashSlider } from "./FlashSlider";
import { ProductImage } from "./ProductImage";
import {
  BoltIcon,
  CpuIcon,
  GpuIcon,
  MonitorIcon,
  RamIcon,
  StorageIcon,
} from "./icons";
import { formatPrice, shortCpu, shortSize } from "@/lib/format";

// Khối "Flash Sale" kiểu FPT Shop: đầu khối nền xanh (đồng bộ banner) + tiêu đề
// lớn + đồng hồ; bên dưới là khung trắng chứa thẻ máy (ảnh + thông số bên phải,
// "Còn X/Y suất", ô giá đỏ kèm tag % vàng).

// Số suất còn / tổng (minh hoạ — dữ liệu thật cần cột kho riêng).
const STOCK = [
  { remaining: 13, total: 20 },
  { remaining: 18, total: 20 },
  { remaining: 10, total: 10 },
  { remaining: 8, total: 10 },
  { remaining: 3, total: 3 },
  { remaining: 3, total: 3 },
];

function FlashCard({
  product,
  stock,
}: {
  product: Product;
  stock: { remaining: number; total: number };
}) {
  const cover = product.images?.[0];
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const specs = [
    { Icon: CpuIcon, value: shortCpu(product.cpu) },
    { Icon: RamIcon, value: product.ram && `RAM ${shortSize(product.ram)}` },
    { Icon: StorageIcon, value: product.storage && `SSD ${shortSize(product.storage)}` },
    { Icon: GpuIcon, value: product.gpu },
    { Icon: MonitorIcon, value: product.screen },
  ]
    .filter((s): s is { Icon: typeof CpuIcon; value: string } =>
      Boolean(s.value && s.value.trim()),
    )
    .slice(0, 3);

  return (
    <Link
      href={`/${product.slug}`}
      className="group flex w-[232px] shrink-0 flex-col border-r border-line px-3 py-2 last:border-r-0 max-[460px]:w-[180px] max-[460px]:px-2"
    >
      {/* Ảnh bên trái + thông số dọc bên phải */}
      <div className="flex gap-2">
        <div className="relative aspect-square w-[62%] shrink-0">
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              sizes="150px"
              className="object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <ProductImage accent={product.accent} uid={product.slug} />
          )}
        </div>
        <ul className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          {specs.map(({ Icon, value }, i) => (
            <li key={i} className="flex flex-col items-center gap-0.5 text-center">
              <Icon className="h-4 w-4 text-muted" />
              <span className="line-clamp-2 text-[10.5px] leading-tight text-ink-2">
                {value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Còn X/Y suất */}
      <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-[#FFE7A3] to-white py-0.5 pl-1 pr-3 text-[11.5px] font-bold text-ink">
        <BoltIcon className="h-3.5 w-3.5 text-[#F59E0B]" />
        Còn {stock.remaining}/{stock.total} suất
      </span>

      {/* Ô giá đỏ + tag % vàng */}
      <div className="mt-1.5 flex overflow-hidden rounded-lg">
        <div className="min-w-0 flex-1 bg-gradient-to-r from-[#D7261E] to-[#EF3B2D] px-2.5 py-1.5 text-white">
          <p className="text-[17px] font-extrabold leading-tight max-[460px]:text-[15px]">
            {formatPrice(product.price)}
          </p>
          {product.oldPrice ? (
            <s className="text-[11.5px] text-white/75">
              {formatPrice(product.oldPrice)}
            </s>
          ) : (
            <span className="text-[11.5px]">&nbsp;</span>
          )}
        </div>
        {discount > 0 && (
          <div className="flex items-center bg-gradient-to-r from-[#FFE259] to-[#FFC53D] px-2.5 text-[15px] font-extrabold text-[#D7261E] max-[460px]:px-1.5 max-[460px]:text-[13px]">
            -{discount}%
          </div>
        )}
      </div>

      <p className="mt-2 line-clamp-2 min-h-[36px] text-[13px] font-medium leading-snug text-ink group-hover:text-[#0B3BB8]">
        {product.name}
      </p>
    </Link>
  );
}

/** "YYYY-MM-DDTHH:mm" -> { gio: "HH:mm", ngay: "dd/MM" }. */
function tachGioNgay(s: string): { gio: string; ngay: string } {
  const [d, t = ""] = s.split("T");
  const [, mo = "", day = ""] = d.split("-");
  return { gio: t.slice(0, 5), ngay: `${day}/${mo}` };
}

/** Nhãn khung giờ Flash Sale theo lịch admin đặt (đồng bộ với đồng hồ). */
function khungGioLabel(start?: string, end?: string): string {
  if (start && end) {
    const a = tachGioNgay(start);
    const b = tachGioNgay(end);
    return a.ngay === b.ngay
      ? `${a.gio} – ${b.gio} · ${a.ngay}`
      : `${a.gio} ${a.ngay} – ${b.gio} ${b.ngay}`;
  }
  if (end) {
    const b = tachGioNgay(end);
    return `Đến ${b.gio} · ${b.ngay}`;
  }
  if (start) {
    const a = tachGioNgay(start);
    return `Từ ${a.gio} · ${a.ngay}`;
  }
  return "Trong hôm nay";
}

export function FlashSale({
  flashProducts,
  startsAt,
  endsAt,
}: {
  flashProducts: Product[];
  /** Giờ bắt đầu Flash Sale (giờ VN "YYYY-MM-DDTHH:mm"). Trống -> không giới hạn. */
  startsAt?: string;
  /** Giờ kết thúc Flash Sale (giờ VN "YYYY-MM-DDTHH:mm"). Trống -> hết ngày. */
  endsAt?: string;
}) {
  return (
    <section className="py-[18px]">
      <Container>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#071D6B] via-[#0B3BB8] to-[#1677F0] shadow-[0_10px_28px_rgba(7,29,107,0.25)]">
          {/* Đầu khối: tiêu đề lớn + nhãn "Deal sốc" + đồng hồ */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pb-4 pt-4 max-[640px]:px-3">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                <BoltIcon className="sale-bolt h-8 w-8 -rotate-6 text-[#FFCF33] max-[640px]:h-6 max-[640px]:w-6" />
                <h2 className="sale-shimmer inline-block py-0.5 pr-2 text-[34px] font-black italic leading-[1.2] tracking-tight drop-shadow-[0_2px_0_rgba(3,15,70,0.6)] max-[640px]:text-[24px]">
                  FLASH SALE
                </h2>
              </div>
              <span className="-mt-0.5 ml-8 rounded-full bg-white px-3 py-0.5 text-[12.5px] font-extrabold text-[#0B3BB8] shadow-md max-[640px]:ml-6 max-[640px]:text-[11px]">
                Deal sốc mỗi ngày · {khungGioLabel(startsAt, endsAt)}
              </span>
            </div>
            <CountdownTimer endsAt={endsAt} />
          </div>

          {/* Khung trắng chứa thẻ máy */}
          <div className="mx-3 mb-3 rounded-xl bg-white p-2 max-[640px]:mx-2 max-[640px]:mb-2">
            <FlashSlider>
              {flashProducts.map((product, i) => (
                <FlashCard
                  key={product.id}
                  product={product}
                  stock={STOCK[i % STOCK.length]}
                />
              ))}
            </FlashSlider>
          </div>
        </div>
      </Container>
    </section>
  );
}
