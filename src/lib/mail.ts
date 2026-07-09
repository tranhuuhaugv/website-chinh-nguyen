import nodemailer from "nodemailer";
import type { OrderInput } from "./validations/order";
import { formatPrice } from "./format";

// Gửi email thông báo đơn hàng về Gmail. Chạy phía server (API route).
// Cần đặt biến môi trường (server, KHÔNG có NEXT_PUBLIC):
//   GMAIL_USER           = địa chỉ Gmail dùng để gửi
//   GMAIL_APP_PASSWORD   = App Password của Gmail (bật 2FA rồi tạo)
//   MAIL_TO              = nơi nhận thông báo (mặc định = GMAIL_USER)
// Chưa đặt -> không gửi (chế độ demo), trả về false.

const { GMAIL_USER, GMAIL_APP_PASSWORD, MAIL_TO } = process.env;

export const mailReady = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 12px;color:#5A6560">${label}</td><td style="padding:6px 12px;font-weight:600;color:#17201A">${value}</td></tr>`;
}

function buildEmail(order: OrderInput): { subject: string; html: string } {
  if (order.type === "tradein") {
    const subject = `[Thu cũ đổi mới] ${order.name} - ${order.model}`;
    const html = `
      <h2 style="color:#0F7C39">Yêu cầu thu cũ đổi mới</h2>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
        ${row("Họ và tên", order.name)}
        ${row("Số điện thoại", order.phone)}
        ${row("Email", order.email)}
        ${row("Địa chỉ", order.address)}
        ${row("Mẫu máy cần thu", order.model)}
        ${order.upgradeTo ? row("Muốn lên đời", order.upgradeTo) : ""}
        ${order.note ? row("Mô tả tình trạng", order.note) : ""}
      </table>`;
    return { subject, html };
  }

  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 12px">${i.name} × ${i.qty}</td><td style="padding:4px 12px;text-align:right">${formatPrice(i.price * i.qty)}</td></tr>`,
    )
    .join("");
  const subject = `[Đơn hàng mới] ${order.name} - ${formatPrice(order.total)}`;
  const html = `
    <h2 style="color:#0F7C39">Đơn hàng mới (COD)</h2>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${row("Họ và tên", order.name)}
      ${row("Số điện thoại", order.phone)}
      ${row("Địa chỉ", order.address)}
      ${order.note ? row("Ghi chú", order.note) : ""}
    </table>
    <h3 style="color:#17201A">Sản phẩm</h3>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;width:100%;max-width:480px">
      ${itemsHtml}
      <tr><td style="padding:8px 12px;font-weight:700;border-top:1px solid #E4E8E3">Tổng cộng</td>
      <td style="padding:8px 12px;font-weight:700;text-align:right;color:#E23A34;border-top:1px solid #E4E8E3">${formatPrice(order.total)}</td></tr>
    </table>`;
  return { subject, html };
}

export async function sendOrderEmail(order: OrderInput): Promise<boolean> {
  if (!mailReady) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  const { subject, html } = buildEmail(order);
  await transporter.sendMail({
    from: `"Laptop Chính Nguyễn" <${GMAIL_USER}>`,
    to: MAIL_TO || GMAIL_USER,
    subject,
    html,
  });
  return true;
}
