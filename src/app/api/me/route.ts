import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

// Trả về khách hàng đang đăng nhập (hoặc null) cho các Client Component
// như Header/AccountMenu — để Header tĩnh vẫn cache/ISR được.
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}
