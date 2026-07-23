// Kiểu dữ liệu dùng chung cho toàn trang. Khi nối Prisma sau này,
// các model DB sẽ ánh xạ về đúng những shape này để component không phải sửa.

export type Brand =
  | "Dell"
  | "Asus"
  | "Acer"
  | "Lenovo"
  | "HP"
  | "MacBook"
  | "MSI";

/** Màu gradient của ảnh placeholder (khớp các card trong design). */
export type ProductAccent = "blue" | "red" | "silver" | "crimson" | "dark";

/** Tình trạng máy: mới hoặc đã qua sử dụng. */
export type ProductCondition = "new" | "used";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  /** Giá bán hiện tại (VND). */
  price: number;
  /** Giá gốc gạch ngang (VND), có thể không có. */
  oldPrice?: number;
  cpu: string;
  ram: string;
  storage: string;
  /** Dung lượng gộp hiển thị nhanh, VD "8GB - 256GB". Trống -> tự ghép ram + storage. */
  capacity?: string;
  /** Thông số thật (nhập từ admin / import). Trống thì trang chi tiết bỏ qua dòng đó. */
  gpu?: string;
  /** MUX Switch: "Có" / "Không" / trống. */
  mux?: string;
  /** Webcam: mô tả (VD "HD 720p"). */
  webcam?: string;
  screen?: string;
  resolution?: string;
  refresh?: string;
  os?: string;
  battery?: string;
  weight?: string;
  ports?: string;
  warranty?: string;
  rating: number;
  reviewCount: number;
  /** Trả góp mỗi tháng (VND). */
  installmentPerMonth?: number;
  gift?: string;
  /** Nhãn "-18%", "Mới"... hiển thị góc trái ảnh. */
  badge?: string;
  isNew?: boolean;
  /** Admin tích -> hiện ở khối "Sản phẩm nổi bật" trang chủ. */
  isFeatured?: boolean;
  accent: ProductAccent;
  /** Ảnh thật do admin tải lên (/uploads/...). Trống -> hiện ProductImage (SVG). */
  images?: string[];
  /** Slug các máy cùng dòng khác cấu hình (admin nối bằng link). */
  variantSlugs?: string[];
  /**
   * Mô tả sản phẩm do admin tự soạn (HTML từ CKEditor) — chỗ để đăng ẢNH THẬT
   * của đúng chiếc máy đang bán. ĐÃ ĐƯỢC LỌC ở tầng data (xem lib/rich-text).
   * Trống -> trang chi tiết tự sinh mô tả từ thông số (buildDescription).
   */
  description?: string;
  /** Tình trạng: "new" máy mới | "used" máy cũ (mặc định used cho shop máy cũ). */
  condition?: ProductCondition;
  /** Nhóm nhu cầu để lọc/SEO: van-phong, gaming, do-hoa... */
  needs?: string[];
}

export interface Category {
  slug: string;
  name: string;
  icon: CategoryIconName;
  tag?: string;
  /** URL ảnh thật (Cloudinary / public). Bỏ trống -> hiện ô icon gradient. */
  image?: string;
}

export type CategoryIconName =
  | "office"
  | "gaming"
  | "graphic"
  | "slim"
  | "student"
  | "macbook"
  | "ai"
  | "used"
  | "dell"
  | "asus"
  | "acer"
  | "lenovo"
  | "hp"
  | "msi"
  | "monitor"
  | "accessory"
  | "pc"
  | "new";

/** 1 dòng trong giỏ hàng. */
export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  accent: ProductAccent;
  qty: number;
}

export type BannerAccent = "green" | "blue" | "purple";

/** 1 slide của banner chính (dạng carousel). */
export interface HeroSlide {
  id: string;
  href: string;
  badge?: string;
  title1: string;
  title2?: string;
  subtitle?: string;
  cta?: string;
  accent: BannerAccent;
}

/** Banner ảnh thật do admin tải lên (hero / treo bên). */
export interface BannerItem {
  image: string;
  href: string;
}

/** Banner treo dọc 2 bên trang (chỉ hiện trên màn hình đủ rộng). */
export interface SideBanner {
  id: string;
  href: string;
  title: string;
  subtitle?: string;
  accent: BannerAccent;
}

/** Ảnh khách hàng thực tế tại cửa hàng (dải ảnh dưới "Sản phẩm nổi bật"). */
export interface CustomerPhoto {
  id: string;
  alt: string;
  /** URL ảnh thật (Cloudinary). Bỏ trống -> hiện ô placeholder. */
  image?: string;
}

export type BlogAccent = "green" | "blue" | "purple";

/**
 * ĐỊNH DẠNG CŨ của nội dung (trước khi dùng CKEditor): mảng khối.
 * Không soạn mới kiểu này nữa, chỉ giữ để đọc dữ liệu cũ trong DB
 * (lib/rich-text tự đổi sang HTML khi đọc).
 */
export type BlogBlockType = "text" | "heading" | "image";
export interface BlogBlock {
  type: BlogBlockType;
  value: string;
}

export interface BlogPost {
  slug: string;
  tag: string;
  title: string;
  readMinutes: number;
  date: string;
  accent: BlogAccent;
  excerpt: string;
  /** Ảnh bìa (banner) bài viết. Bỏ trống -> ảnh gradient. */
  image?: string;
  /** Nội dung bài viết (HTML từ CKEditor). ĐÃ ĐƯỢC LỌC ở tầng data. */
  content: string;
}
