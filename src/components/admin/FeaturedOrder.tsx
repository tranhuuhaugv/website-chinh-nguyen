"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

// Sắp xếp sản phẩm nổi bật bằng nút ↑ ↓ / "Lên đầu". Lưu 1 lần bằng nút "Lưu thứ tự".

type Item = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string | null;
};

export function FeaturedOrder({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
    setDirty(true);
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: items.map((i) => i.id) }),
      });
      if (res.ok) {
        setDirty(false);
        setStatus("done");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-[14px] text-muted">
        Chưa có sản phẩm nổi bật nào. Vào danh sách sản phẩm và tích “Nổi bật”
        cho những máy bạn muốn hiện ở trang chủ.
      </div>
    );
  }

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-line text-[16px] text-ink-2 transition hover:border-green hover:text-green-d disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-2";

  return (
    <div className="flex flex-col gap-3">
      <ol className="flex flex-col gap-2">
        {items.map((it, i) => (
          <li
            key={it.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 pr-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-tint text-[13px] font-bold text-green-d">
              {i + 1}
            </span>
            <span className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F5F7F5]">
              {it.image && (
                <Image
                  src={it.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-[13.5px] font-semibold text-ink">
                {it.name}
              </p>
              <p className="text-[12px] text-muted">
                {it.brand} · {formatPrice(it.price)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                title="Đưa lên đầu"
                aria-label="Đưa lên đầu"
                onClick={() => move(i, 0)}
                disabled={i === 0}
                className={`${btn} max-[520px]:hidden`}
              >
                ⤒
              </button>
              <button
                type="button"
                aria-label="Lên"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                className={btn}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Xuống"
                onClick={() => move(i, i + 1)}
                disabled={i === items.length - 1}
                className={btn}
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-bg/90 py-3 backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || status === "saving"}
          className="h-10 rounded-xl bg-green px-5 text-[14px] font-semibold text-white transition hover:bg-green-d disabled:opacity-50"
        >
          {status === "saving" ? "Đang lưu…" : "Lưu thứ tự"}
        </button>
        {status === "done" && (
          <span className="text-[13px] text-green-d">
            Đã lưu ✓ — trang chủ cập nhật ngay
          </span>
        )}
        {status === "error" && (
          <span className="text-[13px] text-sale">Lưu thất bại, thử lại.</span>
        )}
        {dirty && status === "idle" && (
          <span className="text-[13px] text-muted">Chưa lưu thay đổi</span>
        )}
      </div>
    </div>
  );
}
