import { useLayoutEffect, useRef, useState } from 'react';
import { fmtNum, parseDateStr } from '../lib/format';
import type { WeightEntry } from '../lib/types';
import { Monster } from './Monster';

/* ---------- Цветочная тропинка к цели: по ней идёт питомица ---------- */

const TRAIL = 'M28 184 C 96 186, 70 128, 146 124 S 222 74, 292 38';

// Цветочки вокруг тропинки: x, y (у земли), размер, цвет
const FLOWERS: [number, number, number, number][] = [
  [22, 70, 1.1, 0],
  [50, 50, 0.8, 1],
  [84, 80, 1.2, 2],
  [30, 126, 0.9, 3],
  [116, 44, 0.9, 4],
  [66, 108, 0.8, 1],
  [160, 28, 0.8, 0],
  [196, 54, 0.8, 2],
  [180, 176, 1.2, 3],
  [214, 148, 0.9, 4],
  [252, 176, 1.1, 0],
  [244, 110, 0.8, 1],
  [298, 132, 1.2, 2],
  [304, 84, 0.9, 3],
  [128, 170, 0.9, 4],
  [96, 196, 0.8, 2],
  [12, 160, 0.8, 4],
  [140, 90, 0.7, 0],
  [226, 84, 0.7, 3],
  [276, 196, 0.8, 1],
  [60, 24, 0.7, 3],
  [196, 120, 0.7, 0],
  [150, 200, 0.7, 2],
  [306, 172, 0.7, 4],
];
const PETAL = ['#ff9cc8', '#ffffff', '#d9c4f2', '#f6e39a', '#ffc4dd'];

function Bloom({ x, y, s, c }: { x: number; y: number; s: number; c: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 q-2 -8 0 -16" fill="none" stroke="var(--forest-2)" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M0 -6 q-7 -1 -8 -6 q6 0 8 4z" fill="var(--forest-0)" />
      <g transform="translate(0 -19)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse
            key={r}
            cx={0}
            cy={-4.2}
            rx={3.4}
            ry={4.6}
            transform={`rotate(${r})`}
            fill={PETAL[c]}
            stroke="rgba(200,120,150,0.35)"
            strokeWidth={0.6}
          />
        ))}
        <circle r={2.6} fill="#f2c94c" />
      </g>
    </g>
  );
}

/** Путь от стартового веса к цели по цветочной поляне; по тропинке идёт питомица */
export function ForestTrail({
  share,
  petName,
  startLabel,
  goalLabel,
}: {
  share: number;
  petName: string;
  startLabel: string;
  goalLabel: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<{ len: number; x: number; y: number; marks: { x: number; y: number }[] } | null>(null);

  useLayoutEffect(() => {
    const path = ref.current;
    if (!path) return;
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * share);
    const marks = [0.25, 0.5, 0.75].map((k) => {
      const m = path.getPointAtLength(len * k);
      return { x: m.x, y: m.y };
    });
    setGeo({ len, x: pt.x, y: pt.y, marks });
  }, [share]);

  const PET_W = 38;
  const PET_H = (PET_W * 220) / 200;

  return (
    <svg className="forest" viewBox="0 0 320 210" role="img" aria-label={`${petName} прошла ${Math.round(share * 100)}% пути к цели`}>
      <rect x="0" y="0" width="320" height="210" rx="16" fill="var(--forest-ground)" />
      <circle cx="292" cy="30" r="26" fill="var(--forest-sun)" />
      {FLOWERS.filter(([, y]) => y < 120).map(([x, y, s, c], i) => (
        <Bloom key={`b${i}`} x={x} y={y} s={s} c={c} />
      ))}
      <path ref={ref} d={TRAIL} fill="none" stroke="var(--trail)" strokeWidth="10" strokeLinecap="round" />
      <path d={TRAIL} fill="none" stroke="var(--trail-dash)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
      {geo && (
        <path
          d={TRAIL}
          fill="none"
          stroke="var(--trail-done)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${geo.len * share} ${geo.len}`}
        />
      )}
      {geo?.marks.map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r="3.5" fill="var(--surface)" stroke="var(--trail-dash)" strokeWidth="1.5" />
      ))}
      {FLOWERS.filter(([, y]) => y >= 120).map(([x, y, s, c], i) => (
        <Bloom key={`f${i}`} x={x} y={y} s={s} c={c} />
      ))}
      {/* Флажок цели */}
      <g transform="translate(292 38)">
        <rect x={-1} y={-30} width={2.5} height={30} rx={1} fill="var(--trunk)" />
        <path d="M1.5 -30 L22 -23 L1.5 -16 Z" fill="var(--pink)" />
      </g>
      <text x="284" y="20" className="forest-label" textAnchor="end">
        {goalLabel}
      </text>
      <text x="22" y="204" className="forest-label">
        {startLabel}
      </text>
      {/* питомица на тропинке — ножками на точке пути */}
      {geo && (
        <g className="trail-pet">
          <Monster mood="eating" svgProps={{ x: geo.x - PET_W / 2, y: geo.y - PET_H * 0.93, width: PET_W, height: PET_H }} />
        </g>
      )}
    </svg>
  );
}

/* ---------- График веса ---------- */

const W = 320;
const H = 170;
const PAD = { l: 34, r: 12, t: 14, b: 24 };
const DAY = 86400000;
const shortDate = (s: string) => parseDateStr(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');

/** Линия веса по дням и пунктир цели. Нажмите на график — покажет вес в ближайший день. */
export function WeightChart({ list, target }: { list: WeightEntry[]; target?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  if (list.length < 2) return <div className="muted small chart-empty">График появится после второго взвешивания.</div>;

  const t0 = parseDateStr(list[0].date).getTime();
  const days = list.map((w) => (parseDateStr(w.date).getTime() - t0) / DAY);
  const span = Math.max(1, days.at(-1)!);
  const kgs = list.map((w) => w.kg);
  let lo = Math.min(...kgs);
  let hi = Math.max(...kgs);
  if (target != null && target >= lo - 3 && target <= hi + 3) {
    lo = Math.min(lo, target);
    hi = Math.max(hi, target);
  }
  lo = Math.floor(lo - 0.5);
  hi = Math.ceil(hi + 0.5);
  const x = (d: number) => PAD.l + (d / span) * (W - PAD.l - PAD.r);
  const y = (kg: number) => PAD.t + ((hi - kg) / (hi - lo)) * (H - PAD.t - PAD.b);
  const ticks = [hi, (hi + lo) / 2, lo];
  const pts = list.map((w, i) => ({ x: x(days[i]), y: y(w.kg), w }));
  const showGoal = target != null && target >= lo && target <= hi;

  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    let best = 0;
    pts.forEach((p, i) => Math.abs(p.x - px) < Math.abs(pts[best].x - px) && (best = i));
    setHover(best);
  };
  const h = hover != null ? pts[hover] : null;

  return (
    <div className="chart-wrap">
      <svg
        className="chart"
        viewBox={`0 0 ${W} ${H}`}
        onPointerDown={pick}
        onPointerMove={pick}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`Вес: от ${fmtNum(kgs[0])} до ${fmtNum(kgs.at(-1)!)} кг`}
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="chart-grid" />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" className="chart-axis">
              {fmtNum(v)}
            </text>
          </g>
        ))}
        {showGoal && (
          <g>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(target!)} y2={y(target!)} className="chart-goal" />
            <text x={W - PAD.r} y={y(target!) - 5} textAnchor="end" className="chart-axis">
              цель {fmtNum(target!)}
            </text>
          </g>
        )}
        <text x={PAD.l} y={H - 6} className="chart-axis">
          {shortDate(list[0].date)}
        </text>
        <text x={W - PAD.r} y={H - 6} textAnchor="end" className="chart-axis">
          {shortDate(list.at(-1)!.date)}
        </text>
        <polyline points={pts.map((p) => `${p.x},${p.y}`).join(' ')} className="chart-line" />
        {pts.length <= 40 && pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} className="chart-dot" />)}
        {h && (
          <g>
            <line x1={h.x} x2={h.x} y1={PAD.t} y2={H - PAD.b} className="chart-cross" />
            <circle cx={h.x} cy={h.y} r={5.5} className="chart-dot active" />
          </g>
        )}
      </svg>
      {h && (
        <div className="chart-tip" style={{ left: `${(h.x / W) * 100}%` }}>
          <b>{fmtNum(h.w.kg)} кг</b>
          <span>{shortDate(h.w.date)}</span>
        </div>
      )}
    </div>
  );
}
