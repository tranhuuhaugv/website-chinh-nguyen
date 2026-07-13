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

// --- Icon danh mục (stroke-width 1.4) ---
const CATEGORY_PATHS: Record<CategoryIconName, JSX.Element> = {
  office: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M2 20h20l-2-4H4l-2 4z" />
    </>
  ),
  gaming: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h4M8 10v4" />
    </>
  ),
  graphic: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
    </>
  ),
  slim: <path d="M4 4h16v3H4zM6 7v10M18 7v10M4 17h16" />,
  student: (
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </>
  ),
  macbook: (
    <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 2 5h10s2-2 2-5a7 7 0 0 0-7-7z" />
  ),
  ai: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </>
  ),
  used: (
    <>
      <path d="M20 6H4v10h16z" />
      <path d="M2 20h20" />
    </>
  ),
  dell: <path d="M6 3h12l4 6-10 13L2 9z" />,
  asus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </>
  ),
  acer: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M7 12h10" />
    </>
  ),
  lenovo: <rect x="4" y="4" width="16" height="16" rx="2" />,
  hp: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 8v8M15 8v8" />
    </>
  ),
  msi: (
    <>
      <path d="M3 5h18v14H3z" />
      <path d="M12 5v14" />
    </>
  ),
  monitor: (
    <>
      <rect x="4" y="4" width="16" height="12" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  accessory: (
    <>
      <path d="M4 4h16v12H4z" />
      <path d="M2 20h20M9 20v-4M15 20v-4" />
    </>
  ),
  pc: (
    <>
      <rect x="4" y="3" width="9" height="18" rx="1" />
      <path d="M16 7h5v14h-5M7 7v0M7 11v0" />
    </>
  ),
  new: (
    <>
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" />
    </>
  ),
};

export function CategoryIcon({
  name,
  ...props
}: IconProps & { name: CategoryIconName }) {
  return (
    <Stroke strokeWidth={1.4} {...props}>
      {CATEGORY_PATHS[name]}
    </Stroke>
  );
}
