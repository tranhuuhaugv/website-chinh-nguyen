import Link from "next/link";
import { Container } from "./Container";
import { CategoryIcon } from "./icons";
import type { CategoryIconName } from "@/lib/types";

// Thanh danh mục ngang (icon + tên) đặt trên banner chính. Server Component.
const ITEMS: { label: string; href: string; icon: CategoryIconName }[] = [
  { label: "Laptop cũ", href: "/laptop-cu", icon: "used" },
  { label: "Dell", href: "/dell", icon: "dell" },
  { label: "HP", href: "/hp", icon: "hp" },
  { label: "Lenovo", href: "/lenovo", icon: "lenovo" },
  { label: "Asus", href: "/asus", icon: "asus" },
  { label: "Acer", href: "/acer", icon: "acer" },
  { label: "MSI", href: "/msi", icon: "msi" },
  { label: "MacBook", href: "/macbook", icon: "macbook" },
  { label: "Gaming", href: "/laptop-gaming", icon: "gaming" },
  { label: "Máy trạm - Đồ họa", href: "/laptop-do-hoa", icon: "graphic" },
  { label: "Văn phòng", href: "/laptop-van-phong", icon: "office" },
  { label: "PC đồng bộ", href: "/pc", icon: "pc" },
  { label: "Màn hình", href: "/man-hinh", icon: "monitor" },
  { label: "Phụ kiện", href: "/phu-kien", icon: "accessory" },
  { label: "Thu cũ đổi mới", href: "/thu-cu-doi-moi", icon: "used" },
];

export function CategoryNav() {
  return (
    <div className="pt-4">
      <Container>
        {/* Thanh cuộn ngang: mờ dần 2 mép để báo "còn mục, cuộn được" (không cắt cụt xấu) */}
        <div className="relative">
          <div className="flex gap-0.5 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 pr-8 shadow-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-[13.5px] font-medium text-ink-2 transition hover:bg-green-tint hover:text-green-d"
              >
                <CategoryIcon
                  name={item.icon}
                  className="h-[18px] w-[18px] shrink-0 text-green transition group-hover:scale-110"
                />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-2xl bg-gradient-to-l from-white to-transparent" />
        </div>
      </Container>
    </div>
  );
}
