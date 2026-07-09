import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { getProductBySlug, ALL_PRODUCTS } from "@/lib/mock-data";

export const metadata = { title: "Sản phẩm" };

const BRAND_OPTIONS = [
  "Dell",
  "Asus",
  "Acer",
  "Lenovo",
  "HP",
  "MacBook",
  "MSI",
].map((b) => ({ value: b, label: b }));

// Nhu cầu sử dụng — dùng để lọc sản phẩm sau này.
const NEED_OPTIONS = [
  { value: "van-phong", label: "Văn phòng" },
  { value: "gaming", label: "Gaming" },
  { value: "do-hoa", label: "Đồ họa - Kỹ thuật" },
  { value: "cao-cap", label: "Cao cấp - sang trọng" },
  { value: "mong-nhe", label: "Mỏng nhẹ" },
  { value: "sinh-vien", label: "Sinh viên" },
  { value: "cam-ung", label: "Cảm ứng" },
  { value: "pin-trau", label: "Pin trâu" },
];

// Cam kết dịch vụ mặc định (hiển thị dưới ảnh ở trang chi tiết) — mỗi dòng 1 mục.
const DEFAULT_COMMITMENTS = [
  "Máy chính hãng, nguyên seal, đầy đủ hóa đơn VAT",
  "Bảo hành 24 tháng · 1 đổi 1 trong 30 ngày",
  "Giao nhanh 2h nội thành, toàn quốc 1-3 ngày",
  "Hỗ trợ trả góp 0% qua thẻ / công ty tài chính",
].join("\n");

const FIELDS: AdminField[] = [
  { name: "h_basic", label: "Thông tin cơ bản", type: "heading" },
  { name: "images", label: "Ảnh sản phẩm (thêm nhiều ảnh)", type: "images" },
  { name: "name", label: "Tên sản phẩm", full: true, placeholder: "VD: Dell XPS 13 Plus 9320 i7" },
  { name: "brand", label: "Thương hiệu", type: "select", options: BRAND_OPTIONS },
  { name: "price", label: "Giá bán (VND)", type: "number", placeholder: "28990000" },
  { name: "oldPrice", label: "Giá gốc (VND)", type: "number", placeholder: "34990000" },
  { name: "badge", label: "Nhãn giảm giá", placeholder: "-18%" },
  { name: "gift", label: "Quà tặng kèm", placeholder: "Tặng balo + chuột" },

  { name: "h_spec", label: "Cấu hình chi tiết", type: "heading" },
  { name: "cpu", label: "CPU", placeholder: "Intel Core i7-1360P" },
  { name: "ram", label: "RAM", placeholder: "16GB DDR5" },
  { name: "storage", label: "Ổ cứng", placeholder: "512GB SSD NVMe" },
  { name: "gpu", label: "Card đồ họa", placeholder: "RTX 4060 / Card tích hợp" },
  { name: "screen", label: "Màn hình", placeholder: '15.6" Full HD IPS' },
  { name: "resolution", label: "Độ phân giải", placeholder: "1920 × 1080" },
  { name: "refresh", label: "Tần số quét", placeholder: "60Hz / 144Hz" },
  { name: "os", label: "Hệ điều hành", placeholder: "Windows 11" },
  { name: "battery", label: "Pin", placeholder: "3-cell, 56Wh" },
  { name: "weight", label: "Trọng lượng", placeholder: "1.6 kg" },
  { name: "ports", label: "Cổng kết nối", full: true, placeholder: "USB-C, USB-A, HDMI, jack 3.5mm" },
  { name: "warranty", label: "Bảo hành", placeholder: "24 tháng" },

  {
    name: "h_needs",
    label: "Nhu cầu sử dụng",
    type: "heading",
    placeholder: "Chọn các nhu cầu phù hợp để lọc sản phẩm dễ hơn.",
  },
  { name: "needs", label: "Nhu cầu", type: "checkboxes", options: NEED_OPTIONS },

  { name: "h_desc", label: "Đặc điểm nổi bật", type: "heading" },
  { name: "description", label: "Mô tả / bài viết sản phẩm (đoạn văn + chèn ảnh)", type: "blocks" },

  { name: "h_commit", label: "Cam kết dịch vụ", type: "heading" },
  { name: "commitments", label: "Cam kết (mỗi dòng 1 mục)", type: "textarea" },

  {
    name: "h_seo",
    label: "SEO",
    type: "heading",
    placeholder: "Không bắt buộc nhập — tự lấy theo tên sản phẩm nếu để trống.",
  },
  { name: "metaTitle", label: "Meta Title", full: true, placeholder: "Tiêu đề hiển thị trên Google" },
  { name: "metaDescription", label: "Meta Description", type: "textarea", placeholder: "Mô tả ngắn hiển thị trên Google" },
  { name: "metaKeywords", label: "Meta Keywords", full: true, placeholder: "Từ khóa, cách nhau bởi dấu phẩy" },
];

export default function AdminProductFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "them";
  // Tìm theo id (mock). Khi có DB: prisma.product.findUnique.
  const product = isNew
    ? undefined
    : ALL_PRODUCTS.find((p) => p.id === params.id) ??
      getProductBySlug(params.id);

  const initialValues: Record<string, string> = product
    ? {
        name: product.name,
        brand: product.brand,
        price: String(product.price),
        oldPrice: product.oldPrice ? String(product.oldPrice) : "",
        cpu: product.cpu,
        ram: product.ram,
        storage: product.storage,
        badge: product.badge ?? "",
        gift: product.gift ?? "",
        commitments: DEFAULT_COMMITMENTS,
      }
    : { commitments: DEFAULT_COMMITMENTS };

  return (
    <AdminForm
      title={isNew ? "Thêm sản phẩm" : "Sửa sản phẩm"}
      fields={FIELDS}
      initialValues={initialValues}
      submitLabel={isNew ? "Tạo sản phẩm" : "Lưu thay đổi"}
      backHref="/admin/san-pham"
    />
  );
}
