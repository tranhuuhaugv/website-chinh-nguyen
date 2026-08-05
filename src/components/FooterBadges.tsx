import type { ReactNode } from "react";

// Badge phương thức thanh toán + chứng nhận cho footer.
// Dựng bằng SVG/CSS (không dùng ảnh ngoài) để nhẹ và không phát sinh request.

function Tile({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 min-w-[46px] items-center justify-center rounded-md bg-white px-2 shadow-sm">
      {children}
    </span>
  );
}

const PAYMENTS: ReactNode[] = [
  <span key="visa" className="text-[13px] font-black italic tracking-tight text-[#1A1F71]">
    VISA
  </span>,
  <svg key="mc" viewBox="0 0 40 24" className="h-4 w-auto" aria-label="Mastercard">
    <circle cx="16" cy="12" r="9" fill="#EB001B" />
    <circle cx="25" cy="12" r="9" fill="#F79E1B" fillOpacity="0.85" />
  </svg>,
  <span key="jcb" className="text-[12px] font-black">
    <span className="text-[#0B4EA2]">J</span>
    <span className="text-[#D8232A]">C</span>
    <span className="text-[#00A650]">B</span>
  </span>,
  <span key="vnpay" className="text-[12px] font-black text-[#005BAA]">
    VN<span className="text-[#E30613]">PAY</span>
  </span>,
  <span key="momo" className="text-[13px] font-black text-[#A50064]">
    momo
  </span>,
  <span key="zalopay" className="text-[12px] font-black text-[#0068FF]">
    Zalo<span className="text-[#00A650]">Pay</span>
  </span>,
  <span key="napas" className="text-[12px] font-black text-[#005BAA]">
    napas
  </span>,
];

export function FooterBadges() {
  return (
    <div className="border-b border-[#2A332D] py-7">
      <h4 className="mb-3 text-[13.5px] font-semibold text-white">
        Phương thức thanh toán
      </h4>
      <div className="flex flex-wrap gap-2">
        {PAYMENTS.map((node, i) => (
          <Tile key={i}>{node}</Tile>
        ))}
      </div>
    </div>
  );
}
