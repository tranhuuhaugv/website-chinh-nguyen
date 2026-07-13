import Link from "next/link";
import { Container } from "./Container";
import { CategoryIcon } from "./icons";
import type { CategoryIconName } from "@/lib/types";

// Thanh danh mục ngang (icon + tên) đặt trên banner chính. Server Component.
const ITEMS: { label: string; href: string; icon: CategoryIconName }[] = [
  { label: "Laptop mới", href: "/danh-muc/laptop-moi", icon: "new" },
  { label: "Laptop cũ", href: "/danh-muc/laptop-cu", icon: "used" },
  { label: "Dell", href: "/danh-muc/dell", icon: "dell" },
  { label: "HP", href: "/danh-muc/hp", icon: "hp" },
  { label: "Lenovo", href: "/danh-muc/lenovo", icon: "lenovo" },
  { label: "Asus", href: "/danh-muc/asus", icon: "asus" },
  { label: "Acer", href: "/danh-muc/acer", icon: "acer" },
  { label: "MSI", href: "/danh-muc/msi", icon: "msi" },
  { label: "MacBook", href: "/danh-muc/macbook", icon: "macbook" },
  { label: "Gaming", href: "/danh-muc/laptop-gaming", icon: "gaming" },
  { label: "Máy trạm - Đồ họa", href: "/danh-muc/laptop-do-hoa", icon: "graphic" },
  { label: "Văn phòng", href: "/danh-muc/laptop-van-phong", icon: "office" },
  { label: "PC đồng bộ", href: "/danh-muc/pc", icon: "pc" },
  { label: "Màn hình", href: "/danh-muc/man-hinh", icon: "monitor" },
  { label: "Phụ kiện", href: "/danh-muc/phu-kien", icon: "accessory" },
  { label: "Thu cũ đổi mới", href: "/thu-cu-doi-moi", icon: "used" },
];

export function CategoryNav() {
  return (
    <div className="pt-4">
      <Container>
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 shadow-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13.5px] font-medium text-ink-2 transition hover:bg-green-tint hover:text-green-d"
            >
              <CategoryIcon
                name={item.icon}
                className="h-[18px] w-[18px] text-green transition group-hover:scale-110"
              />
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
