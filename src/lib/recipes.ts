import { useLiveQuery } from 'dexie-react-hooks';
import { MENU_RECIPES as OUR_MENU } from '../data/menuRecipes';
import { NASTYA_RECIPES } from '../data/nastyaRecipes';
import { db, newId } from './db';
import { entryMacros } from './diary';
import { starterFood } from './foods';
import { ZERO, scale, sum } from './nutrition';
import { detectTags } from './restrictions';
import type { DiaryEntry, Macros, MealType, Profile, Recipe, Tag, Vote } from './types';

/* ---------- Рецепты из меню: кладём в базу при первом запуске ---------- */

/** Все готовые рецепты: наше меню + меню Насти. Новые появляются у всех при следующем запуске. */
const MENU_RECIPES = [...OUR_MENU, ...NASTYA_RECIPES];

let seeding: Promise<void> | null = null;
export function ensureMenuRecipes(): Promise<void> {
  if (!seeding) {
    seeding = (async () => {
      const existing = new Set((await db.recipes.toCollection().primaryKeys()) as string[]);
      const now = Date.now();
      // Картинки, появившиеся позже, дописываем в уже сохранённые рецепты из меню
      for (const m of MENU_RECIPES) {
        if (!m.image || !existing.has(m.id)) continue;
        const r = await db.recipes.get(m.id);
        if (r && r.source === 'menu' && !r.image) await db.recipes.update(m.id, { image: m.image, updatedAt: now });
      }
      const toAdd: Recipe[] = MENU_RECIPES.filter((r) => !existing.has(r.id)).map((r) => ({
        ...r,
        ingredients: r.ingredients.map((ing) => {
          const food = ing.foodId ? starterFood(ing.foodId) : undefined;
          return {
            ...ing,
            per100: ing.per100 ?? (food ? { kcal: food.kcal, p: food.p, f: food.f, c: food.c } : { ...ZERO }),
            tags: food?.tags,
          };
        }),
        source: 'menu',
        createdAt: now,
        updatedAt: now,
      }));
      if (toAdd.length) await db.recipes.bulkPut(toAdd);
    })();
  }
  return seeding;
}

export function useRecipes(): Recipe[] | undefined {
  return useLiveQuery(
    async () => (await db.recipes.toArray()).filter((r) => !r.deleted).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [],
  );
}

export function useRecipe(id: string | undefined): Recipe | null | undefined {
  return useLiveQuery(async () => (id ? ((await db.recipes.get(id)) ?? null) : null), [id]);
}

export async function saveRecipe(r: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'source'> & { id?: string }): Promise<Recipe> {
  const now = Date.now();
  const existing = r.id ? await db.recipes.get(r.id) : undefined;
  const recipe: Recipe = {
    ...r,
    id: r.id ?? newId(),
    source: existing?.source ?? 'user',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    deleted: false,
  };
  await db.recipes.put(recipe);
  return recipe;
}

export async function deleteRecipe(id: string) {
  await db.recipes.update(id, { deleted: true, updatedAt: Date.now() });
}

/* ---------- Подсчёт КБЖУ ---------- */

export interface RecipeCalc {
  /** Всё блюдо */
  total: Macros;
  /** Вес всех продуктов, г */
  grams: number;
  /** Одна стандартная порция */
  portion: Macros;
  portionGrams: number;
  per100: Macros;
  tags: Tag[];
}

export function calcRecipe(r: Pick<Recipe, 'ingredients' | 'servings'>): RecipeCalc {
  const total = sum(r.ingredients.map((i) => scale(i.per100 ?? ZERO, i.grams)));
  const grams = r.ingredients.reduce((a, i) => a + (i.grams || 0), 0);
  const servings = r.servings > 0 ? r.servings : 1;
  const portion = scale(total, 100 / servings);
  const per100 = grams > 0 ? scale(total, 10000 / grams) : { ...ZERO };
  const tags = new Set<Tag>();
  for (const i of r.ingredients) {
    i.tags?.forEach((t) => tags.add(t));
    detectTags(i.name).forEach((t) => tags.add(t));
  }
  return { total, grams, portion, portionGrams: grams / servings, per100, tags: [...tags] };
}

export const factorOf = (p: Pick<Profile, 'portionFactor'>) => p.portionFactor ?? 1;

/** Порция конкретного человека */
export function portionFor(calc: RecipeCalc, p: Pick<Profile, 'portionFactor'>): Macros {
  return scale(calc.portion, 100 * factorOf(p));
}

/** Записать порцию блюда в дневник */
export async function addRecipeEntry(args: {
  profile: Profile;
  date: string;
  meal: MealType;
  recipe: Recipe;
  amount?: number;
}): Promise<DiaryEntry> {
  const calc = calcRecipe(args.recipe);
  const now = Date.now();
  const entry: DiaryEntry = {
    id: newId(),
    profileId: args.profile.id,
    date: args.date,
    meal: args.meal,
    refType: 'recipe',
    refId: args.recipe.id,
    name: args.recipe.name,
    per100: calc.per100,
    amount: args.amount ?? factorOf(args.profile),
    unitLabel: 'порция',
    unitGrams: calc.portionGrams || 100,
    servings: [{ label: 'порция', grams: calc.portionGrams || 100 }],
    tags: calc.tags,
    createdAt: now,
    updatedAt: now,
  };
  await db.entries.add(entry);
  return entry;
}

/* ---------- «Чего хочется» ---------- */

export type Mood = 'light' | 'hearty' | 'meat' | 'sweet' | 'any';

export const MOODS: { id: Mood; label: string; emoji: string }[] = [
  { id: 'light', label: 'Лёгкое', emoji: '🥗' },
  { id: 'hearty', label: 'Сытное', emoji: '🍲' },
  { id: 'meat', label: 'Мясное', emoji: '🍗' },
  { id: 'sweet', label: 'Сладкое', emoji: '🍓' },
  { id: 'any', label: 'Удиви меня', emoji: '✨' },
];

export function fitsMood(r: Recipe, calc: RecipeCalc, mood: Mood): boolean {
  switch (mood) {
    case 'light':
      return calc.portion.kcal <= 350;
    case 'hearty':
      return calc.portion.kcal >= 400 || calc.portion.p >= 30;
    case 'meat':
      return r.kinds.includes('meat');
    case 'sweet':
      return r.kinds.includes('sweet');
    default:
      return true;
  }
}

/* ---------- Сколько каждый уже съел за день ---------- */

export function useDayTotals(profiles: Profile[], date: string): Map<string, Macros> | undefined {
  const ids = profiles.map((p) => p.id).join(',');
  return useLiveQuery(async () => {
    const res = new Map<string, Macros>();
    for (const p of profiles) {
      const list = (await db.entries.where('[profileId+date]').equals([p.id, date]).toArray()).filter((e) => !e.deleted);
      res.set(p.id, sum(list.map(entryMacros)));
    }
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, date]);
}

/* ---------- Свайпы и мэтчи ---------- */

export function useVotes(date: string, meal: MealType): Vote[] | undefined {
  return useLiveQuery(
    async () => (await db.votes.where('[date+meal]').equals([date, meal]).toArray()).filter((v) => !v.deleted),
    [date, meal],
  );
}

export async function castVote(date: string, meal: MealType, profileId: string, recipeId: string, liked: boolean) {
  await db.votes.put({
    id: `${date}:${meal}:${profileId}:${recipeId}`,
    date,
    meal,
    profileId,
    recipeId,
    liked,
    updatedAt: Date.now(),
  });
}

export async function undoVote(date: string, meal: MealType, profileId: string, recipeId: string) {
  await db.votes.update(`${date}:${meal}:${profileId}:${recipeId}`, { deleted: true, updatedAt: Date.now() });
}

export async function resetVotes(date: string, meal: MealType, profileId: string) {
  const list = await db.votes.where('[date+meal]').equals([date, meal]).toArray();
  const now = Date.now();
  await db.votes.bulkPut(list.filter((v) => v.profileId === profileId).map((v) => ({ ...v, deleted: true, updatedAt: now })));
}

/** Блюда, которые понравились всем */
export function matchIds(votes: Vote[], profiles: Profile[]): string[] {
  if (profiles.length < 2) return [];
  const likedBy = new Map<string, Set<string>>();
  for (const v of votes) {
    if (!v.liked) continue;
    if (!likedBy.has(v.recipeId)) likedBy.set(v.recipeId, new Set());
    likedBy.get(v.recipeId)!.add(v.profileId);
  }
  return [...likedBy.entries()].filter(([, s]) => profiles.every((p) => s.has(p.id))).map(([id]) => id);
}
