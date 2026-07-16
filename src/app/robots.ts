import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

// Cho index trang sản phẩm/danh mục/blog; chặn giỏ hàng, thanh toán, tài khoản, admin.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/gio-hang",
        "/thanh-toan",
        "/tai-khoan",
        "/dang-nhap",
        "/dang-ky",
        "/quen-mat-khau",
        // Link đặt lại có token ngay trên URL -> tuyệt đối không cho bò vào.
        "/dat-lai-mat-khau",
        "/admin",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
