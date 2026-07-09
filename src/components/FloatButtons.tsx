import { MessengerIcon, PhoneIcon } from "./icons";

// Nút liên hệ nổi (góc phải dưới). Server Component — chỉ là link ngoài.
// Dùng thẻ <a> vì đây là liên kết ngoài (tel:, m.me, zalo.me).

export function FloatButtons() {
  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col gap-2.5">
      <a
        href="tel:19006789"
        aria-label="Gọi điện thoại"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-green text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.08]"
      >
        <PhoneIcon className="h-[26px] w-[26px]" />
      </a>
      <a
        href="https://m.me/laptopchinhnguyen"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Messenger"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#0084FF] text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.08]"
      >
        <MessengerIcon className="h-[26px] w-[26px]" />
      </a>
      <a
        href="https://zalo.me/19006789"
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
