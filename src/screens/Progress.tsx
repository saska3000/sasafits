import { useState } from 'react';
import { WeightCard, metaText } from '../components/WeightCard';
import { WeightSheet } from '../components/WeightSheet';
import { WeightChart } from '../components/WeightViz';
import { TopBar } from '../components/ui';
import { entryMacros, useProfileEntries } from '../lib/diary';
import { addDays, fmtKcal, fmtNum, humanDate, plural, todayStr } from '../lib/format';
import { sum } from '../lib/nutrition';
import { useCurrentProfile } from '../lib/profiles';
import type { DiaryEntry, Profile } from '../lib/types';
import { useWeights, weightProgress } from '../lib/weight';

/** Среднее за последние n дней — только по дням, где что-то записано */
function average(entries: DiaryEntry[], days: number) {
  const from = addDays(todayStr(), -(days - 1));
  const byDay = new Map<string, DiaryEntry[]>();
  for (const e of entries) {
    if (e.deleted || e.date < from || e.date > todayStr()) continue;
    byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);
  }
  if (!byDay.size) return null;
  const totals = [...byDay.values()].map((list) => sum(list.map(entryMacros)));
  const t = sum(totals);
  return { days: byDay.size, kcal: t.kcal / byDay.size, p: t.p / byDay.size };
}

function AvgRow({ title, a, profile, days }: { title: string; a: ReturnType<typeof average>; profile: Profile; days: number }) {
  return (
    <div className="avg-row">
      <div className="avg-title">{title}</div>
      {a ? (
        <>
          <div className="avg-nums">
            <span>
              <b>{fmtKcal(a.kcal)}</b> ккал
            </span>
            <span>
              белок <b>{fmtNum(a.p, 0)}</b> г
            </span>
          </div>
          <div className="muted small">
            в день, по {a.days} {plural(a.days, 'дню', 'дням', 'дням')} из {days} · норма {fmtKcal(profile.goals.kcal)} ккал и{' '}
            {fmtNum(profile.goals.p, 0)} г белка
          </div>
        </>
      ) : (
        <div className="muted small">Пока нет записей</div>
      )}
    </div>
  );
}

export function ProgressScreen() {
  const profile = useCurrentProfile();
  const list = useWeights(profile.id);
  const entries = useProfileEntries(profile.id);
  const [sheet, setSheet] = useState<{ date: string; kg?: number; exists: boolean } | null>(null);
  if (!list) return null;

  const p = weightProgress(list, profile);
  const today = todayStr();

  return (
    <div className="screen">
      <TopBar title="Прогресс" />
      <main className="content">
        {/* Лесная тропа к цели и тот же счётчик веса, что на главной */}
        <WeightCard profile={profile} date={today} showTrail />

        {list.length >= 1 && (
          <section className="card">
            <div className="meal-head">
              <h2 className="card-title">График веса</h2>
              <span className="muted small">{metaText(p)}</span>
            </div>
            <WeightChart list={list} target={profile.targetWeightKg} />
          </section>
        )}

        <section className="card">
          <h2 className="card-title">Питание в среднем</h2>
          {entries && (
            <>
              <AvgRow title="За неделю" a={average(entries, 7)} profile={profile} days={7} />
              <AvgRow title="За месяц" a={average(entries, 30)} profile={profile} days={30} />
            </>
          )}
        </section>

        {list.length > 0 && (
          <section className="card">
            <h2 className="card-title">Взвешивания</h2>
            <ul className="weight-history">
              {[...list].reverse().map((w, i, arr) => {
                const prev = arr[i + 1];
                const d = prev ? Math.round((w.kg - prev.kg) * 10) / 10 : 0;
                return (
                  <li key={w.id}>
                    <button className="entry" onClick={() => setSheet({ date: w.date, kg: w.kg, exists: true })}>
                      <span>{humanDate(w.date)}</span>
                      <span className="weight-hist-kg">
                        {prev && d !== 0 && (
                          <span className={d < 0 ? 'delta down' : 'delta up'}>
                            {d < 0 ? '−' : '+'}
                            {fmtNum(Math.abs(d))}
                          </span>
                        )}
                        <b>{fmtNum(w.kg)} кг</b>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
      {sheet && (
        <WeightSheet profile={profile} date={sheet.date} initial={sheet.kg} exists={sheet.exists} onClose={() => setSheet(null)} />
      )}
    </div>
  );
}
