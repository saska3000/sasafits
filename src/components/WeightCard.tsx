import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fmtNum, humanDate } from '../lib/format';
import type { Profile } from '../lib/types';
import { cheer, roundKg, setWeight, useWeights, weightAt, weightProgress, type WeightProgress } from '../lib/weight';
import { IconFlower, IconScale } from './Icons';
import { GoalSheet, WeightSheet } from './WeightSheet';
import { ForestTrail } from './WeightViz';

/** «−1,6 кг с начала · до цели 12,4 кг» */
export function metaText(p: WeightProgress | null): string {
  if (!p || !p.measured) return '';
  const delta = roundKg(p.current - p.start);
  const deltaText = delta === 0 ? '' : `${delta < 0 ? '−' : '+'}${fmtNum(Math.abs(delta))} кг с начала`;
  if (p.left != null) return p.left > 0 ? [deltaText, `до цели ${fmtNum(p.left)} кг`].filter(Boolean).join(' · ') : 'Цель достигнута';
  return deltaText;
}

/**
 * Карточка веса: цветочная тропинка от старта к цели и счётчик «−» / «+» по 100 г.
 * Показываем только настоящие взвешивания — вес из профиля за взвешивание не выдаём.
 */
export function WeightCard({ profile, date, showTrail = false }: { profile: Profile; date: string; showTrail?: boolean }) {
  const list = useWeights(profile.id);
  const [sheet, setSheet] = useState<null | 'day' | 'start' | 'target'>(null);
  if (!list) return null;

  const exact = list.find((w) => w.date === date);
  const last = weightAt(list, date);
  const shown = exact?.kg ?? last?.kg;
  const p = weightProgress(list, profile, date);

  const step = (d: number) => {
    if (shown == null) return setSheet('day');
    setWeight(profile, date, roundKg(shown + d));
  };

  return (
    <section className="card weight-card">
      <div className="meal-head">
        <div className="meal-title">
          {showTrail ? (
            <IconFlower className="meal-icon" width={22} height={22} />
          ) : (
            <IconScale className="meal-icon" width={22} height={22} />
          )}
          <span>{showTrail ? 'Путь к цели' : 'Вес'}</span>
        </div>
        {!showTrail && (
          <Link to="/progress" className="weight-link">
            Путь и график ›
          </Link>
        )}
      </div>

      {!showTrail ? null : p?.share != null ? (
        <>
          <ForestTrail
            share={p.share}
            petName={profile.petName || 'Зефирка'}
            startLabel={`старт ${fmtNum(p.start)} кг`}
            goalLabel={`цель ${fmtNum(p.target!)} кг`}
          />
          <p className="trail-cheer">{cheer(p)}</p>
        </>
      ) : (
        <p className="muted small trail-setup">
          Впишите, с какого веса вы начинали и какой хотите, — появится тропинка через цветочную поляну к цели.
        </p>
      )}

      <div className="weight-row">
        <button className="weight-step" aria-label="Минус 100 граммов" onClick={() => step(-0.1)}>
          −
        </button>
        <button className="weight-value" onClick={() => setSheet('day')} aria-label="Вписать вес">
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
          ? 'Взвесьтесь утром натощак и впишите вес — это будет первое взвешивание.'
          : !exact
            ? `За ${humanDate(date).toLowerCase()} записи нет, последний раз — ${humanDate(last!.date).toLowerCase()}. Нажмите «−» или «+», чтобы записать.`
            : metaText(p) || 'Записано'}
      </div>

      <div className="weight-goals">
        <button onClick={() => setSheet('start')}>
          старт <b>{profile.startWeightKg != null ? `${fmtNum(profile.startWeightKg)} кг` : 'вписать'}</b>
        </button>
        <button onClick={() => setSheet('target')}>
          цель <b>{profile.targetWeightKg != null ? `${fmtNum(profile.targetWeightKg)} кг` : 'вписать'}</b>
        </button>
      </div>

      {sheet === 'day' && <WeightSheet profile={profile} date={date} initial={shown} exists={!!exact} onClose={() => setSheet(null)} />}
      {(sheet === 'start' || sheet === 'target') && <GoalSheet profile={profile} kind={sheet} onClose={() => setSheet(null)} />}
    </section>
  );
}
