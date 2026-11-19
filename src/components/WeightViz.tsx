import { useLayoutEffect, useRef, useState } from 'react';
import { fmtNum, parseDateStr } from '../lib/format';
import type { WeightEntry } from '../lib/types';

/* ---------- Лесная тропа к цели ---------- */

const TRAIL = 'M28 184 C 96 186, 70 128, 146 124 S 222 74, 292 38';

// Ёлки вдоль тропы: x, y (низ ствола), размер, оттенок 0…2
const TREES: [number, number, number, number][] = [
  [22, 70, 1.1, 2], [52, 52, 0.8, 1], [86, 82, 1.2, 0], [30, 128, 0.9, 1], [118, 44, 0.9, 2], [68, 112, 0.7, 2],
  [164, 30, 0.8, 0], [196, 54, 0.7, 1], [178, 178, 1.2, 2], [214, 150, 0.9, 0], [252, 176, 1.1, 1], [244, 112, 0.8, 2],
  [298, 132, 1.2, 0], [304, 84, 0.8, 1], [128, 170, 0.8, 1], [96, 196, 0.7, 0],
];

function Pine({ x, y, s, tone }: { x: number; y: number; s: number; tone: number }) {
  const fill = `var(--forest-${tone})`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2} y={-6} width={4} height={8} rx={1} fill="var(--trunk)" />
      <path d="M0 -40 L13 -18 H6 L16 -4 H-16 L-6 -18 H-13 Z" fill={fill} />
    </g>
  );
}

/** Путь от стартового веса к цели через лес; точка — где человек сейчас */
export function ForestTrail({ share, letter, startLabel, goalLabel }: { share: number; letter: string; startLabel: string; goalLabel: string }) {
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

  return (
    <svg className="forest" viewBox="0 0 320 210" role="img" aria-label={`Пройдено ${Math.round(share * 100)}% пути к цели`}>
      <rect x="0" y="0" width="320" height="210" rx="16" fill="var(--forest-ground)" />
      <circle cx="292" cy="30" r="26" fill="var(--forest-sun)" />
      {TREES.filter(([, y]) => y < 120).map(([x, y, s, t], i) => (
        <Pine key={`b${i}`} x={x} y={y} s={s} tone={t} />
      ))}
      <path ref={ref} d={TRAIL} fill="none" stroke="var(--trail)" strokeWidth="10" strokeLinecap="round" />
      <path d={TRAIL} fill="none" stroke="var(--trail-dash)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
      {geo && (
        <path
          d={TRAIL}
          fill="none"
          stroke="var(--accent-text)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${geo.len * share} ${geo.len}`}
        />
      )}
      {geo?.marks.map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r="3.5" fill="var(--surface)" stroke="var(--trail-dash)" strokeWidth="1.5" />
      ))}
      {TREES.filter(([, y]) => y >= 120).map(([x, y, s, t], i) => (
        <Pine key={`f${i}`} x={x} y={y} s={s} tone={t} />
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
      {geo && (
        <g transform={`translate(${geo.x} ${geo.y})`}>
          <circle r="13" fill="var(--surface)" stroke="var(--accent-text)" strokeWidth="3" />
          <text y="4.5" textAnchor="middle" className="forest-me">
            {letter}
          </text>
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
        {pts.length <= 40 &&
          pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} className="chart-dot" />)}
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
