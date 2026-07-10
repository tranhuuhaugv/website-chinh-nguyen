import type {
  BlogBlock,
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

// Trợ giúp gọn khi khai báo bài viết mẫu (mỗi khối 1 dòng).
const t = (value: string): BlogBlock => ({ type: "text", value });
const h = (value: string): BlogBlock => ({ type: "heading", value });

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "chon-laptop-cho-sinh-vien-2026-ngan-sach-15-trieu",
    tag: "Tư vấn",
    title: "Laptop cho sinh viên 2026: ngân sách 15 triệu nên mua gì?",
    readMinutes: 6,
    date: "08/07/2026",
    accent: "green",
    excerpt:
      "Với 15 triệu đồng năm 2026, sinh viên hoàn toàn có thể chọn được chiếc laptop bền, pin tốt và cấu hình đủ dùng cho cả học tập lẫn giải trí. Dưới đây là những tiêu chí và gợi ý cụ thể.",
    content: [
      h("Tầm giá 15 triệu năm 2026 mua được gì?"),
      t("Đây là phân khúc tối ưu nhất cho sinh viên. Nhờ công nghệ ngày càng rẻ, các mẫu máy dưới 15 triệu hiện đã đủ sức đáp ứng mọi nhu cầu học tập, học online, đa nhiệm nhiều tab Chrome và giải trí nhẹ nhàng — điều mà vài năm trước phải bỏ ra nhiều tiền hơn mới có."),
      h("Cấu hình nên ưu tiên"),
      t("CPU: Intel Core i5 thế hệ mới (gen 12–13) hoặc AMD Ryzen 5. RAM: nên chọn 16GB để chạy mượt các ứng dụng tích hợp AI và đa nhiệm — 8GB vẫn dùng được cho văn phòng cơ bản nhưng sẽ nhanh chật. Ổ cứng: SSD NVMe tối thiểu 512GB cho tốc độ khởi động nhanh và đủ chỗ lưu tài liệu, dự án."),
      h("Màn hình và thiết kế"),
      t("Kích thước lý tưởng là 14 inch (cân bằng hiển thị và di động) hoặc 15.6 inch nếu cần không gian lớn. Ưu tiên tỷ lệ 16:10 để xem được nhiều nội dung theo chiều dọc, độ phân giải Full HD trở lên, tấm nền IPS để góc nhìn rộng và đỡ mỏi mắt. Trọng lượng nên dưới 1.7kg cho dễ mang tới giảng đường, pin thực tế 8–12 giờ để yên tâm cả ngày."),
      h("Vài mẫu đáng cân nhắc"),
      t("Lenovo IdeaPad Slim 3 (Core i5, 16GB, SSD 512GB) và HP Pavilion 14 (Core i5, 16GB) là hai lựa chọn cân bằng nhất tầm giá này. Ngoài ra có Asus Vivobook 14 (mỏng nhẹ 1.4kg, chuẩn bền quân đội) và Acer Aspire 5 — đều là dòng phổ thông, bền bỉ và dễ bảo hành."),
      h("Chọn theo ngành học"),
      t("Ngành kinh tế, sư phạm, ngoại ngữ: card đồ họa tích hợp (Intel Iris Xe / AMD Radeon) là đủ. Ngành CNTT, kỹ thuật: ưu tiên CPU dòng H mạnh và RAM 16GB để chạy máy ảo, biên dịch mã. Ngành thiết kế, dựng phim: cần card rời RTX — thường phải nâng ngân sách lên trên 20 triệu."),
      h("Những bẫy nên tránh"),
      t("Đừng ham cấu hình giá rẻ ảo với chỉ 8GB RAM để tiết kiệm ban đầu — máy sẽ nhanh giật lag với ứng dụng năm 2026. Cũng đừng chọn laptop gaming quá nặng chỉ vì mạnh: mang vác mỗi ngày rất cực. Nếu chọn máy cũ, hãy mua ở nơi uy tín và kiểm tra kỹ pin, linh kiện trước khi quyết định."),
    ],
  },
  {
    slug: "laptop-gaming-rtx-5060-5070-tam-gia-20-30-trieu-2026",
    tag: "Tư vấn",
    title: "Laptop gaming 20–30 triệu 2026: chọn RTX 5060 hay RTX 5070?",
    readMinutes: 6,
    date: "05/07/2026",
    accent: "blue",
    excerpt:
      "Thế hệ RTX 50 (Blackwell) đưa laptop gaming tầm trung lên tầm cao mới. Nên chọn RTX 5060 hay cố lên RTX 5070? Bài viết giúp bạn quyết định.",
    content: [
      h("RTX 5060 hay RTX 5070?"),
      t("RTX 5060 được tối ưu cho độ phân giải Full HD và 2K — dư sức chơi hầu hết game AAA ở thiết lập cao. RTX 5070 (đặc biệt bản 12GB mới) mạnh hơn rõ rệt và hợp cho ai muốn chơi mượt ở 1440p có bật ray tracing, nhưng giá thường chạm ngưỡng 30 triệu."),
      h("Vì sao RTX 5060 đáng tiền năm 2026"),
      t("Kiến trúc Blackwell cải thiện hiệu năng và giảm nhiệt, đi kèm DLSS thế hệ mới giúp tăng khung hình mạnh trong game AAA cùng bộ nhớ GDDR7 nhanh hơn. Một số bài benchmark cho thấy RTX 5060 Mobile 115W còn nhỉnh hơn RTX 4070 Mobile 140W khoảng 12% ở cùng mức điện — một bước tiến đáng kể ở tầm trung."),
      h("Lưu ý quan trọng nhất: TGP"),
      t("TGP (Total Graphics Power) là yếu tố quyết định thường bị bỏ qua. Cùng là RTX 5070 nhưng bản chạy 60W cho hiệu năng khác hẳn bản 115W. Hãy luôn kiểm tra thông số TGP của từng model. Nên ưu tiên máy có MUX Switch / Advanced Optimus để tối ưu FPS khi chơi và tiết kiệm pin khi làm việc nhẹ."),
      h("Màn hình và tản nhiệt"),
      t("Nên chọn màn tần số quét 165Hz trở lên cho trải nghiệm mượt, độ phủ màu 100% sRGB hoặc DCI-P3 nếu bạn còn làm đồ họa/dựng phim. Đừng chỉ nhìn thông số: hãy đến showroom nghe thử độ ồn và cảm nhận nhiệt độ của hệ thống tản nhiệt khi máy chạy tải nặng."),
      h("Vài mẫu nổi bật"),
      t("Asus TUF Gaming RTX 5060 (màn 16 inch WUXGA 165Hz, có MUX Switch) và MSI RTX 5060 (màn QHD 165Hz, 100% DCI-P3, Core i7-14650HX) là lựa chọn cân bằng. Nếu ưu tiên di động, Asus TUF A14 (1.46kg, chuẩn quân sự) hay ROG Zephyrus G14 rất đáng xem — nhưng bản G14 cao cấp thường vượt 30 triệu."),
      h("Kết luận"),
      t("Trong tầm 20–30 triệu năm 2026, RTX 5060 là lựa chọn tối ưu hiệu năng trên giá thành cho phần lớn game thủ chơi ở Full HD/2K. Chỉ nên cố lên RTX 5070 12GB nếu bạn thực sự cần chơi 1440p có ray tracing và ngân sách cho phép."),
    ],
  },
  {
    slug: "intel-core-ultra-vs-amd-ryzen-ai-2026",
    tag: "So sánh",
    title: "Intel Core Ultra và AMD Ryzen AI 2026: nên chọn nền tảng nào?",
    readMinutes: 7,
    date: "02/07/2026",
    accent: "purple",
    excerpt:
      "Hai nền tảng CPU laptop hàng đầu 2026 với hai thế mạnh rõ rệt: Intel giỏi pin và di động, AMD mạnh hiệu năng và đồ họa tích hợp. Chọn cái nào là hợp với bạn?",
    content: [
      h("Hai nền tảng, hai thế mạnh"),
      t("Khác biệt lớn nhất giữa Intel Core Ultra Series 2 (Lunar Lake) và AMD Ryzen AI 300 (Strix Point) nằm ở hiệu suất pin, đồ họa tích hợp và định hướng sử dụng. Không có nền tảng nào 'thắng tuyệt đối' — chọn đúng phụ thuộc vào ưu tiên của bạn."),
      h("Pin và tính di động — Intel nhỉnh hơn"),
      t("Đây là khác biệt thực tế lớn nhất. Các máy Lunar Lake như XPS 13 hay ThinkPad X1 Carbon có thể đạt 16–20 giờ dùng hỗn hợp thực tế, trong khi laptop mỏng nhẹ dùng Ryzen AI 300 thường ở mức 10–12 giờ. Ở tác vụ nhẹ hằng ngày, Intel tiêu thụ điện thấp hơn hẳn."),
      h("Hiệu năng và đồ họa tích hợp — AMD chiếm ưu thế"),
      t("Về sức mạnh thô và đồ họa tích hợp, AMD thường dẫn trước. Kiến trúc Zen 5 tăng đáng kể số lệnh mỗi xung (IPC), thu hẹp khoảng cách xung nhịp với Intel. Đặc biệt, iGPU Radeon 890M trên Ryzen AI 300 mạnh gần bằng card rời phổ thông — lợi thế lớn cho người dựng nội dung hoặc chơi game nhẹ mà không cần GPU rời."),
      h("Khả năng AI (Copilot+) — gần như ngang nhau"),
      t("Cả Intel Core Ultra Series 2 lẫn AMD Ryzen AI 300 đều vượt mốc 40 TOPS mà Microsoft yêu cầu cho Copilot+. Trong thực tế, các tính năng AI (Live Captions, Windows Studio Effects, Cocreator…) chạy như nhau. Vì vậy đừng để 'Copilot+' là yếu tố quyết định — hãy chọn dựa trên pin, hiệu năng và giá."),
      h("Chơi game"),
      t("AMD tỏa sáng ở game thế giới mở và game nặng CPU nhiều nhân (Cyberpunk 2077, Flight Simulator, chiến thuật). Intel lại có lợi thế xung đơn nhân cao, hợp cho game esports cần FPS tối đa (Valorant, CS2)."),
      h("Vậy nên chọn cái nào?"),
      t("Chọn Intel Core Ultra Series 2 nếu pin và sự mỏng nhẹ là ưu tiên số một — cần 18+ giờ và máy siêu nhẹ. Chọn AMD Ryzen AI 300 nếu bạn cần hiệu năng cao, đồ họa tích hợp mạnh, làm sáng tạo hoặc chơi game linh hoạt với giá dễ chịu hơn. Lưu ý: thời lượng pin phụ thuộc nhiều vào thiết kế của từng máy chứ không chỉ ở logo CPU."),
    ],
  },
  {
    slug: "cach-bao-ve-tang-tuoi-tho-pin-laptop-2026",
    tag: "Thủ thuật",
    title: "6 cách bảo vệ và tăng tuổi thọ pin laptop (cập nhật 2026)",
    readMinutes: 5,
    date: "28/06/2026",
    accent: "green",
    excerpt:
      "Vài thói quen đơn giản dựa trên đặc tính pin lithium giúp viên pin laptop bền hơn, giữ dung lượng tốt qua nhiều năm. Tổng hợp lời khuyên mới nhất năm 2026.",
    content: [
      h("Vì sao pin bị chai?"),
      t("Pin lithium-ion bị 'stress' và xuống cấp nhanh khi thường xuyên sạc đầy 100% hoặc để cạn về 0%. Hiểu điều này là chìa khóa để dùng pin bền: mục tiêu là hạn chế thời gian pin nằm ở hai vùng cực đó."),
      h("1. Giữ pin trong khoảng 20–80%"),
      t("Đây là quy tắc quan trọng nhất và được nhắc lại nhiều nhất. Sạc khi pin còn khoảng 20% và rút ra quanh 80% giúp giảm áp lực hóa học lên pin, kéo dài đáng kể tuổi thọ mà gần như không ảnh hưởng trải nghiệm hằng ngày."),
      h("2. Bật giới hạn sạc 80% khi hay cắm điện"),
      t("Nếu máy chủ yếu để bàn và cắm sạc liên tục, hãy bật 'Conservation Mode' / giới hạn sạc 80% trong phần mềm của hãng: Lenovo Vantage, MyASUS, Dell Power Manager… Việc này có thể giảm mức độ chai pin khoảng 30% sau 2 năm mà bạn gần như không nhận ra khác biệt trong sử dụng."),
      h("3. Đừng để pin cạn về 0%"),
      t("Để máy chết hẳn cũng hại như sạc đầy liên tục. Một nghiên cứu trên hơn 10.000 laptop cho thấy máy được sạc 'nông' vẫn giữ 80% dung lượng sau 500 chu kỳ, trong khi máy hay xả sâu chỉ còn 80% sau 350 chu kỳ. Thói quen xả cạn rồi mới sạc là của pin nickel đời cũ — không còn đúng với pin lithium ngày nay."),
      h("4. Kiểm soát nhiệt độ — kẻ thù số một"),
      t("Nhiệt cao làm pin xuống cấp nhanh nhất. Đừng đặt máy trên chăn, nệm bịt khe tản nhiệt; vệ sinh quạt định kỳ; dùng đế tản nhiệt khi chạy tải nặng. Hạn chế lạm dụng sạc nhanh vì nó làm pin nóng hơn."),
      h("5. Cất giữ đúng cách"),
      t("Nếu không dùng máy trong thời gian dài, đừng cất khi pin đầy hoặc cạn — hãy để pin quanh 40–60% để giảm hao hụt dung lượng khi máy nằm im."),
      h("6. Kiểm tra sức khỏe pin định kỳ"),
      t("Trên Windows, mở Command Prompt (admin) và gõ lệnh powercfg /batteryreport để xem báo cáo pin. Đa số pin đạt 500–1.000 chu kỳ trước khi tụt dưới 80%. Chỉ nên thay pin khi dung lượng xuống dưới 65% và không trụ nổi 3 giờ tác vụ nhẹ."),
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
