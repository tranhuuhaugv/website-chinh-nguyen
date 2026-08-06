import type { ReactNode } from "react";
import Image from "next/image";

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

// Bọc badge: có link -> thẻ <a> mở tab mới; chưa có link -> thẻ tĩnh <span>.
function BadgeWrap({
  url,
  className,
  children,
}: {
  url?: string;
  className: string;
  children: React.ReactNode;
}) {
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
}

export interface Cert {
  on: boolean;
  url: string;
  /** Ảnh logo tự upload (VD BCT gửi về). Có -> hiện ảnh thay badge mặc định. */
  image?: string;
}

export function FooterBadges({
  bct,
  dmca,
}: {
  bct: Cert;
  dmca: Cert;
}) {
  const showCert = bct.on || dmca.on;

  return (
    <div
      className={`grid grid-cols-1 gap-6 border-b border-[#2A332D] py-7 ${
        showCert ? "md:grid-cols-[1.6fr_1fr]" : ""
      }`}
    >
      <div>
        <h4 className="mb-3 text-[13.5px] font-semibold text-white">
          Phương thức thanh toán
        </h4>
        <div className="flex flex-wrap gap-2">
          {PAYMENTS.map((node, i) => (
            <Tile key={i}>{node}</Tile>
          ))}
        </div>
      </div>

      {showCert && (
        <div>
          <h4 className="mb-3 text-[13.5px] font-semibold text-white">
            Chứng nhận
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            {bct.on &&
              (bct.image ? (
                <BadgeWrap url={bct.url} className="inline-block">
                  <Image
                    src={bct.image}
                    alt="Đã thông báo Bộ Công Thương"
                    width={140}
                    height={54}
                    className="h-[54px] w-auto rounded-md"
                  />
                </BadgeWrap>
              ) : (
                <BadgeWrap
                  url={bct.url}
                  className="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C4161C] text-[8px] font-bold text-white">
                    BCT
                  </span>
                  <span className="text-[9.5px] font-semibold leading-tight text-[#333]">
                    ĐÃ THÔNG BÁO
                    <br />
                    BỘ CÔNG THƯƠNG
                  </span>
                </BadgeWrap>
              ))}
            {dmca.on && (
              <BadgeWrap
                url={dmca.url}
                className="flex items-center gap-1 rounded-md bg-white px-2.5 py-2 text-[10px] font-bold"
              >
                <span className="text-[#111]">DMCA</span>
                <span className="text-[#2e9e44]">PROTECTED</span>
              </BadgeWrap>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
