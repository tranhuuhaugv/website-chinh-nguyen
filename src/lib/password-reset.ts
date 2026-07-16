import { createHash } from "crypto";

// Dùng chung cho 2 route: gửi link (forgot-password) và đặt lại (reset-password).

/** Link đặt lại mật khẩu sống bao lâu. */
export const RESET_EXPIRES_MINUTES = 60;

/**
 * Chỉ lưu SHA-256 của token vào DB, token thô chỉ nằm trong link gửi qua email.
 * Lộ DB thì kẻ xấu vẫn không dựng lại được link để chiếm tài khoản khách.
 * (Token là chuỗi ngẫu nhiên 32 byte nên không sợ dò ngược như mật khẩu -> SHA-256 là đủ.)
 */
export function hashResetToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
