import { MessengerIcon, PhoneIcon } from "./icons";
import { SITE } from "@/lib/site";
import { getSetting } from "@/lib/data";

// Nút liên hệ nổi (góc phải dưới). Server Component — link đọc từ Setting (admin
// đổi trong Cài đặt), chưa cấu hình thì dùng mặc định trong SITE.
// Dùng thẻ <a> vì đây là liên kết ngoài (tel:, m.me, zalo.me).

export async function FloatButtons() {
  const [phone, messenger, zalo] = await Promise.all([
    getSetting("floatPhone"),
    getSetting("floatMessenger"),
    getSetting("floatZalo"),
  ]);

  const phoneVal = (phone || SITE.hotlineTel).trim();
  // Admin nhập số điện thoại -> tự thêm "tel:"; nếu đã là link đầy đủ thì giữ nguyên.
  const phoneHref = /^(tel:|https?:)/i.test(phoneVal)
    ? phoneVal
    : `tel:${phoneVal.replace(/\s+/g, "")}`;
  const messengerHref = (messenger || SITE.messenger).trim();
  const zaloHref = (zalo || `https://zalo.me/${SITE.hotlineTel}`).trim();

  return (
    <div className="fixed right-4 bottom-[66px] z-[60] flex flex-col gap-2.5 lg:bottom-5">
      <a
        href={phoneHref}
        aria-label="Gọi điện thoại"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-green text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.08]"
      >
        <PhoneIcon className="h-[26px] w-[26px]" />
      </a>
      <a
        href={messengerHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Messenger"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#0084FF] text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.08]"
      >
        <MessengerIcon className="h-[26px] w-[26px]" />
      </a>
      <a
        href={zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#0068FF] text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.08]"
      >
        Zalo
      </a>
    </div>
  );
}
