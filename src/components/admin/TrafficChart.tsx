import type { ReactNode } from "react";

// Biểu đồ đường lượt truy cập — vẽ bằng SVG, không thư viện.
// Tổng quát: nhận mảng giá trị + nhãn trục X + tiêu đề + control (bộ lọc) tuỳ chọn.

export function TrafficChart({
  values,
  labels,
  title,
  subtitle,
  control,
}: {
  values: number[];
  labels: string[];
  title: string;
  subtitle?: string;
  control?: ReactNode;
}) {
  const W = 920;
  const H = 320;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const n = Math.max(values.length, 1);
  const max = Math.max(...values, 1);
  const niceMax = Math.ceil(max / 5000) * 5000 || 5000;

  const x = (i: number) =>
    padL + (n <= 1 ? 0 : (i * (W - padL - padR)) / (n - 1));
  const y = (v: number) => H - padB - (v / niceMax) * (H - padT - padB);

  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `M ${x(0)},${H - padB} L ${values
    .map((v, i) => `${x(i)},${y(v)}`)
    .join(" L ")} L ${x(n - 1)},${H - padB} Z`;

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));
  const step = Math.max(1, Math.ceil(n / 14)); // thưa nhãn X nếu nhiều điểm

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
        {control}
      </div>
      <p className="mb-3 flex items-center gap-1.5 text-[12.5px] text-muted">
        <span className="h-2.5 w-2.5 rounded-full bg-green" />
        Lượt truy cập{subtitle ? ` · ${subtitle}` : ""}
      </p>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[300px] w-full min-w-[640px]"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id="tcArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#159A48" stopOpacity="0.22" />
              <stop offset="1" stopColor="#159A48" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridVals.map((v) => (
            <g key={v}>
              <line
                x1={padL}
                x2={W - padR}
                y1={y(v)}
                y2={y(v)}
                stroke="#E4E8E3"
                strokeWidth="1"
              />
              <text
                x={padL - 10}
                y={y(v) + 4}
                textAnchor="end"
                fontSize="12"
                fill="#8B948E"
              >
                {v.toLocaleString("vi-VN")}
              </text>
            </g>
          ))}

          <path d={area} fill="url(#tcArea)" />
          <polyline
            points={pts}
            fill="none"
            stroke="#8BC34A"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {values.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#159A48" />
          ))}

          {labels.map((lb, i) =>
            i % step === 0 || i === n - 1 ? (
              <text
                key={i}
                x={x(i)}
                y={H - padB + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#8B948E"
              >
                {lb}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
}
