import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AmountSheet } from '../components/AmountSheet';
import { EntryFixSheet } from '../components/EntryFixSheet';
import { PetCard } from '../components/PetCard';
import { WeightCard } from '../components/WeightCard';
import { IconChevronLeft, IconChevronRight, IconPlus, IconWarn, MealIcon } from '../components/Icons';
import { MacroBar, Ring, TopBar, toast } from '../components/ui';
import { amountText, deleteEntry, entryMacros, restoreEntry, updateEntry, useDayEntries } from '../lib/diary';
import { addDays, fmtG, fmtKcal, humanDate, isValidDateStr, todayStr } from '../lib/format';
import { MEALS, sum } from '../lib/nutrition';
import { useCurrentProfile } from '../lib/profiles';
import { conflicts } from '../lib/restrictions';
import type { DiaryEntry } from '../lib/types';

export function DiaryScreen() {
  const profile = useCurrentProfile();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const d = params.get('d');
  const date = isValidDateStr(d) ? d : todayStr();
  const entries = useDayEntries(profile.id, date);
  const [editing, setEditing] = useState<DiaryEntry | null>(null);
  const [fixing, setFixing] = useState<DiaryEntry | null>(null);

  const goDay = (n: number) => setParams({ d: addDays(date, n) }, { replace: true });
  const setDate = (v: string) => isValidDateStr(v) && setParams({ d: v }, { replace: true });

  // Смахивание влево/вправо — соседний день
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (editing || fixing) return;
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) goDay(dx < 0 ? 1 : -1);
  };

  const total = sum((entries ?? []).map(entryMacros));
  const g = profile.goals;
  const isToday = date === todayStr();

  return (
    <div className="screen" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TopBar
        title={
          <div className="datenav">
            <button className="icon-btn" aria-label="Предыдущий день" onClick={() => goDay(-1)}>
              <IconChevronLeft />
            </button>
            <label className="datenav-label">
              {humanDate(date)}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker?.();
                  } catch {
                    /* старый браузер — откроется сам */
                  }
                }}
                aria-label="Выбрать дату"
              />
            </label>
            <button className="icon-btn" aria-label="Следующий день" onClick={() => goDay(1)}>
              <IconChevronRight />
            </button>
          </div>
        }
      />

      <main className="content">
        {!isToday && (
          <button className="today-pill" onClick={() => setParams({}, { replace: true })}>
            Вернуться к сегодня
          </button>
        )}

        <section className="card summary">
          <div className="summary-top">
            <Ring value={total.kcal} goal={g.kcal} />
            <div className="summary-nums">
              <div>
                <div className="summary-big">{fmtKcal(total.kcal)}</div>
                <div className="muted small">съедено, ккал</div>
              </div>
              <div>
                <div className="summary-big muted-strong">{fmtKcal(g.kcal)}</div>
                <div className="muted small">норма, ккал</div>
              </div>
            </div>
          </div>
          <div className="macros">
            <MacroBar label="Белки" value={total.p} goal={g.p} color="var(--protein)" />
            <MacroBar label="Жиры" value={total.f} goal={g.f} color="var(--fat)" />
            <MacroBar label="Углеводы" value={total.c} goal={g.c} color="var(--carbs)" />
          </div>
        </section>

        <PetCard profile={profile} date={date} entries={entries} kcal={total.kcal} />

        {MEALS.map((meal) => {
          const list = (entries ?? []).filter((e) => e.meal === meal.id);
          const mt = sum(list.map(entryMacros));
          return (
            <section className="card meal" key={meal.id}>
              <div className="meal-head">
                <div className="meal-title">
                  <MealIcon meal={meal.id} className="meal-icon" width={22} height={22} />
                  <span>{meal.label}</span>
                </div>
                <div className="meal-kcal">{list.length > 0 && <>{fmtKcal(mt.kcal)} ккал</>}</div>
              </div>
              {list.length > 0 && (
                <>
                  <div className="meal-macros muted small">
                    Б {fmtG(mt.p)} · Ж {fmtG(mt.f)} · У {fmtG(mt.c)}
                  </div>
                  <ul className="entries">
                    {list.map((e) => {
                      const m = entryMacros(e);
                      const bad = conflicts(e.tags, profile.restrictions).length > 0;
                      return (
                        <li key={e.id}>
                          <button className="entry" onClick={() => setEditing(e)}>
                            <div className="entry-main">
                              <div className="entry-name">
                                {bad && <IconWarn className="warn-icon" width={16} height={16} />}
                                {e.name}
                              </div>
                              <div className="muted small">{amountText(e)}</div>
                            </div>
                            <div className="entry-kcal">{fmtKcal(m.kcal)}</div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              <button className="add-btn" onClick={() => navigate(`/add?d=${date}&meal=${meal.id}`)}>
                <IconPlus width={20} height={20} /> Добавить
              </button>
            </section>
          );
        })}

        <WeightCard profile={profile} date={date} />
      </main>

      {editing && (
        <AmountSheet
          open
          onClose={() => setEditing(null)}
          name={editing.name}
          per100={editing.per100}
          servings={editing.servings}
          tags={editing.tags}
          initial={editing}
          onlyServings={editing.refType === 'recipe'}
          onEdit={
            editing.refType === 'food'
              ? () => {
                  setFixing(editing);
                  setEditing(null);
                }
              : undefined
          }
          meal={editing.meal}
          submitLabel="Сохранить"
          onSubmit={async (r) => {
            await updateEntry(editing.id, { amount: r.amount, unitLabel: r.unit.label, unitGrams: r.unit.grams, meal: r.meal });
            setEditing(null);
          }}
          onDelete={async () => {
            const id = editing.id;
            await deleteEntry(id);
            setEditing(null);
            toast('Удалено', { label: 'Отменить', run: () => restoreEntry(id) });
          }}
        />
      )}
      {fixing && <EntryFixSheet entry={fixing} onClose={() => setFixing(null)} />}
    </div>
  );
}
