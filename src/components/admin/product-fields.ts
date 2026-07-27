import type { AdminField } from "./AdminForm";
import { NEED_OPTIONS } from "@/lib/product-query";

// Bộ field dùng chung cho form THÊM và SỬA sản phẩm.

const YES_NO = [
  { value: "khong", label: "Không" },
  { value: "co", label: "Có" },
];

export function productFields(
  brandNames: string[],
  seriesOptions: { value: string; label: string }[] = [],
): AdminField[] {
  return [
    // Ảnh để ĐẦU form: việc đầu tiên khi thêm/sửa máy là xem/thay ảnh.
    { name: "hAnh", label: "Ảnh sản phẩm", type: "heading" },
    { name: "images", label: "Ảnh sản phẩm (ảnh đầu tiên là ảnh đại diện)", type: "images" },

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
    {
      name: "series",
      label: "Dòng máy (danh mục con theo hãng — dễ SEO & quản lý)",
      type: "select",
      options: [
        { value: "", label: "— Không thuộc dòng nào —" },
        ...seriesOptions,
      ],
    },
    { name: "price", label: "Giá bán (VNĐ) *", type: "money", placeholder: "8.500.000" },
    {
      name: "oldPrice",
      label: "Giá gốc gạch ngang (VNĐ)",
      type: "money",
      placeholder: "Để trống nếu không giảm giá",
    },

    { name: "h2", label: "Cấu hình", type: "heading" },
    { name: "cpu", label: "CPU *", placeholder: "Intel Core i5 10400H" },
    { name: "ram", label: "RAM *", placeholder: "8GB" },
    { name: "storage", label: "Ổ cứng *", placeholder: "256GB SSD" },
    {
      name: "capacity",
      label: "Dung lượng (hiện nhanh ở chi tiết, VD: 8GB - 256GB)",
      placeholder: "8GB - 256GB (để trống sẽ tự ghép RAM + ổ cứng)",
    },
    { name: "gpu", label: "Card VGA", placeholder: "T1000 / RTX 4050 (để trống nếu tích hợp)" },
    { name: "mux", label: "MUX Switch", placeholder: "Có / Không" },
    { name: "screen", label: "Màn hình", placeholder: "15.6 inch FHD IPS" },
    { name: "resolution", label: "Độ phân giải", placeholder: "1920x1080" },
    { name: "refresh", label: "Tần số quét", placeholder: "60Hz / 144Hz" },
    { name: "webcam", label: "Webcam", placeholder: "HD 720p" },
    { name: "ports", label: "Cổng kết nối", placeholder: "USB-C, HDMI, jack 3.5mm" },
    { name: "weight", label: "Trọng lượng", placeholder: "1.8 kg" },
    { name: "battery", label: "Pin", placeholder: "56Wh" },
    { name: "os", label: "Hệ điều hành", placeholder: "Windows 11" },
    { name: "warranty", label: "Bảo hành", placeholder: "Bảo hành shop" },

    { name: "h3", label: "Phân loại & hiển thị", type: "heading" },
    {
      name: "needs",
      label: "Nhu cầu sử dụng (lọc + SEO)",
      type: "checkboxes",
      options: NEED_OPTIONS,
    },
    {
      name: "isFeatured",
      label: "Sản phẩm nổi bật (hiện ở trang chủ)",
      type: "select",
      options: YES_NO,
    },
    { name: "isFlashSale", label: "Đưa vào Flash Sale", type: "select", options: YES_NO },
    { name: "sort", label: "Thứ tự hiển thị (số nhỏ lên trước)", type: "number" },

    {
      name: "hVariant",
      label: "Máy cùng dòng khác cấu hình",
      type: "heading",
    },
    {
      name: "variantLinks",
      label:
        "Dán link các máy cùng dòng (mỗi link 1 dòng) — trang chi tiết sẽ hiện nút chọn Dung lượng",
      type: "textarea",
      full: true,
      placeholder:
        "https://laptopchinhnguyen.com.vn/san-pham/dell-xps-13-9370-ram-16gb-ssd-256gb",
    },

    {
      name: "hMoTa",
      label: "Mô tả sản phẩm (để trống sẽ tự sinh theo thông số máy)",
      type: "heading",
    },
    {
      name: "description",
      label: "Nội dung mô tả — chỗ đăng ẢNH THẬT của chiếc máy này",
      type: "blocks",
      full: true,
    },

    { name: "h4", label: "SEO (để trống sẽ tự lấy theo tên)", type: "heading" },
    { name: "slug", label: "Slug (đường dẫn)", full: true, placeholder: "tu-dong-tao-tu-ten" },
    { name: "metaTitle", label: "Meta title", full: true },
    { name: "metaDescription", label: "Meta description", type: "textarea" },
  ];
}
