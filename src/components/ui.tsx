import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { fmtG, fmtKcal } from '../lib/format';
import { useProfiles } from '../lib/profiles';
import type { Macros } from '../lib/types';
import { IconApple, IconBook, IconChart, IconChevronLeft, IconPot, IconX } from './Icons';

/* ---------- Шапка экрана ---------- */

/** Назад по истории, а если истории нет (открыли по ссылке) — на указанный экран */
export function useGoBack() {
  const navigate = useNavigate();
  return (fallback = '/', steps = 1) => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx >= steps) navigate(-steps);
    else navigate(fallback, { replace: true });
  };
}

export function TopBar({ title, back, right }: { title: ReactNode; back?: boolean | string; right?: ReactNode }) {
  const goBack = useGoBack();
  return (
    <header className="topbar">
      {back ? (
        <button
          className="icon-btn"
          aria-label="Назад"
          onClick={() => goBack(typeof back === 'string' ? back : '/')}
        >
          <IconChevronLeft />
        </button>
      ) : (
        <span className="topbar-spacer" />
      )}
      <div className="topbar-title">{title}</div>
      {right ?? <ProfileButton />}
    </header>
  );
}

export function ProfileButton() {
  const { current } = useProfiles();
  if (!current) return <span className="topbar-spacer" />;
  return (
    <Link to="/profile" className="avatar" aria-label="Профиль">
      {current.name.slice(0, 1).toUpperCase()}
    </Link>
  );
}

/* ---------- Нижнее меню ---------- */

export function TabBar() {
  const tabs = [
    { to: '/', label: 'Дневник', icon: <IconBook /> },
    { to: '/products', label: 'Продукты', icon: <IconApple /> },
    { to: '/recipes', label: 'Рецепты', icon: <IconPot /> },
    { to: '/progress', label: 'Прогресс', icon: <IconChart /> },
  ];
  return (
    <nav className="tabbar">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          {t.icon}
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/* ---------- Кольцо калорий ---------- */

export function Ring({ value, goal, size = 132 }: { value: number; goal: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = goal > 0 ? value / goal : 0;
  const over = ratio > 1;
  const shown = Math.min(ratio, 1);
  const left = goal - value;
  const gradId = 'ring' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeOpacity={shown > 0 ? 1 : 0}
          stroke={over ? 'var(--pink)' : `url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * shown} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray .4s ease' }}
        />
      </svg>
      <div className="ring-center">
        <div className="ring-num">{fmtKcal(Math.abs(left))}</div>
        <div className="ring-cap">{left >= 0 ? 'осталось' : 'перебор'}</div>
      </div>
    </div>
  );
}

/* ---------- Полоска БЖУ ---------- */

export function MacroBar({ label, value, goal, color }: { label: string; value: number; goal: number; color: string }) {
  const ratio = goal > 0 ? Math.min(value / goal, 1) : 0;
  const over = goal > 0 && value > goal * 1.05;
  return (
    <div className="macro">
      <div className="macro-head">
        <span>{label}</span>
        <span className={over ? 'over' : ''}>
          {fmtG(value)} <span className="muted">/ {Math.round(goal)} г</span>
        </span>
      </div>
      <div className="bar">
        <div className="bar-fill" style={{ width: `${ratio * 100}%`, background: color }} />
      </div>
    </div>
  );
}

/** Короткая строка БЖУ: «Б 12 · Ж 4 · У 30» */
export function MacroLine({ m }: { m: Macros }) {
  return (
    <span className="macro-line">
      <span className="dot p" />Б {fmtG(m.p)} <span className="dot f" />Ж {fmtG(m.f)} <span className="dot c" />У {fmtG(m.c)}
    </span>
  );
}

/* ---------- Нижняя шторка (модальное окно) ---------- */

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="sheet-title">{title}</div>
          <button className="icon-btn" aria-label="Закрыть" onClick={onClose}>
            <IconX />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Всплывающее сообщение ---------- */

type ToastMsg = { id: number; text: string; action?: { label: string; run: () => void } };
let pushToast: ((t: Omit<ToastMsg, 'id'>) => void) | null = null;

export function toast(text: string, action?: ToastMsg['action']) {
  pushToast?.({ text, action });
}

export function ToastHost() {
  const [msg, setMsg] = useState<ToastMsg | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    pushToast = (t) => {
      window.clearTimeout(timer.current);
      setMsg({ ...t, id: Date.now() });
      timer.current = window.setTimeout(() => setMsg(null), t.action ? 5000 : 2200);
    };
    return () => {
      pushToast = null;
    };
  }, []);
  if (!msg) return null;
  return (
    <div className="toast" key={msg.id} role="status">
      <span>{msg.text}</span>
      {msg.action && (
        <button
          className="toast-action"
          onClick={() => {
            msg.action!.run();
            setMsg(null);
          }}
        >
          {msg.action.label}
        </button>
      )}
    </div>
  );
}

/* ---------- Пустое состояние ---------- */

export function Empty({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      {icon && <div className="empty-icon">{icon}</div>}
      <div className="empty-title">{title}</div>
      {children && <div className="empty-text">{children}</div>}
    </div>
  );
}
