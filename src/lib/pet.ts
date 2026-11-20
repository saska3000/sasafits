import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { addDays, todayStr } from './format';
import { haptic } from './haptics';
import type { DiaryEntry, MealType } from './types';

/* ---------- Настроение за день: питомица живёт по часам ---------- */

export type PetMood = 'hungry' | 'eating' | 'joy' | 'full' | 'sleep';

/** Когда питомица ест: завтрак в 10:00, обед в 15:00, ужин в 20:00 */
const SCHEDULE: { meal: MealType; name: string; hour: number; ask: string }[] = [
  { meal: 'breakfast', name: 'завтрак', hour: 10, ask: 'Доброе утро! Я проголодалась, хочу завтракать… Покорми меня — запиши завтрак.' },
  { meal: 'lunch', name: 'обед', hour: 15, ask: 'Я проголодалась, хочу обедать… Покорми меня — запиши обед.' },
  { meal: 'dinner', name: 'ужин', hour: 20, ask: 'Я проголодалась, хочу ужинать… Покорми меня — запиши ужин.' },
];
/** За сколько часов до еды питомица начинает голодать */
const HUNGRY_BEFORE = 1;
const hungryFrom = (s: { hour: number }) => s.hour - HUNGRY_BEFORE;

const has = (entries: DiaryEntry[], meal: MealType) => entries.some((e) => e.meal === meal && !e.deleted);
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function dayFilled(entries: DiaryEntry[]): boolean {
  return SCHEDULE.every((s) => has(entries, s.meal));
}

/**
 * Который сейчас час для питомицы: сегодня — настоящее время,
 * прошедший день — «конец дня» (24), будущий — «ещё не начался» (−1).
 */
export function petHour(date: string, now = new Date()): number {
  const today = todayStr();
  if (date < today) return 24;
  if (date > today) return -1;
  return now.getHours() + now.getMinutes() / 60;
}

/** Последний приём пищи, которого питомица уже ждёт (за час до его времени) */
function lastDue(hour: number) {
  return [...SCHEDULE].reverse().find((s) => hour >= hungryFrom(s));
}

/** Ночью питомица спит в кровати: с 23:00 до 7:00 */
export function isNight(hour: number): boolean {
  return hour >= 0 && hour < 24 && (hour >= 23 || hour < 7);
}

export function petMood(entries: DiaryEntry[], kcal: number, goal: number, hour: number): PetMood {
  if (isNight(hour)) return 'sleep';
  // весь день записан: объелась — «груша», иначе спокойная и сытая (радуется только сразу после еды)
  if (dayFilled(entries)) return kcal > goal * 1.05 ? 'full' : 'eating';
  // голодная — за час до еды, пока её не записали; поела — снова обычная
  const due = lastDue(hour);
  if (due && !has(entries, due.meal)) return 'hungry';
  return 'eating';
}

/** Что говорит питомица: сегодня — по часам, за прошлые дни — вспоминает */
export function petSay(mood: PetMood, entries: DiaryEntry[], hour: number): string {
  if (hour < 0) return 'Этот день ещё впереди — я подожду.';
  const filled = dayFilled(entries);
  if (hour >= 24) {
    if (mood === 'full') return 'В этот день я немножко объелась.';
    if (filled) return 'В этот день я была сытая и довольная.';
    return 'В этот день меня покормили не полностью.';
  }
  if (mood === 'sleep') {
    if (hour >= 23)
      return filled ? 'Спокойной ночи! Я сытая — сплю до утра.' : 'Спокойной ночи… Если ещё что-то ела — запиши, я поем во сне.';
    return `Тсс, я сплю… ${cap(SCHEDULE[0].name)} — в ${SCHEDULE[0].hour}:00.`;
  }
  if (mood === 'full') return 'Ой, я объелась… Ничего, завтра будет легче.';
  if (filled) return 'Спасибо, я сытая и довольная! Цветочек за день — твой.';

  const due = lastDue(hour);
  if (mood === 'hungry' && due) return due.ask;

  const next = SCHEDULE.find((s) => hungryFrom(s) > hour && !has(entries, s.meal));
  const missed = SCHEDULE.find((s) => hungryFrom(s) <= hour && !has(entries, s.meal));
  const fedText = next ? `Я пока сытая, не голодна. Скоро ${next.name} — в ${next.hour}:00.` : 'Я пока сытая, не голодна.';
  if (missed) {
    return next
      ? `${fedText} А ${missed.name} сегодня был? Если ела — запиши.`
      : `А ${missed.name} сегодня был? Если ела — запиши, и день будет полным.`;
  }
  const anything = entries.some((e) => !e.deleted);
  if (!anything && next) return `Доброе утро! ${cap(next.name)} в ${next.hour}:00 — я жду.`;
  return fedText;
}

/* ---------- Радость, когда день заполнен ---------- */

const celebrateKey = (profileId: string) => `petCelebrate:${profileId}`;

export type Celebration = 'fed' | 'day';

/**
 * Вызывается после добавления записи: питомицу покормили — она радуется на главной.
 * Если этой записью закрыли весь день — «тик» телефона и праздник побольше.
 */
export async function afterEntryAdded(profileId: string, date: string, addedMeal: MealType) {
  const list = (await db.entries.where('[profileId+date]').equals([profileId, date]).toArray()).filter((e) => !e.deleted);
  // день заполнился именно сейчас: этой записью закрыли последний основной приём пищи
  const day = dayFilled(list) && list.filter((e) => e.meal === addedMeal).length === 1;
  if (day) haptic();
  try {
    localStorage.setItem(celebrateKey(profileId), `${date}|${day ? 'day' : 'fed'}`);
  } catch {
    /* без праздника */
  }
}

/** Забрать «праздник», если он ждёт этот день */
export function takeCelebration(profileId: string, date: string): Celebration | null {
  try {
    const [d, kind] = (localStorage.getItem(celebrateKey(profileId)) ?? '').split('|');
    if (d !== date) return null;
    localStorage.removeItem(celebrateKey(profileId));
    return kind === 'day' ? 'day' : 'fed';
  } catch {
    return null;
  }
}

/** Что говорит питомица, пока радуется еде */
export function celebrateSay(kind: Celebration): string {
  return kind === 'day' ? 'Ура, весь день записан! Спасибо, я сытая и довольная.' : 'Ням-ням! Спасибо, вкусно!';
}

/* ---------- Сад: цветок за каждый день, когда заходили ---------- */

/** Отметить, что сегодня заходили. true — если это первый заход за день (новый бутон) */
export async function recordVisit(profileId: string): Promise<boolean> {
  const date = todayStr();
  const id = `${profileId}:${date}`;
  if (await db.visits.get(id)) return false;
  await db.visits.put({ id, profileId, date, updatedAt: Date.now() });
  return true;
}

export function useVisits(profileId: string): string[] | undefined {
  return useLiveQuery(
    async () =>
      (await db.visits.where('profileId').equals(profileId).toArray())
        .filter((v) => !v.deleted)
        .map((v) => v.date)
        .sort(),
    [profileId],
  );
}

/** Сколько дней подряд (включая сегодня или вчера) заходили */
export function streak(dates: string[]): number {
  const set = new Set(dates);
  let d = set.has(todayStr()) ? todayStr() : addDays(todayStr(), -1);
  let n = 0;
  while (set.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}
