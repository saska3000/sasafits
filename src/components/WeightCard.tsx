import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fmtNum, humanDate } from '../lib/format';
import type { Profile } from '../lib/types';
import { roundKg, setWeight, useWeights, weightAt, weightProgress, type WeightProgress } from '../lib/weight';
import { WeightSheet } from './WeightSheet';

/** «−1,6 кг с начала · до цели 12,4 кг» */
export function metaText(p: WeightProgress | null): string {
  if (!p) return '';
  const delta = roundKg(p.current - p.start);
  const deltaText = delta === 0 ? '' : `${delta < 0 ? '−' : '+'}${fmtNum(Math.abs(delta))} кг с начала`;
  if (p.left != null) return p.left > 0 ? [deltaText, `до цели ${fmtNum(p.left)} кг`].filter(Boolean).join(' · ') : 'Цель достигнута 💚';
  return deltaText || 'Записано. Задайте цель в профиле — появится путь к ней.';
}

/** Карточка веса в дневнике: «−» и «+» по 100 г, сколько уже пройдено и сколько осталось */
export function WeightCard({ profile, date }: { profile: Profile; date: string }) {
  const list = useWeights(profile.id);
  const [sheet, setSheet] = useState(false);
  if (!list) return null;

  const exact = list.find((w) => w.date === date);
  const last = weightAt(list, date);
  const shown = exact?.kg ?? last?.kg ?? profile.weightKg;
  const p = weightProgress(list, profile, date);

  const step = (d: number) => {
    if (shown == null) return setSheet(true);
    setWeight(profile, date, roundKg(shown + d));
  };

  return (
    <section className="card weight-card">
      <div className="meal-head">
        <div className="meal-title">
          <span className="meal-icon">⚖️</span>
          <span>Вес</span>
        </div>
        <Link to="/progress" className="weight-link">
          Путь к цели ›
        </Link>
      </div>

      <div className="weight-row">
        <button className="weight-step" aria-label="Минус 100 граммов" onClick={() => step(-0.1)}>
          −
        </button>
        <button className="weight-value" onClick={() => setSheet(true)} aria-label="Вписать вес">
          {shown != null ? (
            <>
              <span className="weight-num">{fmtNum(shown)}</span>
              <span className="weight-unit">кг</span>
            </>
          ) : (
            <span className="weight-empty">Вписать вес</span>
          )}
        </button>
        <button className="weight-step" aria-label="Плюс 100 граммов" onClick={() => step(0.1)}>
          +
        </button>
      </div>

      <div className="weight-meta muted small">
        {shown == null
          ? 'Взвесьтесь утром натощак и впишите вес — так будет видно, как он меняется.'
          : !exact
            ? `За ${humanDate(date).toLowerCase()} ещё нет записи${last ? `, последний раз — ${humanDate(last.date).toLowerCase()}` : ''}. Нажмите «−» или «+», чтобы записать.`
            : metaText(p)}
      </div>

      {sheet && (
        <WeightSheet profile={profile} date={date} initial={shown} exists={!!exact} onClose={() => setSheet(false)} />
      )}
    </section>
  );
}
