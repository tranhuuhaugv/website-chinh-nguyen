// Cấu hình các NHÓM linh kiện cho trang Build PC.
// Thứ tự ở đây = thứ tự hiển thị trên trang cấu hình.

export interface PcPart {
  id: string;
  type: string;
  name: string;
  price: number;
  brand?: string | null;
  image?: string | null;
  note?: string | null;
}

export interface PcPartTypeDef {
  key: string;
  label: string;
  /** Bắt buộc chọn để tính là 1 cấu hình hoàn chỉnh (dùng nhắc khách). */
  required: boolean;
}

export const PC_PART_TYPES: PcPartTypeDef[] = [
  { key: "cpu", label: "CPU (Bộ vi xử lý)", required: true },
  { key: "mainboard", label: "Mainboard (Bo mạch chủ)", required: true },
  { key: "ram", label: "RAM (Bộ nhớ)", required: true },
  { key: "vga", label: "VGA (Card màn hình)", required: false },
  { key: "storage", label: "Ổ cứng (SSD/HDD)", required: true },
  { key: "psu", label: "PSU (Nguồn)", required: true },
  { key: "case", label: "Case (Vỏ máy)", required: false },
  { key: "cooling", label: "Tản nhiệt", required: false },
];

export const PC_PART_TYPE_KEYS = PC_PART_TYPES.map((t) => t.key);

/** Nhãn hiển thị của 1 loại linh kiện (fallback = chính key). */
export function pcPartTypeLabel(key: string): string {
  return PC_PART_TYPES.find((t) => t.key === key)?.label ?? key;
}

/** Nhãn ngắn (không phần mô tả trong ngoặc) — dùng ở thẻ/giỏ hàng. */
export function pcPartTypeShort(key: string): string {
  return pcPartTypeLabel(key).replace(/\s*\(.*\)\s*/, "").trim();
}

export function isPcPartType(key: string): boolean {
  return PC_PART_TYPE_KEYS.includes(key);
}
