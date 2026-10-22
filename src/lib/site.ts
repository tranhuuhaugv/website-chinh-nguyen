// Thông tin liên hệ / cửa hàng dùng chung toàn site.
/** Danh mục tạm ẩn khỏi mọi chỗ điều hướng (menu, trang chủ, sitemap). */
export const HIDDEN_CATEGORY_SLUGS = new Set(["man-hinh"]);

export const SITE = {
  name: "Laptop Chính Nguyễn",
  hotline: "0926.122.144",
  hotlineTel: "0926122144",
  techPhone: "0934.712.144",
  techTel: "0934712144",
  email: "infor.laptopchinhnguyen@gmail.com",
  hours: "8:00 - 21:00 (T2 - CN)",
  facebook: "https://www.facebook.com/laptopchinhnguyen.danang",
  messenger: "https://m.me/laptopchinhnguyen.danang",
  zalo: "https://zalo.me/978295400221667062",
  stores: [
    {
      name: "Chính Nguyễn - Đỗ Quang",
      address: "175/8 Đỗ Quang - TP. Đà Nẵng",
      city: "Đà Nẵng",
    },
    {
      name: "Chính Nguyễn - Trần Cao Vân",
      address: "605 Trần Cao Vân - TP. Đà Nẵng",
      city: "Đà Nẵng",
    },
    {
      name: "Chính Nguyễn - Nguyễn Hoàng",
      address: "306/14 Nguyễn Hoàng - TP. Đà Nẵng",
      city: "Đà Nẵng",
    },
    {
      name: "Chính Nguyễn - Hùng Vương (Hội An)",
      address: "139/2 Hùng Vương, TP. Hội An",
      city: "Hội An",
    },
  ],
} as const;
