import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPolicyOverride } from "@/lib/data";
import { isFixedPage } from "@/lib/policies";

// Trang nội dung TUỲ CHỈNH (admin tự tạo, lưu bảng Page). ISR: tự làm mới khi lưu.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (isFixedPage(params.slug)) return { title: "Không tìm thấy trang" };
  const p = await getPolicyOverride(params.slug);
  return p
    ? { title: p.title, description: p.lead }
    : { title: "Không tìm thấy trang" };
}

export default async function CustomContentPage({
  params,
}: {
  params: { slug: string };
}) {
  // Link cũ /trang/* được chuyển sang nhóm Chính sách để không làm gãy URL đã chia sẻ.
  if (isFixedPage(params.slug)) notFound();
  const page = await getPolicyOverride(params.slug);
  if (!page) notFound();

  permanentRedirect(`/chinh-sach/${params.slug}`);
}
