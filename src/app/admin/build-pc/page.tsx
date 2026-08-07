import Link from "next/link";
import Image from "next/image";
import { EditIcon, PlusIcon } from "@/components/icons";
import { DeletePcPartButton } from "@/components/admin/DeletePcPartButton";
import { getPcPartsAdmin } from "@/lib/data";
import { PC_PART_TYPES, pcPartTypeLabel } from "@/lib/pc-parts";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Build PC — Linh kiện" };
export const dynamic = "force-dynamic";

export default async function AdminPcPartsPage() {
  const parts = await getPcPartsAdmin();

  // Nhóm theo loại, giữ thứ tự PC_PART_TYPES.
  const byType = PC_PART_TYPES.map((t) => ({
    ...t,
    items: parts.filter((p) => p.type === t.key),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-ink">Build PC — Linh kiện</h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Thêm linh kiện vào từng nhóm (CPU, Mainboard, VGA…). Khách sẽ chọn ở
            trang{" "}
            <Link href="/build-pc" className="font-semibold text-green-d underline">
              /build-pc
            </Link>{" "}
            và tự cộng tổng tiền.
          </p>
        </div>
        <Link
          href="/admin/build-pc/them"
          className="flex h-9 items-center gap-1.5 rounded-lg bg-green px-3.5 text-sm font-semibold text-white transition hover:bg-green-d"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm linh kiện
        </Link>
      </div>

      {byType.map((group) => (
        <section
          key={group.key}
          className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-line bg-bg px-4 py-2.5">
            <h2 className="text-[13.5px] font-bold text-ink">
              {pcPartTypeLabel(group.key)}
              <span className="ml-2 text-[12px] font-normal text-muted">
                ({group.items.length})
              </span>
            </h2>
          </div>

          {group.items.length === 0 ? (
            <p className="px-4 py-4 text-[13px] text-muted">
              Chưa có linh kiện. Bấm “Thêm linh kiện” và chọn loại{" "}
              {pcPartTypeLabel(group.key)}.
            </p>
          ) : (
            <table className="w-full text-left text-[13.5px]">
              <tbody>
                {group.items.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-line last:border-0 hover:bg-bg/60"
                  >
                    <td className="w-14 py-2.5 pl-4">
                      <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-[#F5F7F5]">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="44px"
                            className="object-contain"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pl-3 pr-4">
                      <div className="font-medium text-ink">
                        {p.name}
                        {!p.active && (
                          <span className="ml-2 rounded bg-[#F1F3F1] px-1.5 py-0.5 text-[10.5px] font-semibold text-muted">
                            Ẩn
                          </span>
                        )}
                      </div>
                      {p.note && (
                        <div className="text-[12px] text-muted">{p.note}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 text-right font-semibold text-sale">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/build-pc/${p.id}`}
                          aria-label="Sửa"
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink-2 transition hover:border-green hover:text-green-d"
                        >
                          <EditIcon className="h-4 w-4" />
                          Sửa
                        </Link>
                        <DeletePcPartButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
    </div>
  );
}
