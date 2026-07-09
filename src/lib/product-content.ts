import type { Product } from "./types";

// Sinh nội dung mô tả dài + thông số kỹ thuật theo nhóm cho trang chi tiết.
// Đây là nội dung mẫu suy ra từ thuộc tính sản phẩm (demo). Khi có DB, thay bằng
// mô tả/thông số thật nhập từ admin cho từng sản phẩm.

const GPU_RE = /RTX|GTX|Radeon/i;

function isMac(product: Product) {
  return product.brand === "MacBook";
}

function screenSize(name: string): string {
  const m = name.match(/(\d{2}(?:\.\d)?)\s*(?:inch|")/i);
  if (m) return `${m[1]} inch`;
  if (/\b13\b/.test(name)) return "13.3 inch";
  if (/\b14\b/.test(name)) return "14 inch";
  if (/\b16\b/.test(name)) return "16 inch";
  return "15.6 inch";
}

function gpuName(product: Product): string {
  return GPU_RE.test(product.storage) ? product.storage : "Đồ họa tích hợp";
}

function storageText(product: Product): string {
  return GPU_RE.test(product.storage)
    ? "512GB SSD NVMe"
    : `${product.storage} SSD NVMe`;
}

export interface SpecGroup {
  group: string;
  rows: [string, string][];
}

export function buildSpecGroups(product: Product): SpecGroup[] {
  const mac = isMac(product);
  return [
    {
      group: "Bộ xử lý",
      rows: [
        ["CPU", product.cpu],
        ["Số nhân / luồng", mac ? "8 nhân" : "10 nhân / 12 luồng"],
        ["Tốc độ tối đa", mac ? "Tối ưu theo Apple Silicon" : "Lên đến 4.7 GHz"],
      ],
    },
    {
      group: "Bộ nhớ & Lưu trữ",
      rows: [
        ["RAM", product.ram],
        ["Loại bộ nhớ", mac ? "Bộ nhớ hợp nhất" : "DDR5"],
        ["Ổ cứng", storageText(product)],
        ["Khả năng nâng cấp", mac ? "Không hỗ trợ" : "Còn khe nâng cấp"],
      ],
    },
    {
      group: "Màn hình & Đồ họa",
      rows: [
        ["Kích thước", screenSize(product.name)],
        ["Độ phân giải", mac ? "Liquid Retina" : "Full HD (1920 × 1080)"],
        ["Tấm nền", mac ? "IPS Retina" : "IPS chống chói"],
        ["Card đồ họa", gpuName(product)],
      ],
    },
    {
      group: "Kết nối & Cổng",
      rows: [
        [
          "Cổng kết nối",
          mac
            ? "USB-C / Thunderbolt, jack 3.5mm"
            : "USB-C, USB-A, HDMI, jack 3.5mm",
        ],
        ["Wi-Fi", "Wi-Fi 6"],
        ["Bluetooth", "Bluetooth 5.x"],
        ["Webcam", "HD 720p"],
      ],
    },
    {
      group: "Pin, Trọng lượng & Khác",
      rows: [
        ["Hệ điều hành", mac ? "macOS" : "Windows 11 bản quyền"],
        ["Bàn phím", "Có đèn nền"],
        ["Trọng lượng", GPU_RE.test(product.storage) ? "≈ 2.2 kg" : "≈ 1.5 kg"],
        ["Bảo hành", "24 tháng chính hãng"],
      ],
    },
  ];
}

export interface DescSection {
  heading: string;
  paragraphs: string[];
}

export function buildDescription(product: Product): DescSection[] {
  const mac = isMac(product);
  const hasGpu = GPU_RE.test(product.storage);
  const gpu = gpuName(product);

  return [
    {
      heading: `Tổng quan ${product.name}`,
      paragraphs: [
        `${product.name} là mẫu laptop ${product.brand} được nhiều người dùng lựa chọn nhờ cấu hình cân đối và mức giá hợp lý. Máy trang bị vi xử lý ${product.cpu}, RAM ${product.ram} cùng ổ cứng ${product.storage}, đáp ứng tốt nhu cầu học tập, làm việc văn phòng và giải trí hằng ngày.`,
        `Với thiết kế gọn gàng, thời lượng pin ổn định và ${
          hasGpu
            ? `card đồ họa rời ${product.storage} mạnh mẽ`
            : "đồ họa tích hợp đủ dùng"
        }, đây là lựa chọn đáng cân nhắc trong tầm giá.`,
      ],
    },
    {
      heading: "Hiệu năng ổn định cho mọi tác vụ",
      paragraphs: [
        `Vi xử lý ${product.cpu} kết hợp cùng ${product.ram} RAM mang lại khả năng đa nhiệm mượt mà: mở nhiều tab trình duyệt, chạy ứng dụng văn phòng, họp trực tuyến hay xử lý tài liệu nặng đều trơn tru.`,
        mac
          ? "Nền tảng Apple Silicon giúp máy vận hành mát mẻ, êm ái và tiết kiệm điện năng đáng kể, cho thời lượng sử dụng dài."
          : "Ổ SSD NVMe tốc độ cao giúp khởi động máy và mở ứng dụng gần như tức thì, rút ngắn thời gian chờ đợi.",
      ],
    },
    {
      heading: "Thiết kế & màn hình",
      paragraphs: [
        `Màn hình ${screenSize(
          product.name,
        )} cho không gian hiển thị thoải mái, màu sắc trung thực, phù hợp cho cả công việc lẫn giải trí. Tổng thể máy được hoàn thiện chắc chắn, gọn nhẹ và dễ mang theo mỗi ngày.`,
      ],
    },
    {
      heading: "Đồ họa & giải trí",
      paragraphs: [
        hasGpu
          ? `Được trang bị ${gpu}, ${product.name} có thể chiến tốt nhiều tựa game phổ biến cũng như các phần mềm dựng hình, chỉnh sửa video ở mức trung – cao.`
          : `${product.name} sử dụng ${gpu}, đủ sức đáp ứng nhu cầu giải trí nhẹ nhàng, xem phim và các tác vụ đồ họa cơ bản.`,
      ],
    },
    {
      heading: `Có nên mua ${product.name}?`,
      paragraphs: [
        `Nếu bạn đang tìm một chiếc laptop ${product.brand} bền bỉ, cấu hình đủ dùng và chế độ hậu mãi tốt, ${product.name} là lựa chọn rất đáng cân nhắc. Sản phẩm được bán chính hãng tại Laptop Chính Nguyễn với giá tốt, bảo hành 24 tháng, hỗ trợ trả góp 0% và giao hàng nhanh toàn quốc.`,
      ],
    },
  ];
}
