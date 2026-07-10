// Tạo slug thân thiện URL từ chuỗi tiếng Việt (bỏ dấu, thường hoá, nối gạch).
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // bỏ dấu thanh tổ hợp
    .replace(/[đ]/g, "d") // đ -> d
    .replace(/[Đ]/g, "d") // Đ -> d
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
