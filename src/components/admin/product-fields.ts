import type { AdminField } from "./AdminForm";
import { NEED_OPTIONS } from "@/lib/product-query";

// Bộ field dùng chung cho form THÊM và SỬA sản phẩm.

const YES_NO = [
  { value: "khong", label: "Không" },
  { value: "co", label: "Có" },
];

export function productFields(brandNames: string[]): AdminField[] {
  return [
    { name: "h1", label: "Thông tin cơ bản", type: "heading" },
    {
      name: "name",
      label: "Tên sản phẩm *",
      full: true,
      placeholder: "VD: Dell Precision 5540 RAM 16GB SSD 512GB T1000 FHD+ (CŨ)",
    },
    {
      name: "brand",
      label: "Thương hiệu *",
      type: "select",
      options: brandNames.map((b) => ({ value: b, label: b })),
    },
    {
      name: "condition",
      label: "Tình trạng máy *",
      type: "select",
      options: [
        { value: "used", label: "Máy cũ (đã qua sử dụng)" },
        { value: "new", label: "Máy mới" },
      ],
    },
    { name: "price", label: "Giá bán (VNĐ) *", type: "number", placeholder: "8500000" },
    {
      name: "oldPrice",
      label: "Giá gốc gạch ngang (VNĐ)",
      type: "number",
      placeholder: "Để trống nếu không giảm giá",
    },

    { name: "h2", label: "Cấu hình", type: "heading" },
    { name: "cpu", label: "CPU *", placeholder: "i5 10400H" },
    { name: "ram", label: "RAM *", placeholder: "8GB" },
    { name: "storage", label: "Ổ cứng *", placeholder: "256GB" },
    { name: "gpu", label: "Card đồ họa", placeholder: "T1000 / RTX 4050 (để trống nếu tích hợp)" },
    { name: "screen", label: "Màn hình", placeholder: "FHD · 15.6 inch" },
    { name: "resolution", label: "Độ phân giải", placeholder: "1920x1080" },
    { name: "refresh", label: "Tần số quét", placeholder: "60Hz / 144Hz" },
    { name: "os", label: "Hệ điều hành", placeholder: "Windows 10 / Windows 11" },
    { name: "battery", label: "Pin", placeholder: "56Wh" },
    { name: "weight", label: "Trọng lượng", placeholder: "1.8 kg" },
    { name: "ports", label: "Cổng kết nối", placeholder: "USB-C, HDMI, jack 3.5mm" },
    { name: "warranty", label: "Bảo hành", placeholder: "Bảo hành shop" },

    { name: "h3", label: "Phân loại & hiển thị", type: "heading" },
    {
      name: "needs",
      label: "Nhu cầu sử dụng (lọc + SEO)",
      type: "checkboxes",
      options: NEED_OPTIONS,
    },
    { name: "images", label: "Ảnh sản phẩm", type: "images" },
    { name: "gift", label: "Quà tặng kèm", placeholder: "Balo + chuột" },
    { name: "badge", label: "Nhãn góc ảnh", placeholder: "Bán chạy" },
    {
      name: "accent",
      label: "Màu ảnh minh hoạ (khi chưa có ảnh thật)",
      type: "select",
      options: ["dark", "blue", "red", "silver", "crimson"].map((v) => ({
        value: v,
        label: v,
      })),
    },
    { name: "isNew", label: "Gắn nhãn 'Mới về'", type: "select", options: YES_NO },
    { name: "isFlashSale", label: "Đưa vào Flash Sale", type: "select", options: YES_NO },
    {
      name: "installmentPerMonth",
      label: "Trả góp mỗi tháng (VNĐ)",
      type: "number",
      placeholder: "Để trống nếu không có",
    },
    { name: "sort", label: "Thứ tự hiển thị (số nhỏ lên trước)", type: "number" },

    { name: "h4", label: "SEO (để trống sẽ tự lấy theo tên)", type: "heading" },
    { name: "slug", label: "Slug (đường dẫn)", full: true, placeholder: "tu-dong-tao-tu-ten" },
    { name: "metaTitle", label: "Meta title", full: true },
    { name: "metaDescription", label: "Meta description", type: "textarea" },
  ];
}
