import type { AdminField } from "./AdminForm";
import { PC_PART_TYPES } from "@/lib/pc-parts";

// Bộ field dùng chung cho form THÊM và SỬA linh kiện Build PC.
export const pcPartFields: AdminField[] = [
  {
    name: "type",
    label: "Loại linh kiện *",
    type: "select",
    options: PC_PART_TYPES.map((t) => ({ value: t.key, label: t.label })),
  },
  {
    name: "name",
    label: "Tên linh kiện *",
    full: true,
    placeholder: "VD: Intel Core i5-12400F",
  },
  { name: "brand", label: "Hãng", placeholder: "Intel / ASUS / Corsair..." },
  { name: "price", label: "Giá (VNĐ) *", type: "money", placeholder: "2.990.000" },
  {
    name: "note",
    label: "Mô tả ngắn (hiện dưới tên)",
    full: true,
    placeholder: "VD: 6 nhân 12 luồng, 4.4GHz",
  },
  { name: "image", label: "Ảnh linh kiện", type: "image" },
  {
    name: "active",
    label: "Hiển thị trên trang Build PC",
    type: "select",
    options: [
      { value: "co", label: "Có (đang bán)" },
      { value: "khong", label: "Không (ẩn)" },
    ],
  },
  { name: "sort", label: "Thứ tự (số nhỏ lên trước)", type: "number" },
];
