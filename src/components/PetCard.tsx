import { useEffect, useState } from 'react';
import { addDays, plural, todayStr } from '../lib/format';
import { celebrateSay, petHour, petMood, petSay, recordVisit, streak, takeCelebration, useVisits, type Celebration } from '../lib/pet';
import { useProfiles } from '../lib/profiles';
import type { DiaryEntry, Profile } from '../lib/types';
import { PetPhoto } from './PetPhoto';
import { Sheet, toast } from './ui';

const DEFAULT_NAME = 'Зефирка';
const PETALS = ['#ffffff', '#f7c6d4', '#e7d8f6', '#fbe7a8', '#fde1ea', '#d9ecf5'];

/** Цветок: распускается за несколько дней — бутон → приоткрылся → цветёт */
function Flower({ x, age, color, fresh }: { x: number; age: number; color: string; fresh: boolean }) {
  const h = 26 + (Math.round(x) % 3) * 4;
  const stage = Math.min(age, 2);
  return (
    // анимация роста — на внутренней группе, чтобы не сбить сдвиг цветка на его место
    <g transform={`translate(${x} 64)`}>
      <g className={fresh ? 'sprout' : ''}>
        <path d={`M0 0 q-2 ${-h / 2} 0 ${-h}`} fill="none" stroke="#7fb89a" strokeWidth={1.8} strokeLinecap="round" />
        <path d={`M0 ${-h * 0.4} q-8 -2 -10 -8 q7 0 10 6z`} fill="#9fd0ae" />
        <g transform={`translate(0 ${-h})`}>
          {stage === 0 && <path d="M0 2 q-5 -6 0 -12 q5 6 0 12z" fill={color} stroke="#e7a3b8" strokeWidth={0.8} />}
          {stage === 1 &&
            [-30, 0, 30].map((r) => (
              <ellipse key={r} cx={0} cy={-5} rx={3.2} ry={6} transform={`rotate(${r})`} fill={color} stroke="#e7a3b8" strokeWidth={0.7} />
            ))}
          {stage === 2 && (
            <>
              {[0, 72, 144, 216, 288].map((r) => (
                <ellipse
                  key={r}
                  cx={0}
                  cy={-5}
                  rx={3.8}
                  ry={6}
                  transform={`rotate(${r})`}
                  fill={color}
                  stroke="#e7a3b8"
                  strokeWidth={0.7}
                />
              ))}
              <circle r={2.8} fill="#f2d36b" />
            </>
          )}
        </g>
      </g>
    </g>
  );
}

function Garden({ dates, freshToday }: { dates: string[]; freshToday: boolean }) {
  const today = todayStr();
  const recent = dates.slice(-10);
  const n = recent.length;
  return (
    <svg className="garden" viewBox="0 0 320 72" role="img" aria-label={`Сад: ${n} ${plural(n, 'цветок', 'цветка', 'цветков')}`}>
      <path d="M0 72 V62 Q80 52 160 58 T320 60 V72z" fill="var(--garden-ground)" />
      {recent.map((d, i) => {
        let age = 0;
        for (let x = d; x < today && age < 3; x = addDays(x, 1)) age++;
        const x = n === 1 ? 160 : 22 + (i * 276) / Math.max(1, n - 1);
        let h = 0;
        for (const ch of d) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
        return <Flower key={d} x={x} age={age} color={PETALS[h % PETALS.length]} fresh={freshToday && d === today} />;
      })}
    </svg>
  );
}

export function PetCard({
  profile,
  date,
  entries,
  kcal,
}: {
  profile: Profile;
  date: string;
  entries: DiaryEntry[] | undefined;
  kcal: number;
}) {
  const visits = useVisits(profile.id);
  const { updateProfile } = useProfiles();
  const [freshToday, setFreshToday] = useState(false);
  const [celebrate, setCelebrate] = useState<Celebration | null>(null);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  // раз в минуту сверяемся с часами — в 10, 15 и 20 питомица проголодается
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  // Сегодня зашли — в саду появляется бутон
  useEffect(() => {
    recordVisit(profile.id).then((fresh) => fresh && setFreshToday(true));
  }, [profile.id]);

  // Только что покормили (записали еду) — радуется пару секунд, потом снова обычная
  useEffect(() => {
    if (!entries) return;
    const kind = takeCelebration(profile.id, date);
    if (kind) {
      setCelebrate(kind);
      const t = window.setTimeout(() => setCelebrate(null), kind === 'day' ? 3600 : 2800);
      return () => window.clearTimeout(t);
    }
  }, [entries, profile.id, date]);

  if (!entries || !visits) return null;
  const petName = profile.petName || DEFAULT_NAME;
  const hour = petHour(date, now);
  const mood = celebrate ? 'joy' : petMood(entries, kcal, profile.goals.kcal, hour);
  const days = streak(visits);

  return (
    <section className="card pet-card">
      <div className="pet-top">
        <PetPhoto mood={mood} celebrate={!!celebrate} name={petName} />
        <div className="pet-talk">
          <div className={'pet-bubble' + (celebrate ? ' pop' : '')}>
            {celebrate ? celebrateSay(celebrate) : petSay(mood, entries, hour)}
          </div>
          <button
            className="pet-name"
            onClick={() => {
              setName(petName);
              setNaming(true);
            }}
          >
            {petName}
          </button>
        </div>
      </div>

      <Garden dates={visits} freshToday={freshToday} />
      <div className="muted small center">
        {days > 0 ? `${days} ${plural(days, 'день', 'дня', 'дней')} подряд` : 'Заходи каждый день'} · за каждый день — новый цветок
      </div>

      {naming && (
        <Sheet open onClose={() => setNaming(false)} title="Как зовут питомицу?">
          <label className="field">
            <span>Имя</span>
            <input className="input" autoFocus value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          </label>
          <button
            className="btn primary"
            onClick={async () => {
              await updateProfile(profile.id, {
                petName: name.trim() || undefined,
              });
              toast('Имя сохранено');
              setNaming(false);
            }}
          >
            Сохранить
          </button>
        </Sheet>
      )}
    </section>
  );
}
