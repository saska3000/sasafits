import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TopBar, toast } from '../components/ui';
import { exportBackup, importBackup } from '../lib/backup';
import { fmtNum, parseNum } from '../lib/format';
import { ACTIVITY_LEVELS, GOAL_TYPES, calcGoals } from '../lib/nutrition';
import { useCurrentProfile, useProfiles } from '../lib/profiles';
import { ALL_TAGS, TAG_LABELS } from '../lib/restrictions';
import { applyTheme, getTheme, type ThemeMode } from '../lib/theme';
import type { GoalType, Profile, Tag } from '../lib/types';

interface Draft {
  name: string;
  sex: '' | 'f' | 'm';
  age: string;
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  activity: number;
  goalType: GoalType;
  kcal: string;
  p: string;
  f: string;
  c: string;
  restrictions: Tag[];
  portionFactor: number;
}

const s = (n?: number) => (n == null ? '' : fmtNum(n));

function toDraft(p: Profile): Draft {
  return {
    name: p.name,
    sex: p.sex ?? '',
    age: s(p.age),
    heightCm: s(p.heightCm),
    weightKg: s(p.weightKg),
    targetWeightKg: s(p.targetWeightKg),
    activity: p.activity,
    goalType: p.goalType,
    kcal: s(p.goals.kcal),
    p: s(p.goals.p),
    f: s(p.goals.f),
    c: s(p.goals.c),
    restrictions: p.restrictions,
    portionFactor: p.portionFactor ?? 1,
  };
}

const opt = (x: string) => {
  const n = parseNum(x);
  return x.trim() && n > 0 ? n : undefined;
};

export function ProfileScreen() {
  const profile = useCurrentProfile();
  const { profiles, setCurrent, updateProfile } = useProfiles();
  const [draft, setDraft] = useState<Draft>(() => toDraft(profile));
  const [theme, setTheme] = useState<ThemeMode>(getTheme);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(toDraft(profile));
    // Сбрасываем черновик только при смене профиля
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(profile));

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const bind = (k: keyof Draft) => ({
    value: draft[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value as never),
  });

  const calc = calcGoals({
    sex: draft.sex || undefined,
    age: opt(draft.age),
    heightCm: opt(draft.heightCm),
    weightKg: opt(draft.weightKg),
    activity: draft.activity,
    goalType: draft.goalType,
  });

  const applyCalc = () => {
    if (!calc) return;
    setDraft((d) => ({ ...d, kcal: s(calc.goals.kcal), p: s(calc.goals.p), f: s(calc.goals.f), c: s(calc.goals.c) }));
    toast('Норма подставлена — не забудьте сохранить');
  };

  const save = async () => {
    const goals = { kcal: parseNum(draft.kcal), p: parseNum(draft.p), f: parseNum(draft.f), c: parseNum(draft.c) };
    if (!draft.name.trim()) return toast('Напишите имя');
    if (!Object.values(goals).every((x) => x >= 0) || !(goals.kcal > 0)) return toast('Проверьте норму: нужны числа');
    await updateProfile(profile.id, {
      name: draft.name.trim(),
      sex: draft.sex || undefined,
      age: opt(draft.age),
      heightCm: opt(draft.heightCm),
      weightKg: opt(draft.weightKg),
      targetWeightKg: opt(draft.targetWeightKg),
      activity: draft.activity,
      goalType: draft.goalType,
      goals,
      restrictions: draft.restrictions,
      portionFactor: draft.portionFactor,
    });
    toast('Сохранено');
  };

  const toggleTag = (t: Tag) =>
    set('restrictions', draft.restrictions.includes(t) ? draft.restrictions.filter((x) => x !== t) : [...draft.restrictions, t]);

  const pickTheme = (m: ThemeMode) => {
    setTheme(m);
    applyTheme(m);
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const n = await importBackup(file);
      toast(`Готово: загружено записей — ${n}`);
    } catch (err) {
      toast((err as Error).message);
    }
  };

  return (
    <div className="screen">
      <TopBar back title="Профиль" right={<span className="topbar-spacer" />} />
      <main className="content form">
        <section className="card">
          <div className="label">Кто сейчас пользуется</div>
          <div className="segmented">
            {profiles.map((p) => (
              <button
                key={p.id}
                className={p.id === profile.id ? 'active' : ''}
                onClick={() => {
                  if (dirty && !confirm('Есть несохранённые изменения. Переключиться без сохранения?')) return;
                  setCurrent(p.id);
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="muted small">У каждого свой дневник. Продукты общие.</div>
        </section>

        <section className="card">
          <h2>Обо мне</h2>
          <label className="field">
            <span>Имя</span>
            <input className="input" {...bind('name')} />
          </label>
          <div className="label">Пол (нужен для формулы)</div>
          <div className="segmented">
            <button className={draft.sex === 'f' ? 'active' : ''} onClick={() => set('sex', 'f')}>
              Женский
            </button>
            <button className={draft.sex === 'm' ? 'active' : ''} onClick={() => set('sex', 'm')}>
              Мужской
            </button>
          </div>
          <div className="grid2">
            <label className="field">
              <span>Возраст</span>
              <input className="input" inputMode="numeric" {...bind('age')} />
            </label>
            <label className="field">
              <span>Рост, см</span>
              <input className="input" inputMode="decimal" {...bind('heightCm')} />
            </label>
            <label className="field">
              <span>Вес сейчас, кг</span>
              <input className="input" inputMode="decimal" {...bind('weightKg')} />
            </label>
            <label className="field">
              <span>Цель, кг</span>
              <input className="input" inputMode="decimal" {...bind('targetWeightKg')} />
            </label>
          </div>
          <label className="field">
            <span>Активность</span>
            <select className="input" value={draft.activity} onChange={(e) => set('activity', Number(e.target.value))}>
              {ACTIVITY_LEVELS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label} — {a.hint}
                </option>
              ))}
            </select>
          </label>
          <div className="label">Цель</div>
          <div className="segmented">
            {GOAL_TYPES.map((g) => (
              <button key={g.value} className={draft.goalType === g.value ? 'active' : ''} onClick={() => set('goalType', g.value)}>
                {g.label}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Норма на день</h2>
          <div className="grid4">
            <label className="field">
              <span>Ккал</span>
              <input className="input" inputMode="decimal" {...bind('kcal')} />
            </label>
            <label className="field">
              <span>Белки</span>
              <input className="input" inputMode="decimal" {...bind('p')} />
            </label>
            <label className="field">
              <span>Жиры</span>
              <input className="input" inputMode="decimal" {...bind('f')} />
            </label>
            <label className="field">
              <span>Углев.</span>
              <input className="input" inputMode="decimal" {...bind('c')} />
            </label>
          </div>

          <div className="calc">
            {calc ? (
              <>
                <div className="small">
                  <b>По формуле Миффлина–Сан Жеора:</b> {calc.goals.kcal} ккал · Б {calc.goals.p} · Ж {calc.goals.f} · У {calc.goals.c}
                </div>
                <div className="muted small">
                  Обмен в покое {calc.bmr} ккал, с активностью {calc.tdee} ккал. Белок — по весу тела, жиры — 28 % калорий, углеводы — остальное.
                </div>
                <button className="btn outline small" onClick={applyCalc}>
                  Подставить в норму
                </button>
              </>
            ) : (
              <div className="muted small">Укажите пол, возраст, рост и вес — и приложение посчитает норму само.</div>
            )}
          </div>
        </section>

        <section className="card">
          <h2>Размер моей порции</h2>
          <div className="chips">
            {[0.8, 1, 1.2, 1.5].map((f) => (
              <button key={f} className={'chip' + (draft.portionFactor === f ? ' active' : '')} onClick={() => set('portionFactor', f)}>
                ×{fmtNum(f, 1)}
              </button>
            ))}
          </div>
          <div className="muted small">
            Для рецептов: ×1 — порция как у Саши в вашем меню, ×1,2 — как у парня (чуть больше мяса и гарнира).
          </div>
        </section>

        <section className="card">
          <h2>Мне нельзя</h2>
          <div className="chips">
            {ALL_TAGS.map((t) => (
              <button key={t} className={'chip' + (draft.restrictions.includes(t) ? ' active warn-chip' : '')} onClick={() => toggleTag(t)}>
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>
          <div className="muted small">Если продукт с такой меткой — при добавлении появится предупреждение.</div>
        </section>

        <section className="card">
          <h2>Оформление</h2>
          <div className="segmented">
            {(
              [
                ['auto', 'Авто'],
                ['light', 'Светлая'],
                ['dark', 'Тёмная'],
              ] as [ThemeMode, string][]
            ).map(([m, label]) => (
              <button key={m} className={theme === m ? 'active' : ''} onClick={() => pickTheme(m)}>
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Мои данные</h2>
          <p className="muted small">
            Сейчас всё хранится только на этом устройстве. Синхронизация между телефонами и компьютером появится позже, а пока можно
            сохранить копию в файл.
          </p>
          <div className="stack">
            <button className="btn outline" onClick={() => exportBackup().catch((e) => toast((e as Error).message))}>
              Сохранить копию в файл
            </button>
            <button className="btn outline" onClick={() => fileRef.current?.click()}>
              Загрузить из файла
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
          </div>
        </section>

        <div className="muted small center">
          SasaFits · версия {__APP_VERSION__} ·{' '}
          <Link to="/credits" className="link">
            авторы фото
          </Link>
        </div>
      </main>

      {dirty && (
        <div className="savebar">
          <button className="btn outline" onClick={() => setDraft(toDraft(profile))}>
            Отменить
          </button>
          <button className="btn primary grow" onClick={save}>
            Сохранить
          </button>
        </div>
      )}
    </div>
  );
}
