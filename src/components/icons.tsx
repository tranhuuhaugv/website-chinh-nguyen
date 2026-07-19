import type { SVGProps } from "react";
import type { CategoryIconName } from "@/lib/types";

// Bộ icon inline (SVG) tái sử dụng, path lấy từ design/trang-chu-demo.html.
// Dùng SVG thay cho icon-font/ảnh để nhẹ và không phát sinh request.

type IconProps = SVGProps<SVGSVGElement>;

/** Icon nét (stroke = currentColor). */
function Stroke({ children, strokeWidth = 2, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Icon đặc (fill = currentColor). */
function Fill({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Stroke strokeWidth={2.2} {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Stroke>
);

export const UserIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Stroke>
);

export const UsersIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Stroke>
);

export const TrendUpIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3 3v18h18" />
    <path d="m7 14 4-4 3 3 5-6" />
    <path d="M15 7h5v5" />
  </Stroke>
);

export const CartIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </Stroke>
);

export const BoltIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
  </Fill>
);

export const StarIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
  </Fill>
);

export const HeartIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </Stroke>
);

export const CpuIcon = (p: IconProps) => (
  <Stroke strokeWidth={1.6} {...p}>
    <rect x="6" y="6" width="12" height="12" rx="1" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </Stroke>
);

export const RamIcon = (p: IconProps) => (
  <Stroke strokeWidth={1.6} {...p}>
    <rect x="2" y="7" width="20" height="10" rx="1" />
    <path d="M6 17v2M10 17v2M14 17v2M18 17v2" />
  </Stroke>
);

export const StorageIcon = (p: IconProps) => (
  <Stroke strokeWidth={1.6} {...p}>
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
  </Stroke>
);

export const InstallmentIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </Stroke>
);

export const GiftIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="8" width="18" height="4" />
    <path d="M12 8v13M5 12v9h14v-9" />
  </Stroke>
);

export const CompareIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </Stroke>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Stroke>
);

export const PhoneIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Stroke>
);

export const MessengerIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.88 1.42 5.45 3.65 7.15V22l3.34-1.83c.96.27 1.98.41 3.01.41 5.5 0 10-4.14 10-9.25S17.5 2 12 2z" />
  </Fill>
);

export const CheckIcon = (p: IconProps) => (
  <Stroke strokeWidth={3} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Stroke>
);

export const MenuIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3 12h18M3 6h18M3 18h18" />
  </Stroke>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Stroke strokeWidth={2.4} {...p}>
    <path d="m6 9 6 6 6-6" />
  </Stroke>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Stroke strokeWidth={2.4} {...p}>
    <path d="m15 18-6-6 6-6" />
  </Stroke>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Stroke strokeWidth={2.4} {...p}>
    <path d="m9 18 6-6-6-6" />
  </Stroke>
);

export const CloseIcon = (p: IconProps) => (
  <Stroke strokeWidth={2.2} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Stroke>
);

export const SettingsIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Stroke>
);

export const LayoutIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </Stroke>
);

export const GridIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </Stroke>
);

export const BoxIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </Stroke>
);

export const TagIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M20 10.5 13.5 4H4v9.5L10.5 20z" />
    <circle cx="7.5" cy="7.5" r="1" />
  </Stroke>
);

export const FileTextIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h8" />
  </Stroke>
);

export const EditIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </Stroke>
);

export const TrashIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Stroke>
);

export const MinusIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M5 12h14" />
  </Stroke>
);

export const PlusIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 5v14M5 12h14" />
  </Stroke>
);

export const ClockIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Stroke>
);

export const MapPinIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </Stroke>
);

export const MailIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 6 10 7 10-7" />
  </Stroke>
);

export const LockIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Stroke>
);

export const EyeIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Stroke>
);

export const EyeOffIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M9.9 4.24A9 9 0 0 1 12 5c6 0 10 7 10 7a13 13 0 0 1-1.7 2.4M6.6 6.6A13 13 0 0 0 2 12s4 7 10 7a9 9 0 0 0 3.4-.66" />
    <path d="m2 2 20 20" />
  </Stroke>
);

// Logo Google (đa màu — không dùng currentColor).
export const GoogleIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      fill="#4285F4"
      d="M22.5 12.2c0-.7-.06-1.4-.18-2.05H12v3.88h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.54c2.07-1.9 3.25-4.71 3.25-7.89z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.95 0 5.43-.98 7.24-2.66l-3.54-2.75c-.98.66-2.24 1.05-3.7 1.05-2.84 0-5.25-1.92-6.11-4.5H2.23v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.89 14.14a6.6 6.6 0 0 1 0-4.28V7.02H2.23a11 11 0 0 0 0 9.96l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.22c1.6 0 3.04.55 4.17 1.63l3.13-3.13A11 11 0 0 0 12 1 11 11 0 0 0 2.23 7.02l3.66 2.84C6.75 7.14 9.16 5.22 12 5.22z"
    />
  </svg>
);

export const UploadIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </Stroke>
);

export const ImageIcon = (p: IconProps) => (
  <Stroke strokeWidth={1.6} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-4.5-4.5L5 21" />
  </Stroke>
);

export const ShieldIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Stroke>
);

export const TruckIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="1" y="3" width="15" height="13" />
    <path d="M16 8h4l3 3v5h-7M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
  </Stroke>
);

export const WarrantyIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M14 9V5a3 3 0 0 0-6 0v4M5 9h14l1 12H4L5 9z" />
  </Stroke>
);

// --- Icon danh mục: hình tượng trực quan (laptop %, gamepad, phích sạc...) ---
// Hãng dùng chữ wordmark (DELL, hp, acer...) cho dễ nhận diện tức thì.

/** Chữ trong icon (wordmark hãng, chip AI): đặc, không viền. */
function IconText({
  children,
  size,
  y,
  ...rest
}: {
  children: string;
  size: number;
  y: number;
  letterSpacing?: string;
  fontStyle?: string;
}) {
  return (
    <text
      x="12"
      y={y}
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight={800}
      fontSize={size}
      fill="currentColor"
      stroke="none"
      {...rest}
    >
      {children}
    </text>
  );
}

const CATEGORY_PATHS: Record<CategoryIconName, JSX.Element> = {
  // Laptop cũ: laptop + dấu % (giá tốt)
  used: (
    <>
      <rect x="3.5" y="4" width="17" height="11.5" rx="1.5" />
      <path d="M2 19.5h20" />
      <path d="M9.3 12.6l5.4-5.2" />
      <circle cx="9.6" cy="8.3" r="1.05" />
      <circle cx="14.4" cy="11.7" r="1.05" />
    </>
  ),
  // Laptop văn phòng: laptop + dòng văn bản
  office: (
    <>
      <rect x="3.5" y="4" width="17" height="11.5" rx="1.5" />
      <path d="M2 19.5h20" />
      <path d="M7 8h10M7 11.5h6" />
    </>
  ),
  // Gaming: tay cầm chơi game
  gaming: (
    <>
      <path d="M7.5 7.5h9a5.3 5.3 0 0 1 5.2 6.1c-.4 2.6-1.5 4.9-3.1 4.9-1.3 0-2.1-.9-2.9-2.2H8.3c-.8 1.3-1.6 2.2-2.9 2.2-1.6 0-2.7-2.3-3.1-4.9A5.3 5.3 0 0 1 7.5 7.5z" />
      <path d="M7.2 12.7h3.6M9 10.9v3.6" />
      <circle cx="15.6" cy="11.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.8" cy="13.4" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // Máy trạm - đồ họa: màn hình + ảnh
  graphic: (
    <>
      <rect x="3" y="3.5" width="18" height="13" rx="1.5" />
      <path d="M8.5 20.5h7M12 16.5v4" />
      <path d="M6.5 13.2l3.3-3.9 2.4 2.8 1.9-2 3.4 3.1" />
    </>
  ),
  // Mỏng nhẹ: lông vũ
  slim: (
    <>
      <path d="M20.5 3.5C13.5 4 8 8.5 6 14.5L4 20.5" />
      <path d="M20.5 3.5c1 6.5-2.5 12.5-9.5 13.5" />
      <path d="M8.2 12.5h5M6.5 16.5h4.5" />
    </>
  ),
  // Sinh viên: nón tốt nghiệp
  student: (
    <>
      <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5z" />
      <path d="M6.5 11.6v4c3.2 2.7 7.8 2.7 11 0v-4" />
      <path d="M21.5 10v4.5" />
    </>
  ),
  // MacBook: logo Apple
  macbook: (
    <>
      <path
        fill="currentColor"
        stroke="none"
        d="M15.9 12.4c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.7-.8-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1-.1-2.2-.9-2.2-3.1z"
      />
      <path
        fill="currentColor"
        stroke="none"
        d="M14 6c.6-.7 1-1.7.8-2.7-.8.1-1.8.6-2.4 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z"
      />
    </>
  ),
  // Laptop AI: chip AI
  ai: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 2.5V5M15 2.5V5M9 19v2.5M15 19v2.5M2.5 9H5M2.5 15H5M19 9h2.5M19 15h2.5" />
      <IconText size={7.2} y={14.6}>
        AI
      </IconText>
    </>
  ),
  // Màn hình
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12.5" rx="1.5" />
      <path d="M8.5 21h7M12 16.5V21" />
    </>
  ),
  // Sạc & phụ kiện: phích cắm
  accessory: (
    <>
      <path d="M9 2.5v4.5M15 2.5v4.5" />
      <path d="M6.5 7h11v3.8a5.5 5.5 0 0 1-11 0z" />
      <path d="M12 16.3v1.7a3 3 0 0 0 3 3h2" />
    </>
  ),
  // PC đồng bộ: thùng máy + màn hình
  pc: (
    <>
      <rect x="3.5" y="3.5" width="8" height="17" rx="1" />
      <path d="M6.2 7h2.6M6.2 10h2.6" />
      <circle cx="7.5" cy="17" r="1" fill="currentColor" stroke="none" />
      <rect x="14.5" y="6.5" width="7" height="5.5" rx="1" />
      <path d="M16.5 15.5h3M18 12v3.5" />
    </>
  ),
  // Laptop mới: laptop + tia lấp lánh
  new: (
    <>
      <rect x="3" y="5.5" width="14.5" height="9.5" rx="1.5" />
      <path d="M1.5 19h17.5" />
      <path
        fill="currentColor"
        stroke="none"
        d="M19.6 2.6l1 2.3 2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1z"
      />
    </>
  ),
  // Thương hiệu: wordmark chữ
  dell: (
    <IconText size={7.4} y={14.6} letterSpacing="0.4">
      DELL
    </IconText>
  ),
  asus: (
    <IconText size={7} y={14.5} letterSpacing="0.3" fontStyle="italic">
      ASUS
    </IconText>
  ),
  acer: (
    <IconText size={8.8} y={15}>
      acer
    </IconText>
  ),
  lenovo: (
    <IconText size={6.2} y={14.3}>
      lenovo
    </IconText>
  ),
  hp: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <IconText size={8.6} y={15}>
        hp
      </IconText>
    </>
  ),
  msi: (
    <IconText size={8.2} y={15} letterSpacing="0.5">
      MSI
    </IconText>
  ),
};

export function CategoryIcon({
  name,
  ...props
}: IconProps & { name: CategoryIconName }) {
  return (
    <Stroke strokeWidth={1.5} {...props}>
      {CATEGORY_PATHS[name]}
    </Stroke>
  );
}
