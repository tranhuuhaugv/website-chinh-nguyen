// Helper phân nhóm danh mục — THUẦN (không import prisma) để dùng được cả ở
// client (trang admin danh mục) lẫn server.

// Slug hãng / nhu cầu mặc định (nhận diện khi dữ liệu cũ chưa gán group).
export const NAV_BRAND_SLUGS = new Set([
  "dell",
  "hp",
  "lenovo",
  "asus",
  "acer",
  "msi",
  "macbook",
]);
export const NAV_NEED_SLUGS = new Set([
  "laptop-gaming",
  "laptop-do-hoa",
  "laptop-van-phong",
]);

/**
 * Chuẩn hoá group: dữ liệu cũ lưu nhãn tiếng Việt ("Theo nhu cầu"), mới lưu slug
 * ("nhu-cau"). Quy về 1 mối để không bị tách nhóm trùng.
 */
export function normGroup(g?: string | null): string {
  const map: Record<string, string> = {
    "Theo thương hiệu": "thuong-hieu",
    "Theo nhu cầu": "nhu-cau",
    "Loại máy": "loai-may",
    Khác: "khac",
    "Dòng máy": "dong-may",
  };
  return g ? (map[g] ?? g) : "";
}

/** Danh mục nhóm "nhu cầu" (dùng chung: menu + bộ lọc + ô tick form). */
export function isNeedCategory(c: { group?: string | null; slug: string }): boolean {
  const g = normGroup(c.group);
  return g === "nhu-cau" || (!g && NAV_NEED_SLUGS.has(c.slug));
}
