"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/icons";

// Bảng dữ liệu generic dùng chung cho mọi CRUD (sản phẩm, danh mục, blog...).
// UI-first: xóa chỉ ẩn dòng ở phía client (demo) cho tới khi nối DB.

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export function AdminTable<T>({
  title,
  columns,
  rows: initialRows,
  rowId,
  searchKeys,
  editHref,
  addHref,
  addLabel = "Thêm mới",
}: {
  title: string;
  columns: Column<T>[];
  rows: T[];
  rowId: (row: T) => string;
  searchKeys?: (row: T) => string;
  editHref?: (row: T) => string;
  addHref?: string;
  addLabel?: string;
}) {
  const [rows, setRows] = useState(initialRows);
  const [q, setQ] = useState("");

  const filtered =
    q && searchKeys
      ? rows.filter((r) => searchKeys(r).toLowerCase().includes(q.toLowerCase()))
      : rows;

  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <h1 className="text-[17px] font-bold text-ink">{title}</h1>
        <div className="flex items-center gap-2">
          {searchKeys && (
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm..."
              className="h-9 w-48 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-green"
            />
          )}
          {addHref && (
            <Link
              href={addHref}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-green px-3.5 text-sm font-semibold text-white transition hover:bg-green-d"
            >
              <PlusIcon className="h-4 w-4" />
              {addLabel}
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 font-semibold ${c.className ?? ""}`}>
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-10 text-center text-muted"
                >
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={rowId(row)}
                  className="border-b border-line last:border-0 hover:bg-bg/60"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 text-ink ${c.className ?? ""}`}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {editHref && (
                        <Link
                          href={editHref(row)}
                          aria-label="Sửa"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green hover:text-green-d"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Link>
                      )}
                      <button
                        type="button"
                        aria-label="Xóa"
                        onClick={() =>
                          setRows((prev) =>
                            prev.filter((r) => rowId(r) !== rowId(row)),
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
