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

// ——— Các khối nội dung dùng lại cho cả email shop lẫn email khách ———

function tradeInfoCards(order: Extract<OrderInput, { type: "tradein" }>): string {
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
  return card("Thông tin khách hàng", info) + card("Máy cần thu", trade);
}

function purchaseCards(order: Extract<OrderInput, { type: "purchase" }>): string {
  const info = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Họ và tên", order.name)}
      ${row("Số điện thoại", order.phone)}
      ${row("Địa chỉ giao", order.address)}
      ${order.note ? row("Ghi chú", order.note) : ""}
    </table>`;
  const products = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${order.items.map(itemRow).join("")}
      <tr><td colspan="3" style="border-top:1px solid ${C.line};padding-top:12px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:14px;font-weight:800;color:${C.ink}">Tổng cộng</td>
          <td style="text-align:right;font-size:18px;font-weight:800;color:${C.sale}">${formatPrice(order.total)}</td>
        </tr></table>
      </td></tr>
    </table>`;
  return card("Thông tin giao hàng", info) + card("Sản phẩm", products);
}

// Khối "cam kết" trong email GỬI KHÁCH.
function commitmentsCard(type: OrderInput["type"]): string {
  const lines =
    type === "purchase"
      ? [
          "Trong vòng <b>15 phút</b>, chúng tôi sẽ liên hệ để xác nhận đơn hàng.",
          "Đơn đặt từ <b>21h30 tối đến 8h sáng</b> hôm sau sẽ được liên hệ xác nhận <b>trước 9h sáng</b> cùng ngày.",
          "Thanh toán khi nhận hàng (COD) — Quý khách được kiểm tra máy trước khi thanh toán.",
        ]
      : [
          "Trong vòng <b>15 phút</b>, kỹ thuật viên sẽ liên hệ để định giá máy cũ của Quý khách.",
          "Yêu cầu gửi từ <b>21h30 tối đến 8h sáng</b> hôm sau sẽ được liên hệ <b>trước 9h sáng</b> cùng ngày.",
          "Định giá minh bạch, trừ thẳng vào giá máy mới khi Quý khách lên đời.",
        ];
  const body = lines
    .map(
      (l) =>
        `<div style="font-size:13.5px;color:${C.ink2};line-height:1.6;padding:5px 0">• ${l}</div>`,
    )
    .join("");
  return card("Cam kết của chúng tôi", body);
}

// Email GỬI SHOP (thông báo có đơn mới).
function buildAdminEmail(order: OrderInput): { subject: string; html: string } {
  if (order.type === "tradein") {
    return {
      subject: `[Thu cũ đổi mới] ${order.name} - ${order.model}`,
      html: shell(
        "Yêu cầu thu cũ đổi mới",
        "Có khách gửi yêu cầu thu cũ đổi mới",
        tradeInfoCards(order),
      ),
    };
  }
  return {
    subject: `[Đơn hàng mới] ${order.name} - ${formatPrice(order.total)}`,
    html: shell(
      "Đơn hàng mới (COD)",
      "Có đơn hàng mới trên website",
      purchaseCards(order),
    ),
  };
}

// Email GỬI KHÁCH (xác nhận + cảm ơn).
function buildCustomerEmail(order: OrderInput): { subject: string; html: string } {
  const greeting = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:4px 28px 0;font-size:14px;color:${C.ink2};line-height:1.7">
        Chào <b style="color:${C.ink}">${order.name}</b>,<br/>
        Cảm ơn Quý khách đã ${order.type === "purchase" ? "đặt hàng" : "gửi yêu cầu thu cũ đổi mới"} tại <b style="color:${C.greenD}">${SITE.name}</b>. Chúng tôi đã ghi nhận thông tin của Quý khách.
      </td></tr>
    </table>`;

  if (order.type === "tradein") {
    return {
      subject: `Xác nhận yêu cầu thu cũ đổi mới - ${SITE.name}`,
      html: shell(
        "Đã nhận yêu cầu thu cũ đổi mới",
        "Cảm ơn Quý khách",
        greeting + tradeInfoCards(order) + commitmentsCard("tradein"),
      ),
    };
  }
  return {
    subject: `Xác nhận đơn hàng - ${SITE.name}`,
    html: shell(
      "Đặt hàng thành công!",
      "Cảm ơn Quý khách đã mua hàng",
      greeting + purchaseCards(order) + commitmentsCard("purchase"),
    ),
  };
}

async function sendMail(
  subject: string,
  html: string,
  to: string,
): Promise<boolean> {
  if (!mailReady || !to) return false;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  await transporter.sendMail({
    from: `"${SITE.name}" <${GMAIL_USER}>`,
    to,
    subject,
    html,
  });
  return true;
}

/**
 * Gửi email cho đơn: (1) thông báo về shop, (2) xác nhận cho khách (nếu có email).
 * Email khách: đơn thu cũ lấy từ form; đơn mua lấy từ `customerEmail` (ô email
 * hoặc email tài khoản). Trả về true nếu email SHOP gửi thành công.
 */
export async function sendOrderEmail(
  order: OrderInput,
  customerEmail?: string | null,
): Promise<boolean> {
  const admin = buildAdminEmail(order);
  const adminOk = await sendMail(admin.subject, admin.html, MAIL_TO || GMAIL_USER || "");

  const toCustomer =
    order.type === "tradein" ? order.email : (customerEmail ?? "").trim();
  if (toCustomer) {
    const cust = buildCustomerEmail(order);
    // Không để lỗi gửi khách làm hỏng kết quả chung.
    await sendMail(cust.subject, cust.html, toCustomer).catch((err) => {
      console.error("Gửi email xác nhận cho khách lỗi:", err);
      return false;
    });
  }

  return adminOk;
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
  return sendMail(subject, html, MAIL_TO || GMAIL_USER || "");
}
