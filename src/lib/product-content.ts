import type { Product } from "./types";

// Sinh thông số kỹ thuật + mô tả cho trang chi tiết.
// NGUYÊN TẮC: CHỈ dùng dữ liệu THẬT của sản phẩm (nhập từ admin/import).
// Thiếu trường nào thì bỏ qua dòng đó — KHÔNG bịa thông số (shop bán máy cũ,
// mỗi máy mỗi khác, thông số sai sẽ gây hiểu nhầm cho khách).

type Row = [string, string];

/** Chỉ giữ dòng có giá trị thật. */
function row(label: string, value?: string): Row | null {
  const v = (value ?? "").trim();
  return v ? [label, v] : null;
}
function rows(list: (Row | null)[]): Row[] {
  return list.filter((r): r is Row => r !== null);
}

export interface SpecGroup {
  group: string;
  rows: Row[];
}

export function buildSpecGroups(product: Product): SpecGroup[] {
  const groups: SpecGroup[] = [
    {
      group: "Bộ xử lý & Bộ nhớ",
      rows: rows([
        row("CPU", product.cpu),
        row("RAM", product.ram),
        row("Ổ cứng", product.storage),
      ]),
    },
    {
      group: "Màn hình & Đồ họa",
      rows: rows([
        row("Card VGA", product.gpu),
        row("MUX Switch", product.mux),
        row("Màn hình", product.screen),
        row("Webcam", product.webcam),
      ]),
    },
    {
      group: "Khác",
      rows: rows([
        row("Hệ điều hành", product.os),
        row("Màu sắc", product.color),
        row("Pin", product.battery),
        row("Trọng lượng", product.weight),
        row("Cổng kết nối", product.ports),
      ]),
    },
  ];
  // Bỏ nhóm rỗng.
  return groups.filter((g) => g.rows.length > 0);
}

export interface DescSection {
  heading: string;
  paragraphs: string[];
}

export function buildDescription(product: Product): DescSection[] {
  const used = (product.condition ?? "used") === "used";
  const cauHinh = [
    product.cpu,
    product.ram && `RAM ${product.ram}`,
    product.storage && `ổ cứng ${product.storage}`,
    product.gpu && `card ${product.gpu}`,
    product.screen && `màn hình ${product.screen}`,
  ]
    .filter(Boolean)
    .join(", ");

  const sections: DescSection[] = [
    {
      heading: `Tổng quan ${product.name}`,
      paragraphs: [
        `${product.name} có cấu hình: ${cauHinh}. Máy phù hợp cho nhu cầu học tập, làm việc và giải trí hằng ngày, hiện đang có sẵn tại Laptop Chính Nguyễn (Đà Nẵng).`,
        used
          ? "Đây là máy đã qua sử dụng, được kỹ thuật viên kiểm tra và test đầy đủ chức năng (màn hình, bàn phím, pin, cổng kết nối) trước khi bàn giao. Quý khách được kiểm tra máy trực tiếp khi nhận."
          : "Máy mới, nguyên seal, đầy đủ hộp và phụ kiện từ nhà sản xuất, có hóa đơn VAT.",
      ],
    },
    {
      heading: "Hiệu năng",
      paragraphs: [
        [
          `Vi xử lý ${product.cpu}`,
          product.ram && ` kết hợp ${product.ram} RAM`,
          product.storage && ` và ổ cứng ${product.storage}`,
        ]
          .filter(Boolean)
          .join("") +
          " đáp ứng tốt các tác vụ thường ngày: duyệt web nhiều tab, ứng dụng văn phòng, họp trực tuyến và xem phim.",
        product.gpu
          ? `Máy có card đồ họa ${product.gpu}, hỗ trợ tốt hơn cho game và các phần mềm dựng hình, chỉnh sửa ảnh/video.`
          : "Máy dùng đồ họa tích hợp, phù hợp nhu cầu văn phòng và giải trí cơ bản.",
      ],
    },
  ];

  if (product.screen || product.resolution) {
    sections.push({
      heading: "Màn hình",
      paragraphs: [
        [
          product.screen && `Màn hình ${product.screen}`,
          product.resolution && ` độ phân giải ${product.resolution}`,
          product.refresh && `, tần số quét ${product.refresh}`,
        ]
          .filter(Boolean)
          .join("") + " cho không gian hiển thị thoải mái khi làm việc và giải trí.",
      ],
    });
  }

  sections.push({
    heading: `Mua ${product.name} ở đâu?`,
    paragraphs: [
      used
        ? `${product.name} đang có sẵn tại Laptop Chính Nguyễn — máy đã kiểm tra kỹ, bảo hành tại shop, hỗ trợ kỹ thuật tận nơi, cho dùng thử 15 ngày và 1 đổi 1 trong 30 ngày nếu phát sinh lỗi kỹ thuật. Quý khách vui lòng liên hệ để được tư vấn tình trạng máy cụ thể.`
        : `${product.name} đang có sẵn tại Laptop Chính Nguyễn với giá tốt, bảo hành chính hãng, giao nhanh toàn quốc và hỗ trợ kiểm tra máy khi nhận.`,
    ],
  });

  return sections;
}
