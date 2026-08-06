import Link from "next/link";
import { EditIcon } from "@/components/icons";
import { INFO_PAGES, POLICIES } from "@/lib/policies";

export const metadata = { title: "Trang nội dung" };

export default function AdminStaticPagesPage() {
  const pages = [
    // Giới thiệu / Liên hệ lên đầu cho dễ tìm.
    ...Object.entries(INFO_PAGES).map(([slug, p]) => ({
      slug,
      title: p.title,
      path: `/${slug}`,
    })),
    ...Object.entries(POLICIES).map(([slug, p]) => ({
      slug,
      title: p.title,
      path: `/chinh-sach/${slug}`,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[20px] font-bold text-ink">Trang nội dung</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Sửa nội dung trang Giới thiệu, Liên hệ và các trang Chính sách. Sửa
          xong bấm Lưu là web cập nhật ngay.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[520px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Tên trang</th>
              <th className="px-4 py-3 font-semibold">Đường dẫn</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr
                key={p.slug}
                className="border-b border-line last:border-0 hover:bg-bg/60"
              >
                <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                <td className="px-4 py-3">
                  <code className="text-muted">{p.path}</code>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/trang-tinh/${p.slug}`}
                      aria-label="Sửa"
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink-2 transition hover:border-green hover:text-green-d"
                    >
                      <EditIcon className="h-4 w-4" />
                      Sửa
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
