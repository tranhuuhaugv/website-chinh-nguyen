"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon, GridIcon, HomeIcon, UserIcon } from "./icons";
import { useCart } from "./cart/CartContext";

// Thanh điều hướng dưới đáy — CHỈ mobile/tablet. Ẩn ở trang chi tiết sản phẩm
// (nơi thanh "Mua ngay" dính đáy thế chỗ).

const ITEMS = [
  { href: "/", label: "Trang chủ", Icon: HomeIcon, exact: true },
  { href: "/san-pham", label: "Danh mục", Icon: GridIcon },
  { href: "/gio-hang", label: "Giỏ hàng", Icon: CartIcon, cart: true },
  { href: "/tai-khoan", label: "Tài khoản", Icon: UserIcon },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, ready } = useCart();

  // Ẩn ở trang chi tiết sản phẩm (/san-pham/<slug>) và khu admin.
  if (/^\/san-pham\/[^/]+/.test(pathname) || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch">
        {ITEMS.map(({ href, label, Icon, cart, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
                active ? "text-green-d" : "text-ink-2"
              }`}
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" />
                {cart && ready && totalItems > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-sale px-1 text-[9px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
