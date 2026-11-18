/**
 * Open Food Facts — бесплатная открытая база продуктов (много российских товаров).
 * https://world.openfoodfacts.org
 */
import { db } from './db';
import { detectTags } from './restrictions';
import type { Food, Serving, Tag } from './types';

const BASE = 'https://world.openfoodfacts.org';
const FIELDS = [
  'code',
  'product_name',
  'product_name_ru',
  'generic_name_ru',
  'brands',
  'quantity',
  'serving_size',
  'nutriments',
  'ingredients_text_ru',
  'ingredients_text',
  'allergens_tags',
].join(',');

/* eslint-disable @typescript-eslint/no-explicit-any */
type OffProduct = Record<string, any>;

function num(x: unknown): number | undefined {
  const n = typeof x === 'string' ? parseFloat(x.replace(',', '.')) : typeof x === 'number' ? x : NaN;
  return isFinite(n) && n >= 0 ? n : undefined;
}

const r1 = (x: number) => Math.round(x * 10) / 10;

/** «30 g», «1 шт (55 г)», «200 мл» → граммы */
function gramsOf(text?: string): number | undefined {
  if (!text) return undefined;
  const m = /(\d+(?:[.,]\d+)?)\s*(g|г|гр|ml|мл)\b/i.exec(text);
  return m ? num(m[1]) : undefined;
}

export interface OffFood {
  food: Food;
  /** Есть ли все четыре числа: ккал, белки, жиры, углеводы */
  complete: boolean;
}

export function offToFood(p: OffProduct, code?: string): OffFood {
  const n = p.nutriments ?? {};
  let kcal = num(n['energy-kcal_100g']);
  if (kcal == null) {
    const kj = num(n['energy-kj_100g'] ?? n['energy_100g']);
    if (kj != null) kcal = kj / 4.184;
  }
  const pr = num(n.proteins_100g);
  const f = num(n.fat_100g);
  const c = num(n.carbohydrates_100g);
  const name = String(p.product_name_ru || p.product_name || p.generic_name_ru || '').trim();
  const brand = String(p.brands || '').split(',')[0]?.trim() || undefined;
  const barcode = String(code ?? p.code ?? '').trim() || undefined;

  const servings: Serving[] = [];
  const sg = gramsOf(p.serving_size);
  if (sg) servings.push({ label: '1 порция', grams: sg });
  const pg = gramsOf(p.quantity);
  if (pg && pg !== sg && pg <= 2000) servings.push({ label: '1 упаковка', grams: pg });

  const allergens: string[] = p.allergens_tags ?? [];
  const tags = new Set<Tag>(detectTags(name, brand, p.ingredients_text_ru || p.ingredients_text));
  if (allergens.some((a) => a === 'en:nuts' || a === 'en:peanuts')) tags.add('nuts');

  const food: Food = {
    id: barcode ? `off-${barcode}` : `off-${Date.now()}`,
    name: name || 'Без названия',
    brand,
    barcode,
    kcal: r1(kcal ?? 0),
    p: r1(pr ?? 0),
    f: r1(f ?? 0),
    c: r1(c ?? 0),
    servings: servings.length ? servings : undefined,
    tags: [...tags],
    source: 'off',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  return { food, complete: !!name && kcal != null && pr != null && f != null && c != null };
}

export class OffError extends Error {}

async function getJson(url: string): Promise<any> {
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  } catch {
    throw new OffError('Нет связи с базой продуктов. Проверьте интернет или введите КБЖУ вручную.');
  }
  if (res.status === 404) return null;
  if (res.status === 429) throw new OffError('База продуктов просит подождать минутку — слишком много запросов.');
  if (!res.ok) throw new OffError('База продуктов сейчас не отвечает. Попробуйте позже или введите КБЖУ вручную.');
  return res.json();
}

/** Сначала ищем в своей базе, потом в Open Food Facts */
export async function lookupBarcode(code: string): Promise<{ where: 'mine' | 'off'; food: Food; complete: boolean } | null> {
  const mine = (await db.foods.where('barcode').equals(code).toArray()).find((f) => !f.deleted);
  if (mine) return { where: 'mine', food: mine, complete: true };
  const data = await getJson(`${BASE}/api/v2/product/${encodeURIComponent(code)}.json?fields=${FIELDS}`);
  if (!data || data.status === 0 || !data.product) return null;
  const { food, complete } = offToFood(data.product, code);
  return { where: 'off', food, complete };
}

/** Поиск по названию (сначала российские товары) */
export async function searchOff(query: string): Promise<Food[]> {
  const run = async (russia: boolean) => {
    const params = new URLSearchParams({
      search_terms: query,
      json: '1',
      page_size: '25',
      sort_by: 'unique_scans_n',
      fields: FIELDS,
    });
    if (russia) params.set('countries_tags_en', 'russia');
    const data = await getJson(`${BASE}/cgi/search.pl?${params}`);
    return ((data?.products ?? []) as OffProduct[]).map((p) => offToFood(p)).filter((x) => x.complete).map((x) => x.food);
  };
  const ru = await run(true);
  return ru.length ? ru : run(false);
}

/** Сохраняем найденный продукт к себе, чтобы в следующий раз он находился без интернета */
export async function saveOffFood(food: Food): Promise<Food> {
  const existing = await db.foods.get(food.id);
  if (existing && !existing.deleted) return existing;
  const saved = { ...food, updatedAt: Date.now(), deleted: false };
  await db.foods.put(saved);
  return saved;
}
