import { useRef, useState, type ReactNode } from 'react';
import { IconHeart, IconX } from './Icons';

export type SwipeDir = 'left' | 'right';

interface Props<T> {
  items: T[];
  keyOf: (item: T) => string;
  render: (item: T) => ReactNode;
  onSwipe: (item: T, dir: SwipeDir) => void;
}

const THRESHOLD = 90;

/** Колода карточек: тянем вправо — нравится, влево — нет */
export function SwipeDeck<T>({ items, keyOf, render, onSwipe }: Props<T>) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [leaving, setLeaving] = useState<SwipeDir | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const top = items[0];
  const next = items[1];

  const fly = (dir: SwipeDir) => {
    if (!top || leaving) return;
    setLeaving(dir);
    window.setTimeout(() => {
      onSwipe(top, dir);
      setLeaving(null);
      setDrag({ x: 0, y: 0, active: false });
    }, 230);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (leaving) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true });
  };
  const onPointerUp = () => {
    if (!start.current) return;
    start.current = null;
    if (drag.x > THRESHOLD) fly('right');
    else if (drag.x < -THRESHOLD) fly('left');
    else setDrag({ x: 0, y: 0, active: false });
  };

  if (!top) return null;

  const x = leaving ? (leaving === 'right' ? 1 : -1) * window.innerWidth * 1.2 : drag.x;
  const y = leaving ? drag.y : drag.y * 0.25;
  const rot = x / 18;
  const like = Math.max(0, Math.min(1, x / THRESHOLD));
  const nope = Math.max(0, Math.min(1, -x / THRESHOLD));

  return (
    <div className="deck">
      <div className="deck-stack">
        {next && (
          <div className="swipe-card behind" key={keyOf(next)} style={{ transform: `scale(${0.94 + Math.min(Math.abs(x) / 2000, 0.06)})` }}>
            {render(next)}
          </div>
        )}
        <div
          className="swipe-card"
          key={keyOf(top)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
            transition: drag.active && !leaving ? 'none' : 'transform .23s ease',
          }}
        >
          {render(top)}
          <div className="stamp like" style={{ opacity: like }}>
            ХОЧУ
          </div>
          <div className="stamp nope" style={{ opacity: nope }}>
            НЕТ
          </div>
        </div>
      </div>
      <div className="deck-buttons">
        <button className="deck-btn nope" aria-label="Не хочу" onClick={() => fly('left')}>
          <IconX width={30} height={30} />
        </button>
        <button className="deck-btn like" aria-label="Хочу" onClick={() => fly('right')}>
          <IconHeart filled width={30} height={30} />
        </button>
      </div>
    </div>
  );
}
