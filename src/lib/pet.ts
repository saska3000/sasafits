import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { addDays, todayStr } from './format';
import { haptic } from './haptics';
import type { DiaryEntry, MealType } from './types';

/* ---------- Настроение за день ---------- */

export type PetMood = 'hungry' | 'eating' | 'joy' | 'full';
const MAIN: [MealType, string][] = [
  ['breakfast', 'завтрак'],
  ['lunch', 'обед'],
  ['dinner', 'ужин'],
];

export function dayFilled(entries: DiaryEntry[]): boolean {
  return MAIN.every(([m]) => entries.some((e) => e.meal === m && !e.deleted));
}

export function petMood(entries: DiaryEntry[], kcal: number, goal: number): PetMood {
  const list = entries.filter((e) => !e.deleted);
  if (dayFilled(list)) return kcal > goal * 1.05 ? 'full' : 'joy';
  return list.length ? 'eating' : 'hungry';
}

/** Что говорит питомица (за сегодня — просит покормить, за прошлые дни — вспоминает) */
export function petSay(mood: PetMood, entries: DiaryEntry[], isToday: boolean): string {
  if (!isToday) {
    if (mood === 'joy') return 'В этот день я была сытая и довольная.';
    if (mood === 'full') return 'В этот день я немножко объелась.';
    return 'В этот день меня покормили не полностью.';
  }
  const missing = MAIN.find(([m]) => !entries.some((e) => e.meal === m && !e.deleted));
  if (mood === 'hungry') {
    const h = new Date().getHours();
    const what = h < 11 ? 'завтрак' : h < 16 ? 'обед' : 'ужин';
    return `Я проголодалась… Запиши ${what}?`;
  }
  if (mood === 'eating') return `Вкусно! А теперь запиши ${missing?.[1] ?? 'ужин'} — и день готов.`;
  if (mood === 'full') return 'Ой, я объелась… Ничего, завтра будет легче.';
  return 'Спасибо, я сытая и довольная! Цветочек за день — твой.';
}

/* ---------- Радость, когда день заполнен ---------- */

const celebrateKey = (profileId: string) => `petCelebrate:${profileId}`;

/** Вызывается после добавления записи: если день только что заполнился — «тик» телефона и праздник на главной */
export async function afterEntryAdded(profileId: string, date: string, addedMeal: MealType) {
  const list = (await db.entries.where('[profileId+date]').equals([profileId, date]).toArray()).filter((e) => !e.deleted);
  if (!dayFilled(list)) return;
  // заполнился именно сейчас: этой записью закрыли последний основной приём пищи
  const sameMeal = list.filter((e) => e.meal === addedMeal);
  if (sameMeal.length !== 1) return;
  haptic();
  try {
    localStorage.setItem(celebrateKey(profileId), date);
  } catch {
    /* без праздника */
  }
}

/** Забрать «праздник», если он ждёт этот день */
export function takeCelebration(profileId: string, date: string): boolean {
  try {
    if (localStorage.getItem(celebrateKey(profileId)) !== date) return false;
    localStorage.removeItem(celebrateKey(profileId));
    return true;
  } catch {
    return false;
  }
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
