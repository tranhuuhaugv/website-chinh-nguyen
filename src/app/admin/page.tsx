import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { TrafficChart } from "@/components/admin/TrafficChart";
import { MonthPicker } from "@/components/admin/MonthPicker";
import {
  BoxIcon,
  CartIcon,
  FileTextIcon,
  LayoutIcon,
  PlusIcon,
  StarIcon,
  TrendUpIcon,
  UsersIcon,
} from "@/components/icons";
import {
  getDailyViews,
  getDashboardCounts,
  getDashboardOrders,
  getTrafficStats,
} from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Tổng quan" };
export const dynamic = "force-dynamic";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// Thẻ số liệu: nền trắng sạch, icon trong ô màu dịu — dễ đọc, không rối mắt.
function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: Icon;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-card">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-medium text-muted">{label}</p>
        <p className="mt-0.5 text-[22px] font-extrabold leading-none text-ink">
          {value.toLocaleString("vi-VN")}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-muted">
      {children}
    </h2>
  );
}

const QUICK = [
  { href: "/admin/san-pham/them", label: "Thêm sản phẩm", icon: BoxIcon },
  { href: "/admin/blog/them", label: "Viết bài blog", icon: FileTextIcon },
  { href: "/admin/trang-tinh/them", label: "Thêm trang", icon: LayoutIcon },
  { href: "/admin/don-hang", label: "Xem đơn hàng", icon: CartIcon },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "Mới", cls: "bg-[#FFF1D9] text-[#B45309]" },
  processing: { label: "Đang xử lý", cls: "bg-[#E4F0FB] text-[#1D6FE0]" },
  done: { label: "Hoàn tất", cls: "bg-green-soft text-green-d" },
  canceled: { label: "Đã huỷ", cls: "bg-[#F1F3F1] text-muted" },
};

/** "12 phút trước", "3 giờ trước", "2 ngày trước". */
function timeAgo(d: Date): string {
  const m = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
  if (m < 1) return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  if (m < 1440) return `${Math.floor(m / 60)} giờ trước`;
  return `${Math.floor(m / 1440)} ngày trước`;
}

function greeting(): string {
  const h = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date()),
  );
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { thang?: string };
}) {
  const curYm = new Date(Date.now() + 7 * 3600 * 1000)
    .toISOString()
    .slice(0, 7);
  const ym = /^\d{4}-\d{2}$/.test(searchParams.thang ?? "")
    ? searchParams.thang!
    : curYm;
  const [yy, mm] = ym.split("-");

  const [counts, traffic, daily, orders] = await Promise.all([
    getDashboardCounts(),
    getTrafficStats(),
    getDailyViews(ym),
    getDashboardOrders(5),
  ]);
  const monthTotal = daily.reduce((a, b) => a + b, 0);

  const business = [
    { label: "Tổng đơn hàng", value: counts.orders, icon: CartIcon, tone: "bg-[#F1E8FB] text-[#7C3AED]" },
    { label: "Tổng sản phẩm", value: counts.products, icon: BoxIcon, tone: "bg-green-tint text-green-d" },
    { label: "Người dùng", value: counts.users, icon: UsersIcon, tone: "bg-[#E4F0FB] text-[#1D6FE0]" },
    { label: "Bài đánh giá", value: counts.reviews, icon: StarIcon, tone: "bg-[#FFF1D9] text-[#C2570C]" },
    { label: "Bài viết", value: counts.posts, icon: FileTextIcon, tone: "bg-[#FDE8EF] text-[#DB2777]" },
  ];
  const visits = [
    { label: "Đang truy cập", value: traffic.online, icon: TrendUpIcon, tone: "bg-[#E3F5EA] text-green" },
    { label: "Hôm nay", value: traffic.today, icon: TrendUpIcon, tone: "bg-green-tint text-green-d" },
    { label: "Tháng này", value: traffic.month, icon: TrendUpIcon, tone: "bg-green-tint text-green-d" },
    { label: "Năm nay", value: traffic.year, icon: TrendUpIcon, tone: "bg-green-tint text-green-d" },
    { label: "Tổng cộng", value: traffic.total, icon: TrendUpIcon, tone: "bg-green-tint text-green-d" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Lời chào + lối tắt việc hay làm */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-dd via-green-d to-green p-6 text-white shadow-[0_12px_30px_rgba(11,94,44,0.25)] max-[520px]:p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <p className="text-[13px] font-medium text-white/80">{greeting()} 👋</p>
        <h1 className="mt-1 text-[24px] font-extrabold leading-tight max-[520px]:text-[20px]">
          {orders.pending > 0
            ? `Có ${orders.pending} đơn đang chờ bạn xử lý`
            : "Hôm nay mọi thứ đều ổn — bắt tay vào việc thôi"}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {QUICK.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-[13.5px] font-semibold text-white ring-1 ring-white/25 transition hover:bg-white hover:text-green-d"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Kinh doanh</SectionTitle>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {business.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="min-w-0">
          <SectionTitle>Lượt truy cập</SectionTitle>
          <div className="mb-3.5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-5">
            {visits.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-line bg-white p-3.5 shadow-card"
              >
                <p className="truncate text-[12px] font-medium text-muted">
                  {c.label}
                </p>
                <p className="mt-1 text-[20px] font-extrabold leading-none text-ink">
                  {c.value.toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
          <TrafficChart
            values={daily}
            labels={daily.map((_, i) => String(i + 1))}
            title="Thống kê truy cập theo ngày"
            subtitle={`Tháng ${mm}/${yy}: ${monthTotal.toLocaleString("vi-VN")} lượt`}
            control={<MonthPicker value={ym} />}
          />
        </section>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted">
              Đơn hàng gần đây
            </h2>
            <Link
              href="/admin/don-hang"
              className="text-[12.5px] font-semibold text-green-d hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            {orders.recent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-tint text-green">
                  <PlusIcon className="h-5 w-5" />
                </span>
                <p className="text-[14px] font-semibold text-ink">
                  Chưa có đơn hàng nào
                </p>
                <p className="text-[12.5px] text-muted">
                  Đơn mới sẽ hiện ở đây ngay khi khách đặt.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {orders.recent.map((o) => {
                  const st = STATUS[o.status] ?? STATUS.new;
                  return (
                    <li key={o.id}>
                      <Link
                        href="/admin/don-hang"
                        className="flex items-center gap-3 px-4 py-3 transition hover:bg-bg/60"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-tint text-[13px] font-bold text-green-d">
                          {o.name.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-semibold text-ink">
                            {o.name}
                          </p>
                          <p className="truncate text-[12px] text-muted">
                            {o.type === "tradein"
                              ? `Thu cũ${o.model ? ` · ${o.model}` : ""}`
                              : o.total
                                ? formatPrice(o.total)
                                : "Đơn mua"}{" "}
                            · {timeAgo(o.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${st.cls}`}
                        >
                          {st.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
