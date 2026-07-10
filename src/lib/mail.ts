import nodemailer from "nodemailer";
import type { OrderInput } from "./validations/order";
import { formatPrice } from "./format";
import { SITE } from "./site";

// Gửi email thông báo đơn hàng về Gmail. Chạy phía server (API route).
// Cần đặt biến môi trường (server, KHÔNG có NEXT_PUBLIC):
//   GMAIL_USER           = địa chỉ Gmail dùng để gửi
//   GMAIL_APP_PASSWORD   = App Password của Gmail (bật 2FA rồi tạo)
//   MAIL_TO              = nơi nhận thông báo (mặc định = GMAIL_USER)
// Chưa đặt -> không gửi (chế độ demo), trả về false.

const { GMAIL_USER, GMAIL_APP_PASSWORD, MAIL_TO } = process.env;

export const mailReady = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

// Bảng màu (khớp giao diện site).
const C = {
  green: "#0F7C39",
  greenD: "#0A5C2A",
  ink: "#17201A",
  ink2: "#3E4A42",
  muted: "#7A857E",
  sale: "#E23A34",
  line: "#E4E8E3",
  bg: "#F2F5F2",
  soft: "#EAF5EE",
};

// Chèn transform Cloudinary để lấy thumbnail nhẹ (ô ~120px). URL không phải
// Cloudinary thì giữ nguyên.
function thumb(url: string | undefined, size = 120): string {
  if (!url) return "";
  const marker = "/upload/";
  const at = url.indexOf(marker);
  if (at === -1) return url;
  const t = `w_${size},h_${size},c_pad,b_white,q_auto,f_auto`;
  return url.slice(0, at + marker.length) + t + "/" + url.slice(at + marker.length);
}

// 1 dòng thông tin (nhãn trái / giá trị phải).
function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:9px 0;color:${C.muted};font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:9px 0 9px 16px;color:${C.ink};font-size:14px;font-weight:600;text-align:right">${value}</td>
    </tr>`;
}

// Khung ngoài + header + footer dùng chung cho mọi email.
function shell(headTitle: string, headSub: string, inner: string): string {
  return `
  <div style="margin:0;padding:24px 12px;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
      <tr><td style="background:#ffffff;border:1px solid ${C.line};border-radius:16px;overflow:hidden">

        <!-- Header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:linear-gradient(135deg,${C.greenD},${C.green});padding:22px 28px">
            <div style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:.2px">${SITE.name}</div>
            <div style="color:#D8F0E1;font-size:13px;margin-top:2px">${headSub}</div>
          </td></tr>
        </table>

        <!-- Tiêu đề -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:24px 28px 4px">
            <div style="font-size:16px;font-weight:800;color:${C.ink}">${headTitle}</div>
          </td></tr>
        </table>

        ${inner}

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 28px 26px;border-top:1px solid ${C.line}">
            <div style="font-size:12.5px;color:${C.muted};line-height:1.7">
              <b style="color:${C.ink2}">${SITE.name}</b><br/>
              Hotline: ${SITE.hotline} · ${SITE.email}<br/>
              ${SITE.hours}
            </div>
          </td></tr>
        </table>

      </td></tr>
    </table>
    <div style="text-align:center;color:${C.muted};font-size:11.5px;margin-top:14px">
      Email tự động từ website ${SITE.name}
    </div>
  </div>`;
}

// Khối card bo góc bên trong (tiêu đề mục + nội dung).
function card(title: string, body: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:12px 28px 0">
      <div style="border:1px solid ${C.line};border-radius:12px;overflow:hidden">
        <div style="background:${C.soft};padding:10px 16px;font-size:12.5px;font-weight:700;color:${C.greenD};text-transform:uppercase;letter-spacing:.4px">${title}</div>
        <div style="padding:6px 16px 14px">${body}</div>
      </div>
    </td></tr>
  </table>`;
}

// 1 sản phẩm: thumbnail + tên + (số lượng × đơn giá) + thành tiền.
function itemRow(i: {
  name: string;
  price: number;
  qty: number;
  image?: string;
}): string {
  const src = thumb(i.image);
  const pic = src
    ? `<img src="${src}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;border-radius:10px;border:1px solid ${C.line};object-fit:cover;background:#fff" />`
    : `<div style="width:56px;height:56px;border-radius:10px;border:1px solid ${C.line};background:${C.bg}"></div>`;
  return `
    <tr>
      <td style="padding:10px 0;width:56px;vertical-align:top">${pic}</td>
      <td style="padding:10px 0 10px 12px;vertical-align:top">
        <div style="font-size:14px;font-weight:600;color:${C.ink};line-height:1.4">${i.name}</div>
        <div style="font-size:12.5px;color:${C.muted};margin-top:3px">${i.qty} × ${formatPrice(i.price)}</div>
      </td>
      <td style="padding:10px 0;vertical-align:top;text-align:right;white-space:nowrap;font-size:14px;font-weight:700;color:${C.ink}">${formatPrice(i.price * i.qty)}</td>
    </tr>`;
}

function buildEmail(order: OrderInput): { subject: string; html: string } {
  if (order.type === "tradein") {
    const subject = `[Thu cũ đổi mới] ${order.name} - ${order.model}`;
    const info = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row("Họ và tên", order.name)}
        ${row("Số điện thoại", order.phone)}
        ${row("Email", order.email)}
        ${row("Địa chỉ", order.address)}
      </table>`;
    const trade = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row("Mẫu máy cần thu", order.model)}
        ${order.upgradeTo ? row("Muốn lên đời", order.upgradeTo) : ""}
        ${order.note ? row("Mô tả tình trạng", order.note) : ""}
      </table>`;
    const html = shell(
      "Yêu cầu thu cũ đổi mới",
      "Có khách gửi yêu cầu thu cũ đổi mới",
      card("Thông tin khách hàng", info) + card("Máy cần thu", trade),
    );
    return { subject, html };
  }

  const itemsHtml = order.items.map(itemRow).join("");
  const subject = `[Đơn hàng mới] ${order.name} - ${formatPrice(order.total)}`;

  const info = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Họ và tên", order.name)}
      ${row("Số điện thoại", order.phone)}
      ${row("Địa chỉ giao", order.address)}
      ${order.note ? row("Ghi chú", order.note) : ""}
    </table>`;

  const products = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${itemsHtml}
      <tr><td colspan="3" style="border-top:1px solid ${C.line};padding-top:12px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:14px;font-weight:800;color:${C.ink}">Tổng cộng</td>
          <td style="text-align:right;font-size:18px;font-weight:800;color:${C.sale}">${formatPrice(order.total)}</td>
        </tr></table>
      </td></tr>
    </table>`;

  const html = shell(
    "Đơn hàng mới (COD)",
    "Có đơn hàng mới trên website",
    card("Thông tin giao hàng", info) + card("Sản phẩm", products),
  );
  return { subject, html };
}

async function sendMail(subject: string, html: string): Promise<boolean> {
  if (!mailReady) return false;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  await transporter.sendMail({
    from: `"${SITE.name}" <${GMAIL_USER}>`,
    to: MAIL_TO || GMAIL_USER,
    subject,
    html,
  });
  return true;
}

export async function sendOrderEmail(order: OrderInput): Promise<boolean> {
  const { subject, html } = buildEmail(order);
  return sendMail(subject, html);
}

export async function sendRegisterEmail(user: {
  name: string;
  email: string;
  phone: string;
}): Promise<boolean> {
  const subject = `[Tài khoản mới] ${user.name}`;
  const info = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Họ và tên", user.name)}
      ${row("Email", user.email)}
      ${row("Số điện thoại", user.phone)}
    </table>`;
  const html = shell(
    "Khách hàng vừa đăng ký tài khoản",
    "Có tài khoản mới trên website",
    card("Thông tin tài khoản", info),
  );
  return sendMail(subject, html);
}
