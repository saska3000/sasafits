import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { fmtKcal } from '../lib/format';
import { portionFor, type RecipeCalc } from '../lib/recipes';
import type { Profile, Recipe } from '../lib/types';
import { RecipePic } from './RecipePic';
import { toast } from './ui';

export interface SurpriseCard {
  recipe: Recipe;
  calc: RecipeCalc;
}

/* ---------- Фигурки ---------- */

function petals(n: number, R: number, r: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return <circle key={i} cx={50 + Math.cos(a) * R} cy={50 + Math.sin(a) * R} r={r} />;
  });
}
function burst(points: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 ? inner : outer;
    pts.push(`${50 + Math.cos(a) * rad},${50 + Math.sin(a) * rad}`);
  }
  return <polygon points={pts.join(' ')} strokeLinejoin="round" strokeWidth="8" />;
}

const SHAPES: ((fill: string) => ReactNode)[] = [
  // Цветок
  (fill) => (
    <g fill={fill}>
      {petals(8, 28, 20)}
      <circle cx="50" cy="50" r="30" />
    </g>
  ),
  // Звёздочка-печать, как бейдж «Festival»
  (fill) => (
    <g fill={fill} stroke={fill}>
      {burst(12, 46, 38)}
    </g>
  ),
  // Скруглённый квадрат
  (fill) => <rect x="8" y="8" width="84" height="84" rx="22" fill={fill} />,
  // Круг
  (fill) => <circle cx="50" cy="50" r="46" fill={fill} />,
  // Капля
  (fill) => <path d="M50 5c19 0 39 11 43 31s-6 41-24 51-45 8-57-8S1 41 13 24 31 5 50 5z" fill={fill} />,
];
const COLORS = ['var(--rose)', 'var(--accent)', 'var(--ice)', 'var(--sage)', 'var(--vanilla)'];

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/* ---------- Датчики телефона ---------- */

type PermCtor = { requestPermission?: () => Promise<'granted' | 'denied'> };
const motionCtor = () => (typeof window !== 'undefined' ? (window.DeviceMotionEvent as unknown as PermCtor | undefined) : undefined);
const orientCtor = () =>
  typeof window !== 'undefined' ? (window.DeviceOrientationEvent as unknown as PermCtor | undefined) : undefined;

/* ---------- «Физика»: фигурки плавают, как в стакане воды ---------- */

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
}

const START = [
  { x: 0.02, y: 0.02, r: -10 },
  { x: 0.55, y: 0.0, r: 8 },
  { x: 0.29, y: 0.29, r: -3 },
  { x: 0.0, y: 0.56, r: 9 },
  { x: 0.56, y: 0.54, r: -8 },
];
const SIZE = 0.43; // доля ширины сцены

/* ---------- Экран «Удиви меня» ---------- */

export function Surprise({
  cards,
  swiper,
  onLike,
  onOpen,
  onBack,
}: {
  cards: SurpriseCard[];
  swiper: Profile;
  onLike: (c: SurpriseCard) => Promise<void>;
  onOpen: (c: SurpriseCard) => void;
  onBack: () => void;
}) {
  const needsPermission =
    typeof motionCtor()?.requestPermission === 'function' || typeof orientCtor()?.requestPermission === 'function';
  const [motionOn, setMotionOn] = useState(!needsPermission && !!motionCtor());
  const [shown, setShown] = useState<SurpriseCard[]>(() => shuffle(cards).slice(0, 5));
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'picked'>('idle');
  const [winner, setWinner] = useState<number | null>(null);

  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const tilt = useRef({ gx: 0, gy: 0, base: null as null | { b: number; g: number } });
  const shakes = useRef<number[]>([]);
  // когда начали трясти и когда был последний сильный рывок — блюдо выпадает, когда перестали трясти
  const session = useRef({ start: 0, lastStrong: 0, bySensor: false });
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const timers = useRef<number[]>([]);

  // Чтобы iPhone не спрашивал «Отменить ввод?» при встряхивании — убираем фокус с полей ввода
  useEffect(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  }, []);

  const scatter = useCallback(() => {
    const w = stage.current?.clientWidth ?? 340;
    bodies.current = START.map((p) => ({ x: p.x * w, y: p.y * w, vx: 0, vy: 0, r: p.r, vr: 0 }));
  }, []);

  const kick = (power: number) => {
    for (const b of bodies.current) {
      b.vx += (Math.random() - 0.5) * power;
      b.vy += (Math.random() - 0.5) * power;
      b.vr += (Math.random() - 0.5) * power * 0.3;
    }
  };

  const pick = useCallback(() => {
    setWinner(Math.floor(Math.random() * Math.min(5, cards.length)));
    setPhase('picked');
  }, [cards]);

  const go = useCallback((bySensor = false) => {
    if (phaseRef.current === 'shaking' || cards.length === 0) return;
    timers.current.forEach(clearTimeout);
    (document.activeElement as HTMLElement | null)?.blur?.();
    if (phaseRef.current === 'picked') {
      setShown(shuffle(cards).slice(0, Math.min(5, cards.length)));
      scatter();
    }
    setWinner(null);
    setPhase('shaking');
    const now = Date.now();
    session.current = { start: now, lastStrong: now, bySensor };
    kick(bySensor ? 600 : 1400);
    if (bySensor) return; // дальше фигурки летают от ваших рывков, а выбор — когда перестанете трясти
    // по кнопке — фигурки полетают пару секунд
    timers.current.push(window.setTimeout(() => kick(700), 700));
    timers.current.push(window.setTimeout(pick, 2300));
  }, [cards, scatter, pick]);

  // Трясёте — фигурки летают; перестали трясти — ещё секунду успокаиваются, и выпадает блюдо
  useEffect(() => {
    if (phase !== 'shaking') return;
    const iv = window.setInterval(() => {
      const ses = session.current;
      if (!ses.bySensor) return;
      const now = Date.now();
      if (now - ses.lastStrong > 1200 && now - ses.start > 1500) {
        window.clearInterval(iv);
        pick();
      }
    }, 150);
    return () => window.clearInterval(iv);
  }, [phase, pick]);

  // Анимация: каждый кадр двигаем фигурки (наклон, толчки, стенки, столкновения)
  useEffect(() => {
    if (phase === 'picked') return;
    if (!bodies.current.length) scatter();
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const st = stage.current;
      if (st) {
        const W = st.clientWidth;
        const H = st.clientHeight;
        const S = W * SIZE;
        const list = bodies.current;
        list.forEach((b) => {
          // фигурки двигаются только от наклона телефона и толчков — сами по себе стоят
          b.vx += tilt.current.gx * 900 * dt;
          b.vy += tilt.current.gy * 900 * dt;
          b.vx *= 0.965;
          b.vy *= 0.965;
          b.vr *= 0.95;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.r += b.vr * dt;
          if (b.x < 0) (b.x = 0), (b.vx = Math.abs(b.vx) * 0.5);
          if (b.y < 0) (b.y = 0), (b.vy = Math.abs(b.vy) * 0.5);
          if (b.x > W - S) (b.x = W - S), (b.vx = -Math.abs(b.vx) * 0.5);
          if (b.y > H - S) (b.y = H - S), (b.vy = -Math.abs(b.vy) * 0.5);
        });
        // мягко расталкиваем фигурки, чтобы не слипались
        for (let i = 0; i < list.length; i++)
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const d = Math.hypot(dx, dy) || 1;
            const min = S * 0.72;
            if (d < min) {
              const push = ((min - d) / d) * 0.5;
              a.x -= dx * push * 0.5;
              a.y -= dy * push * 0.5;
              b.x += dx * push * 0.5;
              b.y += dy * push * 0.5;
            }
          }
        list.forEach((b, i) => {
          const el = els.current[i];
          if (el) el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.r}deg)`;
        });
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, motionOn, scatter]);

  // Выпавшая фигура плавно выезжает в центр
  useEffect(() => {
    if (phase !== 'picked' || winner == null) return;
    const st = stage.current;
    const el = els.current[winner];
    if (!st || !el) return;
    const W = st.clientWidth;
    const S = W * SIZE;
    const scale = 1.5;
    el.style.transform = `translate(${(W - S) / 2}px, ${(st.clientHeight - S) / 2}px) rotate(0deg) scale(${scale})`;
  }, [phase, winner]);

  // Датчики: наклон двигает фигурки, толчки их подбрасывают, настоящее встряхивание выбирает блюдо
  useEffect(() => {
    if (!motionOn) return;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      const tl = tilt.current;
      if (!tl.base) tl.base = { b: e.beta, g: e.gamma };
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      // «мёртвая зона» 3°: от дрожания руки фигурки не ползут
      const dz = (deg: number) => (Math.abs(deg) < 3 ? 0 : deg - Math.sign(deg) * 3);
      tl.gx = clamp(Math.sin((dz(e.gamma - tl.base.g) * Math.PI) / 180) * 1.8);
      tl.gy = clamp(Math.sin((dz(e.beta - tl.base.b) * Math.PI) / 180) * 1.8);
    };
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.acceleration;
      if (!a || a.x == null || a.y == null) return;
      if (phaseRef.current !== 'picked') {
        // толчок телефона — фигурки качнулись в ту же сторону (слабое дрожание руки не считаем)
        const ax = Math.abs(a.x ?? 0) > 0.6 ? (a.x ?? 0) : 0;
        const ay = Math.abs(a.y ?? 0) > 0.6 ? (a.y ?? 0) : 0;
        for (const b of bodies.current) {
          b.vx -= ax * 12;
          b.vy += ay * 12;
          b.vr += (Math.random() - 0.5) * (Math.abs(ax) + Math.abs(ay)) * 3;
        }
      }
      const mag = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0);
      const now = Date.now();
      if (mag > 13) {
        shakes.current.push(now);
        session.current.lastStrong = now;
      }
      shakes.current = shakes.current.filter((t) => now - t < 900);
      // встряхивание — это несколько сильных рывков подряд, а не просто поворот телефона
      if (shakes.current.length >= 6 && phaseRef.current !== 'shaking') {
        shakes.current = [];
        go(true);
      }
    };
    window.addEventListener('deviceorientation', onOrient);
    window.addEventListener('devicemotion', onMotion);
    return () => {
      window.removeEventListener('deviceorientation', onOrient);
      window.removeEventListener('devicemotion', onMotion);
    };
  }, [motionOn, go]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const enableMotion = async () => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    try {
      // Оба запроса — сразу, в одном нажатии: iPhone разрешает их только по нажатию пользователя
      const asks = [motionCtor()?.requestPermission?.(), orientCtor()?.requestPermission?.()].filter(
        (p): p is Promise<'granted' | 'denied'> => !!p,
      );
      const results = await Promise.allSettled(asks);
      const granted = !asks.length || results.some((r) => r.status === 'fulfilled' && r.value === 'granted');
      if (granted) {
        tilt.current.base = null;
        setMotionOn(true);
        toast('Готово — наклоняйте и встряхивайте телефон');
      } else toast('Без разрешения датчики не работают — нажмите «Перемешать»');
    } catch {
      toast('Не получилось включить датчики — нажмите «Перемешать»');
    }
  };

  const picked = phase === 'picked' && winner != null ? shown[winner] : null;
  const mine = picked ? portionFor(picked.calc, swiper) : null;

  return (
    <div className="surprise">
      <div className="deck-head">
        <button className="chip" onClick={onBack}>
          ← Удиви меня
        </button>
        <span className="muted small">в шляпе {cards.length} блюд</span>
      </div>

      <div ref={stage} className={`shake-stage ${phase}`}>
        {shown.map((c, i) => {
          const isWin = picked && i === winner;
          return (
            <div
              key={c.recipe.id}
              ref={(el) => {
                els.current[i] = el;
              }}
              className={'shape' + (isWin ? ' win' : '') + (picked && !isWin ? ' lose' : '')}
            >
              <svg viewBox="0 0 100 100" aria-hidden="true">
                {SHAPES[i % SHAPES.length](COLORS[i % COLORS.length])}
              </svg>
              <span className="shape-name">{c.recipe.name}</span>
            </div>
          );
        })}
      </div>

      {picked && mine ? (
        <div className="card surprise-result">
          <RecipePic recipe={picked.recipe} className="recipe-emoji" />
          <div className="surprise-info">
            <div className="surprise-name">{picked.recipe.name}</div>
            <div className="muted small">
              {fmtKcal(mine.kcal)} ккал · Б {Math.round(mine.p)} · Ж {Math.round(mine.f)} · У {Math.round(mine.c)}
              {picked.recipe.timeMin ? ` · ${picked.recipe.timeMin} мин` : ''}
            </div>
          </div>
        </div>
      ) : (
        <p className="center muted surprise-hint">
          {motionOn
            ? 'Наклоняйте телефон — фигурки поплывут. Встряхните посильнее — и выпадет блюдо, которое помещается в ваши калории.'
            : 'Перемешайте фигурки — и выпадет блюдо, которое помещается в ваши калории.'}
        </p>
      )}

      <div className="stack">
        {picked && (
          <>
            <button
              className="btn primary big"
              onClick={async () => {
                await onLike(picked);
                toast(`${swiper.name} хочет: ${picked.recipe.name}`);
              }}
            >
              Хочу это
            </button>
            <button className="btn outline" onClick={() => onOpen(picked)}>
              Открыть рецепт
            </button>
          </>
        )}
        {!motionOn && needsPermission && (
          <button className="btn primary" onClick={enableMotion}>
            Включить датчики движения
          </button>
        )}
        <button className="btn outline" onClick={() => go(false)} disabled={phase === 'shaking'}>
          {picked ? 'Ещё раз' : 'Перемешать'}
        </button>
      </div>
    </div>
  );
}
