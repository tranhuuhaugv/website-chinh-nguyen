// Biểu đồ đường thống kê lượt truy cập theo 12 tháng — vẽ bằng SVG, không thư viện.

const MONTHS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

export function TrafficChart({
  months,
  year,
}: {
  months: number[];
  year: string;
}) {
  const W = 920;
  const H = 320;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const max = Math.max(...months, 1);
  // Làm tròn trần lên bội số đẹp cho lưới.
  const niceMax = Math.ceil(max / 5000) * 5000 || 5000;

  const x = (i: number) => padL + (i * (W - padL - padR)) / 11;
  const y = (v: number) => H - padB - (v / niceMax) * (H - padT - padB);

  const pts = months.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `M ${x(0)},${H - padB} L ${months
    .map((v, i) => `${x(i)},${y(v)}`)
    .join(" L ")} L ${x(11)},${H - padB} Z`;

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-ink">
          Thống kê truy cập theo tháng
        </h2>
        <span className="rounded-lg bg-bg px-3 py-1 text-[13px] font-semibold text-ink-2">
          Năm {year}
        </span>
      </div>
      <p className="mb-3 flex items-center gap-1.5 text-[12.5px] text-muted">
        <span className="h-2.5 w-2.5 rounded-full bg-green" />
        Lượt truy cập
      </p>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[300px] w-full min-w-[640px]"
          role="img"
          aria-label={`Biểu đồ lượt truy cập theo tháng năm ${year}`}
        >
          <defs>
            <linearGradient id="tcArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#159A48" stopOpacity="0.22" />
              <stop offset="1" stopColor="#159A48" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Lưới ngang + nhãn trục Y */}
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

          {/* Vùng nền + đường */}
          <path d={area} fill="url(#tcArea)" />
          <polyline
            points={pts}
            fill="none"
            stroke="#8BC34A"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {months.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r="4" fill="#159A48" />
          ))}

          {/* Nhãn trục X */}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={x(i)}
              y={H - padB + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#8B948E"
            >
              {m}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
