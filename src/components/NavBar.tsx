"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import {
  CategoryIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
} from "./icons";
import { CATEGORIES, CATEGORY_GROUPS, QUICK_NAV_LINKS } from "@/lib/mock-data";
import type { Category } from "@/lib/types";

// Thanh điều hướng có mega-menu danh mục (kiểu FPT/TGDĐ). Client Component.

const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

function groupCats(slugs: string[]): Category[] {
  return slugs
    .map((s) => bySlug.get(s))
    .filter((c): c is Category => Boolean(c));
}

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line bg-white">
      <Container className="flex h-12 items-stretch gap-1">
        {/* Nút Danh mục + mega-menu */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex h-full items-center gap-2 rounded-t-lg bg-green px-4 text-[13.5px] font-semibold text-white"
          >
            <MenuIcon className="h-[18px] w-[18px]" />
            Danh mục sản phẩm
            <ChevronDownIcon className="h-3.5 w-3.5" />
          </button>

          {open && (
            <div className="absolute left-0 top-full z-50 w-[640px] max-w-[92vw] rounded-b-xl rounded-tr-xl border border-line bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
              <div className="grid grid-cols-3 gap-5">
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-muted">
                      {group.title}
                    </p>
                    <ul className="flex flex-col gap-0.5">
                      {groupCats(group.slugs).map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            href={`/danh-muc/${cat.slug}`}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] text-ink-2 transition hover:bg-green-tint hover:text-green-d"
                          >
                            <CategoryIcon
                              name={cat.icon}
                              className="h-4 w-4 text-green"
                            />
                            {cat.name}
                            {cat.tag && (
                              <span className="ml-auto rounded-full bg-sale px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                {cat.tag}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Link nhanh */}
        <nav className="flex items-center gap-1 overflow-x-auto max-[900px]:hidden">
          {QUICK_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-[13.5px] font-medium transition hover:bg-bg ${
                link.hot ? "text-sale" : "text-ink-2 hover:text-green-d"
              }`}
            >
              {link.hot && <span aria-hidden>🔥</span>}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: link tới tất cả danh mục */}
        <Link
          href="/danh-muc/tat-ca"
          className="ml-auto flex items-center gap-1 self-center text-[13px] font-medium text-green-d min-[901px]:hidden"
        >
          Tất cả
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </Link>
      </Container>
    </div>
  );
}
