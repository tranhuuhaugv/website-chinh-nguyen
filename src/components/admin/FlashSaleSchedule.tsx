"use client";

import { useState } from "react";

// Đặt lịch Flash Sale: ngày + giờ bắt đầu & kết thúc (giờ Việt Nam).
// Lưu Setting "flashSaleStart" / "flashSaleEnd" dạng "YYYY-MM-DDTHH:mm".
// Để trống = không giới hạn (chỉ phụ thuộc công tắc bật/tắt phía trên).

async function saveKey(key: string, value: string) {
  const res = await fetch("/api/admin/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  return res.ok;
}

export function FlashSaleSchedule({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  const [s, setS] = useState(start);
  const [e, setE] = useState(end);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  const dirty = s !== start || e !== end;
  const invalid = s && e && e <= s; // kết thúc phải sau bắt đầu

  async function save() {
    if (invalid) return;
    setStatus("saving");
    try {
      const ok1 = await saveKey("flashSaleStart", s);
      const ok2 = await saveKey("flashSaleEnd", e);
      setStatus(ok1 && ok2 ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "h-10 rounded-lg border border-line bg-white px-3 text-[13.5px] text-ink outline-none transition focus:border-green";

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-[12.5px] font-medium text-ink">
            Bắt đầu (giờ VN)
          </span>
          <input
            type="datetime-local"
            value={s}
            onChange={(ev) => {
              setS(ev.target.value);
              setStatus("idle");
            }}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[12.5px] font-medium text-ink">
            Kết thúc (giờ VN)
          </span>
          <input
            type="datetime-local"
            value={e}
            onChange={(ev) => {
              setE(ev.target.value);
              setStatus("idle");
            }}
            className={inputCls}
          />
        </label>
      </div>

      {invalid && (
        <p className="text-[12.5px] text-sale">
          Thời gian kết thúc phải sau thời gian bắt đầu.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || !!invalid || status === "saving"}
          className="h-9 rounded-lg bg-green px-4 text-[13px] font-semibold text-white transition hover:bg-green-d disabled:opacity-50"
        >
          {status === "saving" ? "Đang lưu…" : "Lưu lịch"}
        </button>
        <button
          type="button"
          onClick={() => {
            setS("");
            setE("");
            setStatus("idle");
          }}
          className="h-9 rounded-lg border border-line px-3 text-[13px] font-medium text-ink-2 transition hover:border-sale hover:text-sale"
        >
          Xoá lịch
        </button>
        {status === "done" && !dirty && (
          <span className="text-[12.5px] text-green-d">Đã lưu ✓</span>
        )}
        {status === "error" && (
          <span className="text-[12.5px] text-sale">Lưu thất bại</span>
        )}
      </div>

      <p className="text-[12px] text-muted">
        Để trống cả hai = Flash Sale chạy liên tục khi công tắc đang bật. Có lịch
        thì khối chỉ hiện trong khoảng thời gian này và đồng hồ đếm ngược tới giờ
        kết thúc.
      </p>
    </div>
  );
}
