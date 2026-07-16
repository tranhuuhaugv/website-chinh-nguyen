"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProductAccent } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { SearchIcon } from "./icons";
import { formatPrice } from "@/lib/format";

// Ô tìm kiếm có gợi ý sản phẩm (autocomplete). Client Component.
// className: đặt kích thước/hiển thị cho wrapper (dùng chung desktop + mobile).

interface Suggestion {
  slug: string;
  name: string;
  price: number;
  oldPrice: number | null;
  accent: ProductAccent;
  /** Ảnh thật do admin tải lên. Chưa có -> ProductImage vẽ SVG theo accent. */
  image?: string | null;
}

export function SearchBox({
  className = "",
  placeholder = "Bạn cần tìm laptop gì hôm nay?",
}: {
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gọi API gợi ý (debounce 250ms).
  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setItems(data.products ?? []);
      } catch {
        /* bỏ qua (bao gồm abort) */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  // Đóng dropdown khi bấm ra ngoài.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function goSearch() {
    const term = q.trim();
    if (term) router.push(`/tim-kiem?q=${encodeURIComponent(term)}`);
    setOpen(false);
  }

  const showPanel = open && q.trim().length > 0;

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goSearch();
        }}
        className="flex h-full items-center rounded-full bg-white pl-2 pr-3 shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
      >
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:text-green-d"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </button>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-none bg-transparent text-[14px] text-ink outline-none [&::-webkit-search-cancel-button]:hidden"
          aria-label="Tìm kiếm sản phẩm"
          autoComplete="off"
        />
      </form>

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-pop">
          {loading && items.length === 0 ? (
            <p className="px-4 py-4 text-[13.5px] text-muted">Đang tìm…</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-4 text-[13.5px] text-muted">
              Không tìm thấy sản phẩm phù hợp.
            </p>
          ) : (
            <>
              <ul className="max-h-[60vh] overflow-auto py-1.5">
                {items.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/san-pham/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 transition hover:bg-bg"
                    >
                      <span className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F5F7F5] p-1">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            sizes="56px"
                            // Thẻ ảnh chỉ tồn tại khi khách mở gợi ý -> lazy
                            // không tiết kiệm được gì, chỉ làm ảnh hiện chậm.
                            loading="eager"
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="block h-full w-full overflow-hidden rounded">
                            <ProductImage accent={p.accent} uid={`s-${p.slug}`} />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-[13.5px] font-medium text-ink">
                          {p.name}
                        </span>
                        <span className="mt-0.5 flex items-center gap-2">
                          <b className="text-[13.5px] font-bold text-sale">
                            {formatPrice(p.price)}
                          </b>
                          {p.oldPrice && (
                            <s className="text-[12px] text-muted">
                              {formatPrice(p.oldPrice)}
                            </s>
                          )}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goSearch}
                className="block w-full border-t border-line px-4 py-2.5 text-center text-[13px] font-semibold text-green-d transition hover:bg-green-tint"
              >
                Xem tất cả kết quả cho “{q.trim()}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
