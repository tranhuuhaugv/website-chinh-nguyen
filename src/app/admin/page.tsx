import type { ComponentType, SVGProps } from "react";
import { TrafficChart } from "@/components/admin/TrafficChart";
import { MonthPicker } from "@/components/admin/MonthPicker";
import {
  BoxIcon,
  CartIcon,
  FileTextIcon,
  StarIcon,
  TrendUpIcon,
  UsersIcon,
} from "@/components/icons";
import {
  getDailyViews,
  getDashboardCounts,
  getTrafficStats,
} from "@/lib/data";

export const metadata = { title: "Tổng quan" };
export const dynamic = "force-dynamic";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

function StatCard({
  label,
  value,
  icon: Icon,
  grad,
}: {
  label: string;
  value: number;
  icon: Icon;
  grad: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${grad} p-5 text-white shadow-[0_8px_20px_rgba(16,24,20,0.12)]`}
    >
      <p className="text-[13px] font-medium text-white/90">{label}</p>
      <p className="mt-2 text-[26px] font-extrabold leading-none max-[520px]:text-[22px]">
        {value.toLocaleString("vi-VN")}
      </p>
      <Icon className="absolute bottom-3.5 right-3.5 h-9 w-9 text-white/35" />
    </div>
  );
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

  const [counts, traffic, daily] = await Promise.all([
    getDashboardCounts(),
    getTrafficStats(),
    getDailyViews(ym),
  ]);
  const monthTotal = daily.reduce((a, b) => a + b, 0);

  const row1 = [
    { label: "Tổng đơn hàng", value: counts.orders, icon: CartIcon, grad: "from-[#a855f7] to-[#ec4899]" },
    { label: "Tổng sản phẩm", value: counts.products, icon: BoxIcon, grad: "from-[#f97316] to-[#ef4444]" },
    { label: "Tổng bài đánh giá", value: counts.reviews, icon: StarIcon, grad: "from-[#ec4899] to-[#f472b6]" },
    { label: "Tổng bài viết", value: counts.posts, icon: FileTextIcon, grad: "from-[#a78bfa] to-[#8b5cf6]" },
    { label: "Số lượng user", value: counts.users, icon: UsersIcon, grad: "from-[#f59e0b] to-[#fbbf24]" },
  ];
  const row2 = [
    { label: "Đang truy cập", value: traffic.online, icon: TrendUpIcon, grad: "from-[#3b82f6] to-[#60a5fa]" },
    { label: "Truy cập trong ngày", value: traffic.today, icon: TrendUpIcon, grad: "from-[#6366f1] to-[#818cf8]" },
    { label: "Truy cập trong tháng", value: traffic.month, icon: TrendUpIcon, grad: "from-[#22c55e] to-[#4ade80]" },
    { label: "Truy cập trong năm", value: traffic.year, icon: TrendUpIcon, grad: "from-[#6366f1] to-[#a855f7]" },
    { label: "Tổng lượt truy cập", value: traffic.total, icon: TrendUpIcon, grad: "from-[#06b6d4] to-[#22d3ee]" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-[20px] font-bold text-ink">Tổng quan</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {row1.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {row2.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <TrafficChart
        values={daily}
        labels={daily.map((_, i) => String(i + 1))}
        title="Thống kê truy cập theo ngày"
        subtitle={`Tháng ${mm}/${yy}: ${monthTotal.toLocaleString("vi-VN")} lượt`}
        control={<MonthPicker value={ym} />}
      />
    </div>
  );
}
