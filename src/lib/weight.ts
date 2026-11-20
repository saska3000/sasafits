import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import type { Profile, WeightEntry } from './types';

/** Все взвешивания человека по порядку дат (старые → новые) */
export function useWeights(profileId: string): WeightEntry[] | undefined {
  return useLiveQuery(
    async () =>
      (await db.weights.where('profileId').equals(profileId).toArray())
        .filter((w) => !w.deleted)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [profileId],
  );
}

export const roundKg = (kg: number) => Math.round(kg * 10) / 10;

/** Последний известный вес на эту дату (или раньше) */
export function weightAt(list: WeightEntry[], date: string): WeightEntry | undefined {
  let found: WeightEntry | undefined;
  for (const w of list) if (w.date <= date) found = w;
  return found;
}

/** Записать вес за день. Если это самое свежее взвешивание — обновляем и вес в профиле (для расчёта нормы). */
export async function setWeight(profile: Profile, date: string, kg: number) {
  const now = Date.now();
  const value = roundKg(kg);
  await db.weights.put({ id: `${profile.id}:${date}`, profileId: profile.id, date, kg: value, updatedAt: now });
  const later = await db.weights
    .where('profileId')
    .equals(profile.id)
    .filter((w) => !w.deleted && w.date > date)
    .count();
  if (!later) await db.profiles.update(profile.id, { weightKg: value, updatedAt: now });
}

export async function deleteWeight(profileId: string, date: string) {
  await db.weights.update(`${profileId}:${date}`, { deleted: true, updatedAt: Date.now() });
}

export interface WeightProgress {
  start: number;
  current: number;
  target?: number;
  /** Сколько уже сброшено (или набрано, если цель — набор), кг; может быть отрицательным */
  done: number;
  /** Сколько осталось до цели, кг */
  left?: number;
  /** Доля пути 0…1 */
  share?: number;
  /** Есть ли хоть одно настоящее взвешивание (иначе стоим на старте) */
  measured: boolean;
}

/**
 * Где человек на пути к цели.
 * Старт — «вес на старте» из профиля (с какого веса начинали, даже до приложения),
 * а если его не вписали — первое взвешивание. Текущий вес — только настоящие взвешивания.
 */
export function weightProgress(list: WeightEntry[], profile: Profile, date?: string): WeightProgress | null {
  const cur = date ? weightAt(list, date) : list.at(-1);
  const start = profile.startWeightKg ?? list[0]?.kg;
  if (start == null) return null;
  const current = cur?.kg ?? start;
  const measured = !!cur;
  const target = profile.targetWeightKg;
  const dir = target != null && target > start ? 1 : -1; // −1 — худеем, +1 — набираем
  const done = roundKg((current - start) * dir);
  if (target == null) return { start, current, done, measured };
  const total = Math.abs(target - start);
  const left = roundKg(Math.max(0, (target - current) * dir));
  const share = total > 0 ? Math.min(1, Math.max(0, done / total)) : current === target ? 1 : 0;
  return { start, current, target, done, left, share, measured };
}

/** Поменять старт или цель прямо с главной */
export async function setProfileWeights(profileId: string, patch: { startWeightKg?: number; targetWeightKg?: number }) {
  await db.profiles.update(profileId, { ...patch, updatedAt: Date.now() });
}

/** Тёплые слова по тому, сколько пути пройдено */
export function cheer(p: WeightProgress): string {
  if (p.share == null) return 'Задайте цель — и здесь появится путь к ней.';
  if (!p.measured) return 'Впишите сегодняшний вес — и питомица шагнёт по тропинке.';
  if (p.share >= 1) return 'Цель достигнута! Ты молодец.';
  if (p.done < 0) return 'Бывает. Главное — не сходить с тропинки, всё получится.';
  if (p.share === 0) return 'Первый шаг — самый важный. Вперёд!';
  if (p.share < 0.25) return 'Хорошее начало — ты уже в пути.';
  if (p.share < 0.5) return 'Вокруг уже цветы — так держать.';
  if (p.share < 0.75) return 'Больше половины пути позади!';
  return 'Флажок совсем близко — финиш виден.';
}
