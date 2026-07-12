"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon, TrashIcon } from "@/components/icons";
import type { Policy } from "@/lib/policies";

// Form sửa nội dung 1 trang chính sách. Mỗi đoạn văn / gạch đầu dòng là 1 dòng
// trong textarea (xuống dòng = tách mục) cho dễ nhập.

interface SectionDraft {
  heading: string;
  paragraphs: string; // mỗi đoạn 1 dòng
  items: string; // mỗi gạch đầu dòng 1 dòng
}

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-green";

export function PolicyEditor({
  id,
  policy,
  path,
}: {
  id: string;
  policy: Policy;
  path: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(policy.title);
  const [lead, setLead] = useState(policy.lead);
  const [intro, setIntro] = useState(policy.intro.join("\n"));
  const [sections, setSections] = useState<SectionDraft[]>(
    policy.sections.map((s) => ({
      heading: s.heading,
      paragraphs: (s.paragraphs ?? []).join("\n"),
      items: (s.items ?? []).join("\n"),
    })),
  );
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function updateSection(i: number, patch: Partial<SectionDraft>) {
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }
  function addSection() {
    setSections((prev) => [...prev, { heading: "", paragraphs: "", items: "" }]);
  }
  function removeSection(i: number) {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
  }
  function moveSection(i: number, dir: -1 | 1) {
    setSections((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  const toLines = (s: string) =>
    s.split("\n").map((x) => x.trim()).filter(Boolean);

  async function save() {
    setSaving(true);
    setNotice("");
    const payload = {
      id,
      title: title.trim(),
      lead: lead.trim(),
      intro: toLines(intro),
      sections: sections.map((s) => ({
        heading: s.heading.trim(),
        paragraphs: toLines(s.paragraphs),
        items: toLines(s.items),
      })),
    };
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/trang-tinh");
        router.refresh();
      } else {
        setNotice("Lưu thất bại, vui lòng thử lại.");
      }
    } catch {
      setNotice("Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-ink">Chỉnh sửa: {policy.title}</h1>
          <a
            href={path}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-green-d hover:underline"
          >
            Xem trang: {path} ↗
          </a>
        </div>
        <Link
          href="/admin/trang-tinh"
          className="rounded-lg border border-line px-3.5 py-2 text-[13px] font-medium text-ink-2 transition hover:bg-bg"
        >
          ← Quay lại
        </Link>
      </div>

      {/* Tiêu đề + mô tả */}
      <section className="rounded-2xl border border-line bg-white p-5">
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">
          Tiêu đề trang
        </label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />

        <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-ink">
          Mô tả ngắn (dưới tiêu đề)
        </label>
        <textarea
          rows={2}
          value={lead}
          onChange={(e) => setLead(e.target.value)}
          className={inputCls}
        />

        <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-ink">
          Đoạn mở đầu <span className="font-normal text-muted">(mỗi đoạn 1 dòng)</span>
        </label>
        <textarea
          rows={4}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className={inputCls}
        />
      </section>

      {/* Các mục nội dung */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-ink">
            Các mục nội dung ({sections.length})
          </h2>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-1.5 rounded-lg bg-green px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-green-d"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm mục
          </button>
        </div>

        {sections.map((s, i) => (
          <div key={i} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                Mục {i + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                  aria-label="Lên"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === sections.length - 1}
                  aria-label="Xuống"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(i)}
                  aria-label="Xoá mục"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <label className="mb-1.5 block text-[12.5px] font-medium text-ink">
              Tiêu đề mục
            </label>
            <input
              value={s.heading}
              onChange={(e) => updateSection(i, { heading: e.target.value })}
              placeholder="VD: 1. Phạm vi áp dụng"
              className={inputCls}
            />

            <label className="mb-1.5 mt-3 block text-[12.5px] font-medium text-ink">
              Đoạn văn <span className="font-normal text-muted">(mỗi đoạn 1 dòng — có thể để trống)</span>
            </label>
            <textarea
              rows={2}
              value={s.paragraphs}
              onChange={(e) => updateSection(i, { paragraphs: e.target.value })}
              className={inputCls}
            />

            <label className="mb-1.5 mt-3 block text-[12.5px] font-medium text-ink">
              Gạch đầu dòng <span className="font-normal text-muted">(mỗi ý 1 dòng — có thể để trống)</span>
            </label>
            <textarea
              rows={4}
              value={s.items}
              onChange={(e) => updateSection(i, { items: e.target.value })}
              className={inputCls}
            />
          </div>
        ))}
      </section>

      {notice && (
        <p className="rounded-lg bg-sale/10 px-3 py-2 text-[13px] text-sale">{notice}</p>
      )}

      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-line bg-bg/80 py-3 backdrop-blur">
        <Link
          href="/admin/trang-tinh"
          className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-bg"
        >
          Huỷ
        </Link>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
