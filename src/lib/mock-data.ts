import type {
  BlogPost,
  Category,
  CustomerPhoto,
  HeroSlide,
  Product,
  SideBanner,
} from "./types";

// Ảnh khách hàng thực tế tại cửa hàng. Hiện đang là ô placeholder.
// KHI CÓ ẢNH THẬT: upload lên Cloudinary rồi điền URL vào field `image`
// (ví dụ image: "https://res.cloudinary.com/<cloud>/image/upload/w_480,q_auto/khach-1.jpg").
export const CUSTOMER_PHOTOS: CustomerPhoto[] = [
  { id: "kh-1", alt: "Khách hàng nhận laptop tại Chính Nguyễn" },
  { id: "kh-2", alt: "Khách hàng chụp ảnh cùng nhân viên" },
  { id: "kh-3", alt: "Khách hàng nhận MacBook mới" },
  { id: "kh-4", alt: "Khách hàng nhận laptop Dell kèm quà" },
  { id: "kh-5", alt: "Khách hàng hài lòng với sản phẩm" },
  { id: "kh-6", alt: "Khách hàng nhận laptop gaming" },
];

// Banner chính (carousel). Thêm slide = thêm 1 object vào mảng này.
// Khi có ảnh banner thật: bổ sung field ảnh và cho HeroSlideArt render next/image.
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "uu-dai-thang-7",
    href: "/san-pham",
    badge: "ƯU ĐÃI THÁNG 7",
    title1: "Laptop chính hãng",
    title2: "giá tốt mỗi ngày",
    subtitle: "Trả góp 0% · Bảo hành 24 tháng · Giao nhanh toàn quốc",
    cta: "Mua ngay",
    accent: "green",
  },
  {
    id: "gaming-week",
    href: "/danh-muc/laptop-gaming",
    badge: "GAMING WEEK",
    title1: "Laptop Gaming RTX",
    title2: "giảm đến 20%",
    subtitle: "RTX 4050/4060 · Trả góp 0% · Quà tặng hấp dẫn",
    cta: "Săn deal ngay",
    accent: "blue",
  },
  {
    id: "apple-days",
    href: "/danh-muc/macbook",
    badge: "APPLE DAYS",
    title1: "MacBook chính hãng",
    title2: "trả góp 0%",
    subtitle: "MacBook Air/Pro · Giá tốt nhất Đà Nẵng",
    cta: "Khám phá ngay",
    accent: "purple",
  },
];

// Banner treo 2 bên: phần tử [0] = bên trái, [1] = bên phải.
export const SIDE_BANNERS: SideBanner[] = [
  {
    id: "tra-gop-0",
    href: "/chinh-sach/tra-gop",
    title: "Trả góp 0%",
    subtitle: "Duyệt trong 15 phút",
    accent: "green",
  },
  {
    id: "thu-cu-doi-moi",
    href: "/thu-cu-doi-moi",
    title: "Thu cũ đổi mới",
    subtitle: "Trợ giá đến 3 triệu",
    accent: "blue",
  },
];

// Dữ liệu giả lập cho giai đoạn dựng giao diện. Khi có DB (Prisma),
// thay các hàm getter bên dưới bằng query thật — component không đổi.

export const FLASH_SALE_PRODUCTS: Product[] = [
  {
    id: "p-dell-xps-13-plus-9320",
    slug: "dell-xps-13-plus-9320-i7",
    name: "Dell XPS 13 Plus 9320 i7",
    brand: "Dell",
    price: 28_990_000,
    oldPrice: 34_990_000,
    cpu: "i7-1360P",
    ram: "16GB",
    storage: "512GB",
    rating: 4.8,
    reviewCount: 120,
    installmentPerMonth: 2_416_000,
    gift: "Tặng balo + chuột",
    badge: "-18%",
    accent: "blue",
  },
  {
    id: "p-asus-rog-strix-g16",
    slug: "asus-rog-strix-g16-rtx-4060",
    name: "Asus ROG Strix G16 RTX 4060",
    brand: "Asus",
    price: 32_490_000,
    oldPrice: 41_990_000,
    cpu: "i7-13650HX",
    ram: "16GB",
    storage: "RTX 4060",
    rating: 4.9,
    reviewCount: 86,
    installmentPerMonth: 2_708_000,
    gift: "Tặng balo + tai nghe",
    badge: "-22%",
    accent: "red",
  },
  {
    id: "p-macbook-air-m3-13",
    slug: "macbook-air-m3-13-inch-2024",
    name: "MacBook Air M3 13 inch 2024",
    brand: "MacBook",
    price: 24_990_000,
    oldPrice: 29_490_000,
    cpu: "Apple M3",
    ram: "8GB",
    storage: "256GB",
    rating: 4.9,
    reviewCount: 210,
    installmentPerMonth: 2_082_000,
    gift: "Tặng túi chống sốc",
    badge: "-15%",
    accent: "silver",
  },
  {
    id: "p-lenovo-thinkpad-x1-carbon-g11",
    slug: "lenovo-thinkpad-x1-carbon-g11",
    name: "Lenovo ThinkPad X1 Carbon G11",
    brand: "Lenovo",
    price: 30_490_000,
    oldPrice: 37_990_000,
    cpu: "i7-1355U",
    ram: "16GB",
    storage: "512GB",
    rating: 4.7,
    reviewCount: 54,
    installmentPerMonth: 2_541_000,
    gift: "Tặng balo cao cấp",
    badge: "-20%",
    accent: "crimson",
  },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "p-dell-inspiron-15-3530",
    slug: "dell-inspiron-15-3530-i5",
    name: "Dell Inspiron 15 3530 i5",
    brand: "Dell",
    price: 15_490_000,
    oldPrice: 17_990_000,
    cpu: "i5-1335U",
    ram: "16GB",
    storage: "512GB",
    rating: 4.6,
    reviewCount: 98,
    installmentPerMonth: 1_291_000,
    gift: "Tặng chuột không dây",
    badge: "-14%",
    accent: "blue",
  },
  {
    id: "p-dell-latitude-5440",
    slug: "dell-latitude-5440-i5",
    name: "Dell Latitude 5440 i5",
    brand: "Dell",
    price: 19_990_000,
    oldPrice: 23_490_000,
    cpu: "i5-1345U",
    ram: "16GB",
    storage: "512GB",
    rating: 4.7,
    reviewCount: 41,
    installmentPerMonth: 1_666_000,
    accent: "dark",
  },
  {
    id: "p-asus-zenbook-14-oled",
    slug: "asus-zenbook-14-oled-ux3405",
    name: "Asus Zenbook 14 OLED UX3405",
    brand: "Asus",
    price: 26_990_000,
    oldPrice: 30_990_000,
    cpu: "Ultra 7 155H",
    ram: "16GB",
    storage: "1TB",
    rating: 4.8,
    reviewCount: 132,
    installmentPerMonth: 2_249_000,
    gift: "Tặng túi chống sốc",
    badge: "-13%",
    isNew: true,
    accent: "silver",
  },
  {
    id: "p-asus-tuf-gaming-f15",
    slug: "asus-tuf-gaming-f15-rtx-3050",
    name: "Asus TUF Gaming F15 RTX 3050",
    brand: "Asus",
    price: 18_990_000,
    oldPrice: 22_490_000,
    cpu: "i5-12500H",
    ram: "16GB",
    storage: "RTX 3050",
    rating: 4.5,
    reviewCount: 76,
    installmentPerMonth: 1_582_000,
    badge: "-15%",
    accent: "red",
  },
  {
    id: "p-acer-aspire-5-a515",
    slug: "acer-aspire-5-a515-i5",
    name: "Acer Aspire 5 A515 i5",
    brand: "Acer",
    price: 13_490_000,
    oldPrice: 15_990_000,
    cpu: "i5-1235U",
    ram: "16GB",
    storage: "512GB",
    rating: 4.4,
    reviewCount: 63,
    installmentPerMonth: 1_124_000,
    gift: "Tặng balo",
    badge: "-16%",
    accent: "silver",
  },
  {
    id: "p-acer-nitro-5-tiger",
    slug: "acer-nitro-5-tiger-rtx-4050",
    name: "Acer Nitro 5 Tiger RTX 4050",
    brand: "Acer",
    price: 21_990_000,
    oldPrice: 25_990_000,
    cpu: "i7-13620H",
    ram: "16GB",
    storage: "RTX 4050",
    rating: 4.6,
    reviewCount: 88,
    installmentPerMonth: 1_832_000,
    badge: "-15%",
    accent: "crimson",
  },
  {
    id: "p-lenovo-ideapad-slim-5",
    slug: "lenovo-ideapad-slim-5-i5",
    name: "Lenovo IdeaPad Slim 5 i5",
    brand: "Lenovo",
    price: 16_490_000,
    oldPrice: 18_990_000,
    cpu: "i5-13420H",
    ram: "16GB",
    storage: "512GB",
    rating: 4.5,
    reviewCount: 57,
    installmentPerMonth: 1_374_000,
    accent: "blue",
  },
  {
    id: "p-lenovo-loq-15",
    slug: "lenovo-loq-15-rtx-4060",
    name: "Lenovo LOQ 15 RTX 4060",
    brand: "Lenovo",
    price: 25_490_000,
    oldPrice: 29_990_000,
    cpu: "i7-13650HX",
    ram: "16GB",
    storage: "RTX 4060",
    rating: 4.7,
    reviewCount: 104,
    installmentPerMonth: 2_124_000,
    gift: "Tặng tai nghe gaming",
    badge: "-15%",
    isNew: true,
    accent: "red",
  },
  {
    id: "p-hp-pavilion-15",
    slug: "hp-pavilion-15-i5",
    name: "HP Pavilion 15 i5",
    brand: "HP",
    price: 14_990_000,
    oldPrice: 17_490_000,
    cpu: "i5-1334U",
    ram: "8GB",
    storage: "512GB",
    rating: 4.3,
    reviewCount: 49,
    installmentPerMonth: 1_249_000,
    accent: "silver",
  },
  {
    id: "p-hp-victus-16",
    slug: "hp-victus-16-rtx-4060",
    name: "HP Victus 16 RTX 4060",
    brand: "HP",
    price: 23_990_000,
    oldPrice: 27_990_000,
    cpu: "i7-13700H",
    ram: "16GB",
    storage: "RTX 4060",
    rating: 4.6,
    reviewCount: 71,
    installmentPerMonth: 1_999_000,
    gift: "Tặng balo + chuột",
    badge: "-14%",
    accent: "dark",
  },
  {
    id: "p-macbook-air-m2-13",
    slug: "macbook-air-m2-13-inch",
    name: "MacBook Air M2 13 inch",
    brand: "MacBook",
    price: 21_990_000,
    oldPrice: 24_990_000,
    cpu: "Apple M2",
    ram: "8GB",
    storage: "256GB",
    rating: 4.8,
    reviewCount: 187,
    installmentPerMonth: 1_832_000,
    gift: "Tặng túi chống sốc",
    badge: "-12%",
    accent: "silver",
  },
  {
    id: "p-macbook-pro-14-m3",
    slug: "macbook-pro-14-m3",
    name: "MacBook Pro 14 M3",
    brand: "MacBook",
    price: 39_990_000,
    oldPrice: 44_990_000,
    cpu: "Apple M3",
    ram: "16GB",
    storage: "512GB",
    rating: 4.9,
    reviewCount: 143,
    installmentPerMonth: 3_332_000,
    badge: "-11%",
    isNew: true,
    accent: "dark",
  },
];

export const CATEGORIES: Category[] = [
  { slug: "laptop-van-phong", name: "Laptop văn phòng", icon: "office" },
  { slug: "laptop-gaming", name: "Laptop Gaming", icon: "gaming" },
  { slug: "laptop-do-hoa", name: "Laptop đồ họa", icon: "graphic" },
  { slug: "laptop-mong-nhe", name: "Laptop mỏng nhẹ", icon: "slim" },
  { slug: "laptop-sinh-vien", name: "Laptop sinh viên", icon: "student" },
  { slug: "macbook", name: "MacBook", icon: "macbook" },
  { slug: "laptop-ai", name: "Laptop AI", icon: "ai" },
  { slug: "laptop-cu", name: "Laptop cũ", icon: "used", tag: "Giá tốt" },
  { slug: "dell", name: "Dell", icon: "dell" },
  { slug: "asus", name: "Asus", icon: "asus" },
  { slug: "acer", name: "Acer", icon: "acer" },
  { slug: "lenovo", name: "Lenovo", icon: "lenovo" },
  { slug: "hp", name: "HP", icon: "hp" },
  { slug: "msi", name: "MSI", icon: "msi", tag: "Hot" },
  { slug: "man-hinh", name: "Màn hình", icon: "monitor" },
  { slug: "phu-kien", name: "Phụ kiện", icon: "accessory" },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "chon-laptop-cho-sinh-vien-2026-ngan-sach-15-trieu",
    tag: "Tư vấn",
    title: "Chọn laptop cho sinh viên 2026: ngân sách 15 triệu nên mua gì?",
    readMinutes: 5,
    date: "02/07/2026",
    accent: "green",
    excerpt:
      "Với 15 triệu đồng, sinh viên hoàn toàn có thể chọn được chiếc laptop bền, pin tốt, cấu hình đủ dùng cho học tập và giải trí.",
    content: [
      "Ở tầm giá 15 triệu, ưu tiên hàng đầu nên là CPU Intel Core i5 thế hệ mới hoặc AMD Ryzen 5, kèm tối thiểu 16GB RAM và ổ SSD 512GB. Đây là cấu hình cân bằng cho hầu hết nhu cầu học tập, lập trình nhẹ và giải trí.",
      "Về thiết kế, hãy chọn máy mỏng nhẹ dưới 1.8kg để tiện mang tới trường. Màn hình nên đạt độ phân giải Full HD, tấm nền IPS để bảo vệ mắt khi dùng lâu.",
      "Một số lựa chọn đáng cân nhắc trong tầm giá này gồm Dell Inspiron 15, Acer Aspire 5, HP Pavilion 15 và Lenovo IdeaPad Slim 5 — đều là các dòng phổ thông, bền bỉ và dễ bảo hành.",
    ],
  },
  {
    slug: "7-cach-tang-tuoi-tho-pin-laptop",
    tag: "Thủ thuật",
    title: "7 cách tăng tuổi thọ pin laptop bạn nên biết",
    readMinutes: 4,
    date: "28/06/2026",
    accent: "blue",
    excerpt:
      "Vài thói quen đơn giản giúp viên pin laptop của bạn bền hơn, giữ dung lượng tốt qua nhiều năm sử dụng.",
    content: [
      "Không nên để pin cạn kiệt về 0% thường xuyên. Sạc khi pin còn khoảng 20% và rút ra quanh mức 80% sẽ giúp chai pin chậm hơn.",
      "Giảm độ sáng màn hình, tắt bàn phím LED và các ứng dụng chạy nền không cần thiết để tiết kiệm điện năng đáng kể.",
      "Tránh để máy ở nơi quá nóng. Nhiệt độ cao là kẻ thù số một của pin lithium — hãy dùng đế tản nhiệt khi làm việc nặng.",
    ],
  },
  {
    slug: "macbook-air-m3-vs-dell-xps-13",
    tag: "So sánh",
    title: "MacBook Air M3 và Dell XPS 13: đâu là lựa chọn tốt hơn?",
    readMinutes: 6,
    date: "25/06/2026",
    accent: "purple",
    excerpt:
      "Hai chiếc ultrabook cao cấp, hai hệ điều hành khác nhau. Đâu mới là lựa chọn phù hợp với bạn?",
    content: [
      "MacBook Air M3 ghi điểm ở thời lượng pin vượt trội, hiệu năng mát mẻ nhờ chip Apple Silicon và hệ sinh thái macOS mượt mà. Đây là lựa chọn lý tưởng nếu bạn ưu tiên pin và sự ổn định.",
      "Dell XPS 13 lại mạnh về màn hình, thiết kế sang trọng và khả năng nâng cấp, chạy Windows nên tương thích tốt với nhiều phần mềm chuyên ngành.",
      "Nếu bạn làm sáng tạo nội dung, cần pin trâu và quen macOS, hãy chọn MacBook Air M3. Ngược lại, nếu công việc phụ thuộc phần mềm Windows, Dell XPS 13 là lựa chọn an toàn.",
    ],
  },
];

// Các trang nội dung tĩnh cho phép chỉnh trong admin.
export interface StaticPageInfo {
  id: string;
  title: string;
  path: string;
}

export const STATIC_PAGES: StaticPageInfo[] = [
  { id: "gioi-thieu", title: "Giới thiệu", path: "/gioi-thieu" },
  { id: "lien-he", title: "Liên hệ", path: "/lien-he" },
  { id: "he-thong-cua-hang", title: "Hệ thống cửa hàng", path: "/he-thong-cua-hang" },
  { id: "tuyen-dung", title: "Tuyển dụng", path: "/tuyen-dung" },
  { id: "thu-cu-doi-moi", title: "Thu cũ đổi mới", path: "/thu-cu-doi-moi" },
  { id: "bao-hanh", title: "Chính sách bảo hành", path: "/chinh-sach/bao-hanh" },
  { id: "doi-tra", title: "Chính sách đổi trả", path: "/chinh-sach/doi-tra" },
  { id: "giao-hang", title: "Chính sách giao hàng", path: "/chinh-sach/giao-hang" },
  { id: "tra-gop", title: "Chính sách trả góp", path: "/chinh-sach/tra-gop" },
  { id: "dieu-khoan", title: "Điều khoản sử dụng", path: "/chinh-sach/dieu-khoan" },
  { id: "bao-mat", title: "Chính sách bảo mật", path: "/chinh-sach/bao-mat" },
];

export function getStaticPage(id: string): StaticPageInfo | undefined {
  return STATIC_PAGES.find((p) => p.id === id);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, limit);
}

// Gộp toàn bộ sản phẩm để tra cứu theo slug (trang chi tiết).
// Khi có DB: thay bằng prisma.product.findUnique({ where: { slug } }).
export const ALL_PRODUCTS: Product[] = [
  ...FLASH_SALE_PRODUCTS,
  ...FEATURED_PRODUCTS,
];

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

/** Sản phẩm liên quan: ưu tiên cùng hãng, rồi bù thêm cho đủ số lượng. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameBrand = ALL_PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.brand === product.brand,
  );
  const others = ALL_PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.brand !== product.brand,
  );
  return [...sameBrand, ...others].slice(0, limit);
}

// Nhóm danh mục cho mega-menu (thanh điều hướng).
export const CATEGORY_GROUPS: { title: string; slugs: string[] }[] = [
  {
    title: "Theo nhu cầu",
    slugs: [
      "laptop-van-phong",
      "laptop-gaming",
      "laptop-do-hoa",
      "laptop-mong-nhe",
      "laptop-sinh-vien",
      "laptop-ai",
    ],
  },
  {
    title: "Theo thương hiệu",
    slugs: ["dell", "asus", "acer", "lenovo", "hp", "msi", "macbook"],
  },
  {
    title: "Khác",
    slugs: ["laptop-cu", "man-hinh", "phu-kien"],
  },
];

// Link nhanh nổi bật trên thanh điều hướng.
export const QUICK_NAV_LINKS: { label: string; href: string; hot?: boolean }[] =
  [
    { label: "Tất cả sản phẩm", href: "/san-pham" },
    { label: "Laptop Gaming", href: "/danh-muc/laptop-gaming" },
    { label: "Văn phòng", href: "/danh-muc/laptop-van-phong" },
    { label: "MacBook", href: "/danh-muc/macbook" },
    { label: "Dell", href: "/danh-muc/dell" },
    { label: "Asus", href: "/danh-muc/asus" },
    { label: "Thu cũ đổi mới", href: "/thu-cu-doi-moi" },
    { label: "Trả góp 0%", href: "/chinh-sach/tra-gop" },
  ];

/** Các brand dùng làm tab lọc ở khối "Sản phẩm nổi bật". */
export const FEATURED_BRAND_TABS = [
  "Tất cả",
  "Dell",
  "Asus",
  "Acer",
  "Lenovo",
  "HP",
  "MacBook",
] as const;
