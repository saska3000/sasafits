// Переносит рецепты из меню (база.json) в приложение: src/data/menuRecipes.ts
// Запуск: node scripts/import-menu.mjs ~/меню/база/база.json
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
if (!src) throw new Error('Укажите путь к база.json');
const db = JSON.parse(readFileSync(src, 'utf8'));
const products = new Map(db.products.map((p) => [p.name, p]));

// Продукт из меню → продукт из стартовой базы приложения (там полные КБЖУ)
// или свои значения на 100 г, если такого в базе нет.
const MAP = {
  'куриная грудка': 's-chicken-breast-raw',
  'куриные бёдра без кости': 's-chicken-thigh-skinless-raw',
  'куриный фарш': 's-chicken-mince',
  'говяжий фарш': 's-beef-mince',
  'яйца': 's-egg',
  'йогурт натуральный': 's-yogurt-natural',
  'творог 5%': 's-tvorog-5',
  'кефир': 's-kefir-1',
  'сливки 10%': 's-cream-10',
  'молоко': 's-milk-2-5',
  'сыр твёрдый': 's-cheese-hard',
  'кабачок': 's-zucchini',
  'помидоры': 's-tomato',
  'болгарский перец': 's-bell-pepper',
  'огурцы': 's-cucumber',
  'морковь': 's-carrot',
  'картофель': 's-potato-raw',
  'капуста белокочанная': 's-cabbage-white',
  'лук репчатый': 's-onion',
  'зелень (укроп, петрушка, зелёный лук)': 's-herbs',
  'салат листовой': 's-lettuce',
  'груши мягкие': 's-pear',
  'бананы': 's-banana',
  'ягоды замороженные (малина, клубника)': 's-berry-mix-frozen',
  'стручковая фасоль замороженная': 's-green-beans',
  'мягкий цельнозерновой хлеб': 's-bread-whole-grain',
  'лаваш тонкий': 's-lavash-thin',
  'рис': 's-rice-white-dry',
  'овсяные хлопья': 's-oat-flakes',
  'вермишель': 's-pasta-dry',
  'тунец в собственном соку': 's-tuna-canned-own-juice',
  'фасоль консервированная': 's-beans-red-canned',
  'кукуруза консервированная': 's-corn-canned',
  'масло растительное': 's-oil-sunflower',
  'оливковое масло': 's-oil-olive',
  'соевый соус': 's-soy-sauce',
  'мёд': 's-honey',
  'томатная паста': 's-tomato-paste',
  'майонез': 's-mayonnaise',
  'горчица': 's-mustard',
  'сахар': 's-sugar',
};

const CUSTOM = {
  'чеснок': { kcal: 149, p: 6.4, f: 0.5, c: 29.9 },
  'лимон': { kcal: 34, p: 0.9, f: 0.1, c: 3 },
  'тортильи пшеничные': { kcal: 300, p: 8.5, f: 7.5, c: 50 },
  'томаты в собственном соку': { kcal: 22, p: 1.1, f: 0.2, c: 3.7 },
  'кокосовое молоко': { kcal: 190, p: 1.8, f: 19.5, c: 2.8 },
  'нори': { kcal: 190, p: 30, f: 1, c: 15 },
  'кунжутное масло': { kcal: 899, p: 0, f: 99.9, c: 0 },
  'рисовый уксус': { kcal: 18, p: 0, f: 0, c: 4.5 },
  'мука': { kcal: 334, p: 10.3, f: 1.1, c: 70 },
};
const ZERO = { kcal: 0, p: 0, f: 0, c: 0 };
const SPICES = new Set(['соль', 'перец чёрный', 'паприка', 'карри', 'зира', 'итальянские травы', 'корица', 'лавровый лист']);
const SKIP = new Set(['шпажки']);

const MEAT = new Set(['куриная грудка', 'куриные бёдра без кости', 'куриный фарш', 'говяжий фарш']);
const SWEET = new Set(['pancakes', 'syrniki', 'french_toast', 'mousse', 'icecream', 'pear_yogurt', 'smoothie']);
const MEALS = { 'завтрак': ['breakfast'], 'перекус': ['snack'], 'обед': ['lunch', 'dinner'], 'ужин': ['dinner', 'lunch'] };
const EMOJI = {
  lepeshka: '🫓', pancakes: '🥞', okonomiyaki: '🥬', syrniki: '🥮', tortilla_hack: '🍳', shakshuka: '🍅',
  french_toast: '🍞', mousse: '🍧', pear_yogurt: '🍐', cucumber_salad: '🥒', smoothie: '🥤', protein_salad: '🥗',
  icecream: '🍨', tuna_beans: '🫘', kefir_banana: '🍌', eggs_cucumber: '🥚', chicken_soup: '🍲', shawarma: '🌯',
  tomato_soup: '🥣', shashlik: '🍢', meatballs: '🧆', curry: '🍛', burrito_bowl: '🥙', sushi_bake: '🍣',
  smash_taco: '🌮', fajitas: '🫑',
};
// Шаурма делается из остатка шашлыка — добавляем его в состав, чтобы калории были честными
const EXTRA = {
  shawarma: [
    { product: 'куриная грудка', qty: 350, unit: 'г', text: 'остаток шашлыка' },
    { product: 'йогурт натуральный', qty: 200, unit: 'г', text: 'остаток тцатцики' },
  ],
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (n) => String(Math.round(n * 100) / 100).replace('.', ',');

function grams(ing) {
  const p = products.get(ing.product);
  if (ing.unit === 'шт') return ing.qty * (p?.g_per_piece ?? 100);
  return ing.qty; // г и мл считаем одинаково
}

const out = [];
for (const r of db.recipes) {
  const ings = [...(EXTRA[r.id] ?? []), ...r.ingredients].filter((i) => !SKIP.has(i.product));
  let totalDbKcal = 0;
  const ingredients = ings.map((i) => {
    const g = grams(i);
    const p = products.get(i.product);
    totalDbKcal += (g * (p?.kcal100 ?? 0)) / 100;
    const ing = {
      name: cap(i.product),
      grams: Math.round(g * 10) / 10,
      amountText: i.unit === 'шт' ? `${fmt(i.qty)} шт` : `${fmt(i.qty)} ${i.unit}`,
    };
    if (i.text) ing.note = i.text;
    if (MAP[i.product]) ing.foodId = MAP[i.product];
    else if (CUSTOM[i.product]) ing.per100 = CUSTOM[i.product];
    else if (SPICES.has(i.product)) ing.per100 = ZERO;
    else throw new Error('Нет продукта для: ' + i.product);
    return ing;
  });
  // Сколько «Сашиных» порций выходит из всего блюда
  const servings = Math.max(1, Math.round((totalDbKcal / r.kcal_sasha) * 10) / 10);
  const notes = [r.note, r.prep_before ? `Накануне: ${r.prep_before}` : null].filter(Boolean);
  const kinds = [];
  if (ings.some((i) => MEAT.has(i.product))) kinds.push('meat');
  if (SWEET.has(r.id)) kinds.push('sweet');
  out.push({
    id: 'm-' + r.id,
    name: r.name,
    emoji: EMOJI[r.id] ?? '🍽️',
    image: `recipes/m-${r.id}.jpg`,
    meals: MEALS[r.meal] ?? ['snack'],
    kinds,
    timeMin: r.time ?? undefined,
    servings,
    ingredients,
    steps: r.steps,
    portionNote: r.portions ? cap(r.portions) : undefined,
    note: notes.length ? notes.join(' ') : undefined,
  });
}

const ts = `// Рецепты из вашего меню (31 октября – 7 ноября). Файл создан скриптом scripts/import-menu.mjs
import type { MenuRecipe } from '../lib/types';

export const MENU_RECIPES: MenuRecipe[] = ${JSON.stringify(out, null, 2)};
`;
writeFileSync(new URL('../src/data/menuRecipes.ts', import.meta.url), ts);
console.log('Рецептов:', out.length);
for (const r of out) console.log(r.servings.toString().padStart(4), r.name);
