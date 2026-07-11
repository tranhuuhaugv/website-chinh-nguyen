import { BannerManager } from "@/components/admin/BannerManager";
import {
  getHeroBanners,
  getSideBanners,
  getSubBanners,
} from "@/lib/data";

export const metadata = { title: "Banner" };
export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  const [hero, side, sub] = await Promise.all([
    getHeroBanners(),
    getSideBanners(),
    getSubBanners(),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Quản lý banner</h1>
      <BannerManager initialHero={hero} initialSide={side} initialSub={sub} />
    </div>
  );
}
