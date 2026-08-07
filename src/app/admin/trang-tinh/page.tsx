import Link from "next/link";
import { EditIcon, PlusIcon } from "@/components/icons";
import { DeletePageButton } from "@/components/admin/DeletePageButton";
import { INFO_PAGES, POLICIES } from "@/lib/policies";
import { getCustomPages } from "@/lib/data";

export const metadata = { title: "Trang nội dung" };
export const dynamic = "force-dynamic";

export default async function AdminStaticPagesPage() {
  const custom = await getCustomPages();

  const fixedPages = [
    ...Object.entries(INFO_PAGES).map(([slug, p]) => ({
      slug,
      title: p.title,
      path: `/${slug}`,
      custom: false,
    })),
    ...Object.entries(POLICIES).map(([slug, p]) => ({
      slug,
      title: p.title,
      path: `/chinh-sach/${slug}`,
      custom: false,
    })),
  ];
  const customPages = custom.map((p) => ({
    slug: p.slug,
    title: p.title,
    path: `/trang/${p.slug}`,
    custom: true,
  }));
  const pages = [...fixedPages, ...customPages];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-ink">Trang nội dung</h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Sửa nội dung trang Giới thiệu, Liên hệ, Chính sách — hoặc tự tạo trang
            mới. Sửa xong bấm Lưu là web cập nhật ngay.
          </p>
        </div>
        <Link
          href="/admin/trang-tinh/them"
          className="flex h-9 items-center gap-1.5 rounded-lg bg-green px-3.5 text-sm font-semibold text-white transition hover:bg-green-d"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm trang
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-[13.5px]">
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
                <td className="px-4 py-3 font-medium text-ink">
                  {p.title}
                  {p.custom && (
                    <span className="ml-2 rounded-full bg-green-soft px-2 py-0.5 text-[10.5px] font-semibold text-green-d">
                      Tự tạo
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <code className="text-muted">{p.path}</code>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/trang-tinh/${p.slug}`}
                      aria-label="Sửa"
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink-2 transition hover:border-green hover:text-green-d"
                    >
                      <EditIcon className="h-4 w-4" />
                      Sửa
                    </Link>
                    {p.custom && (
                      <DeletePageButton slug={p.slug} title={p.title} />
                    )}
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
