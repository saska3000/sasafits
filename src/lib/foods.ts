import { useLiveQuery } from 'dexie-react-hooks';
import { STARTER_FOODS } from '../data/starterFoods';
import { db, newId } from './db';
import type { DiaryEntry, Food } from './types';

/** Встроенные продукты в общем формате */
export const STARTER: Food[] = STARTER_FOODS.map((s) => ({
  ...s,
  source: 'starter' as const,
  updatedAt: 0,
}));

const STARTER_BY_ID = new Map(STARTER.map((f) => [f.id, f]));

export function starterFood(id: string): Food | undefined {
  return STARTER_BY_ID.get(id);
}

export function useUserFoods(): Food[] | undefined {
  return useLiveQuery(async () => (await db.foods.toArray()).filter((f) => !f.deleted), []);
}

/** Все продукты: свои + встроенные */
export function useAllFoods(): Food[] | undefined {
  const user = useUserFoods();
  if (!user) return undefined;
  return [...user, ...STARTER];
}

export async function getFood(id: string): Promise<Food | undefined> {
  const s = STARTER_BY_ID.get(id);
  if (s) return s;
  const f = await db.foods.get(id);
  return f && !f.deleted ? f : undefined;
}

export async function saveUserFood(data: Omit<Food, 'id' | 'source' | 'updatedAt'> & { id?: string }): Promise<Food> {
  const now = Date.now();
  const existing = data.id ? await db.foods.get(data.id) : undefined;
  const food: Food = {
    ...data,
    id: data.id ?? newId(),
    source: existing?.source ?? 'user',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    deleted: false,
  };
  await db.foods.put(food);
  return food;
}

export async function deleteUserFood(id: string) {
  await db.foods.update(id, { deleted: true, updatedAt: Date.now() });
}

function norm(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е').trim();
}

/**
 * Поиск по названию: все слова запроса должны встретиться.
 * Выше — совпадения с начала названия и свои продукты.
 */
export function searchFoods(foods: Food[], query: string, limit = 60): Food[] {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { f: Food; score: number }[] = [];
  for (const f of foods) {
    const name = norm(f.name);
    const hay = name + ' ' + norm(f.brand ?? '') + ' ' + norm(f.cat ?? '');
    if (!words.every((w) => hay.includes(w))) continue;
    let score = 0;
    if (name.startsWith(words[0])) score -= 30;
    else if (name.includes(' ' + words[0])) score -= 15;
    if (f.source !== 'starter') score -= 10;
    score += name.length / 10;
    scored.push({ f, score });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((x) => x.f);
}

/** Последние добавленные в дневник продукты (без повторов) */
export function recentFoodIds(entries: DiaryEntry[], limit = 40): string[] {
  const sorted = entries
    .filter((e) => !e.deleted && e.refType === 'food')
    .sort((a, b) => b.createdAt - a.createdAt);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of sorted) {
    if (seen.has(e.refId)) continue;
    seen.add(e.refId);
    out.push(e.refId);
    if (out.length >= limit) break;
  }
  return out;
}
