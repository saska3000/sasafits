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

// Места на «столе»: левый верх угла фигуры (в % от сцены) и наклон
const SLOTS = [
  { x: 2, y: 1, r: -10 },
  { x: 55, y: 0, r: 8 },
  { x: 29, y: 29, r: -3 },
  { x: 0, y: 56, r: 9 },
  { x: 56, y: 54, r: -8 },
];

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/* ---------- Встряхивание ---------- */

type MotionCtor = { requestPermission?: () => Promise<'granted' | 'denied'> };
const motionApi = () => (typeof window !== 'undefined' ? (window.DeviceMotionEvent as unknown as MotionCtor | undefined) : undefined);

function useShake(onShake: () => void, enabled: boolean) {
  const cb = useRef(onShake);
  cb.current = onShake;
  useEffect(() => {
    if (!enabled) return;
    let prev: { x: number; y: number; z: number } | null = null;
    let last = 0;
    const h = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const cur = { x: a.x ?? 0, y: a.y ?? 0, z: a.z ?? 0 };
      if (prev) {
        const d = Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y) + Math.abs(cur.z - prev.z);
        const now = Date.now();
        if (d > 26 && now - last > 1400) {
          last = now;
          cb.current();
        }
      }
      prev = cur;
    };
    window.addEventListener('devicemotion', h);
    return () => window.removeEventListener('devicemotion', h);
  }, [enabled]);
}

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
  const needsPermission = typeof motionApi()?.requestPermission === 'function';
  const [motionOn, setMotionOn] = useState(!needsPermission && !!motionApi());
  const [shown, setShown] = useState<SurpriseCard[]>(() => shuffle(cards).slice(0, 5));
  const [slots, setSlots] = useState(() => SLOTS.map((s) => ({ ...s })));
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'picked'>('idle');
  const [winner, setWinner] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const go = useCallback(() => {
    if (phase === 'shaking' || cards.length === 0) return;
    timers.current.forEach(clearTimeout);
    // Новые блюда на фигурках, и обязательно с победителем среди них
    const pool = shuffle(cards).slice(0, Math.min(5, cards.length));
    setShown(pool);
    setWinner(null);
    setPhase('shaking');
    const jumble = () => setSlots(shuffle(SLOTS).map((s) => ({ ...s, r: s.r + (Math.random() * 30 - 15) })));
    jumble();
    timers.current.push(window.setTimeout(jumble, 320), window.setTimeout(jumble, 640));
    timers.current.push(
      window.setTimeout(() => {
        setWinner(Math.floor(Math.random() * pool.length));
        setPhase('picked');
      }, 1000),
    );
  }, [cards, phase]);

  useShake(go, motionOn && phase !== 'shaking');

  const enableMotion = async () => {
    try {
      const res = await motionApi()?.requestPermission?.();
      if (res === 'granted') {
        setMotionOn(true);
        toast('Готово — встряхните телефон');
      } else toast('Без разрешения встряхивание не работает — нажмите «Перемешать»');
    } catch {
      toast('Не получилось включить встряхивание — нажмите «Перемешать»');
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

      <div className={`shake-stage ${phase}`}>
        {shown.map((c, i) => {
          const s = slots[i];
          const isWin = picked && i === winner;
          return (
            <div
              key={c.recipe.id}
              className={'shape' + (isWin ? ' win' : '') + (picked && !isWin ? ' lose' : '')}
              style={isWin ? undefined : { left: `${s.x}%`, top: `${s.y}%`, transform: `rotate(${s.r}deg)` }}
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
          {motionOn ? 'Встряхните телефон — и выпадет блюдо, которое помещается в ваши калории.' : 'Перемешайте фигурки — и выпадет блюдо, которое помещается в ваши калории.'}
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
            Включить встряхивание
          </button>
        )}
        <button className="btn outline" onClick={go} disabled={phase === 'shaking'}>
          {picked ? 'Ещё раз' : 'Перемешать'}
        </button>
      </div>
    </div>
  );
}
