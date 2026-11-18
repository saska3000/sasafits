import { useLiveQuery } from 'dexie-react-hooks';
import { db, newId } from './db';
import { scale } from './nutrition';
import type { DiaryEntry, Food, Macros, MealType, Serving } from './types';

export interface Unit {
  label: string;
  grams: number;
}

export const GRAM: Unit = { label: 'г', grams: 1 };

/** Единицы для продукта: граммы + его порции */
export function unitsFor(servings?: Serving[]): Unit[] {
  return [GRAM, ...(servings ?? []).filter((s) => s.grams > 0).map((s) => ({ label: s.label, grams: s.grams }))];
}

export function entryGrams(e: Pick<DiaryEntry, 'amount' | 'unitGrams'>): number {
  return e.amount * e.unitGrams;
}

export function entryMacros(e: DiaryEntry): Macros {
  return scale(e.per100, entryGrams(e));
}

/** Как показать количество: «150 г» или «2 × 1 шт (110 г)» */
export function amountText(e: Pick<DiaryEntry, 'amount' | 'unitLabel' | 'unitGrams'>): string {
  const a = String(Math.round(e.amount * 100) / 100).replace('.', ',');
  if (e.unitGrams === 1 && e.unitLabel === 'г') return `${a} г`;
  const g = Math.round(e.amount * e.unitGrams);
  return `${a} × ${e.unitLabel} · ${g} г`;
}

export function useDayEntries(profileId: string, date: string): DiaryEntry[] | undefined {
  return useLiveQuery(
    async () =>
      (await db.entries.where('[profileId+date]').equals([profileId, date]).toArray())
        .filter((e) => !e.deleted)
        .sort((a, b) => a.createdAt - b.createdAt),
    [profileId, date],
  );
}

export function useProfileEntries(profileId: string): DiaryEntry[] | undefined {
  return useLiveQuery(() => db.entries.where('profileId').equals(profileId).toArray(), [profileId]);
}

export async function addFoodEntry(args: {
  profileId: string;
  date: string;
  meal: MealType;
  food: Food;
  amount: number;
  unit: Unit;
}): Promise<DiaryEntry> {
  const now = Date.now();
  const { food } = args;
  const entry: DiaryEntry = {
    id: newId(),
    profileId: args.profileId,
    date: args.date,
    meal: args.meal,
    refType: 'food',
    refId: food.id,
    name: food.brand ? `${food.name} (${food.brand})` : food.name,
    per100: { kcal: food.kcal, p: food.p, f: food.f, c: food.c },
    amount: args.amount,
    unitLabel: args.unit.label,
    unitGrams: args.unit.grams,
    servings: food.servings,
    tags: food.tags,
    createdAt: now,
    updatedAt: now,
  };
  await db.entries.add(entry);
  return entry;
}

export async function updateEntry(id: string, patch: Partial<DiaryEntry>) {
  await db.entries.update(id, { ...patch, updatedAt: Date.now() });
}

export async function deleteEntry(id: string) {
  await db.entries.update(id, { deleted: true, updatedAt: Date.now() });
}

export async function restoreEntry(id: string) {
  await db.entries.update(id, { deleted: false, updatedAt: Date.now() });
}

/* ---------- Избранное ---------- */

export function useFavoriteIds(profileId: string): Set<string> | undefined {
  const list = useLiveQuery(() => db.favorites.where('profileId').equals(profileId).toArray(), [profileId]);
  if (!list) return undefined;
  return new Set(list.filter((f) => !f.deleted).map((f) => f.foodId));
}

export async function setFavorite(profileId: string, foodId: string, on: boolean) {
  await db.favorites.put({ id: `${profileId}:${foodId}`, profileId, foodId, updatedAt: Date.now(), deleted: !on });
}
