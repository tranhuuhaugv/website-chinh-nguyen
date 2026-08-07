import Link from "next/link";
import { ChevronDownIcon, GridIcon } from "./icons";
import { getNavCategories } from "@/lib/data";

// Mega-menu "Danh mục" ở header (chỉ desktop, mở khi rê chuột — CSS thuần).
// Nội dung LẤY ĐỘNG từ danh mục thật trong admin -> link luôn khớp slug (hết
// 404), thêm danh mục mới là tự hiện. Mobile dùng thanh điều hướng đáy.

function Col({
  title,
  items,
}: {
  title: string;
  items: { slug: string; name: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-muted">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((it) => (
          <li key={it.slug}>
            <Link
              href={`/${it.slug}`}
              className="block rounded-lg px-2 py-1.5 text-[13.5px] text-ink-2 transition hover:bg-green-tint hover:text-green-d"
            >
              {it.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function MegaMenu() {
  const { brands, needs, others } = await getNavCategories();

  return (
    <div className="group relative hidden shrink-0 lg:block">
      <button
        type="button"
        className="flex h-10 items-center gap-1.5 rounded-lg bg-green-soft px-3.5 text-[13.5px] font-semibold text-green-d transition group-hover:bg-green group-hover:text-white"
      >
        <GridIcon className="h-[18px] w-[18px]" />
        Danh mục
        <ChevronDownIcon className="h-4 w-4 transition group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-[520px] translate-y-1 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="grid grid-cols-3 gap-5 rounded-2xl border border-line bg-white p-5 shadow-pop">
          <Col title="Thương hiệu" items={brands} />
          <Col title="Nhu cầu" items={needs} />
          <Col title="Loại máy & khác" items={others} />
        </div>
      </div>
    </div>
  );
}
