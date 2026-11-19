// Переносит рецепты из меню Насти Мироновой (scripts/nastya-recipes.json) в приложение: src/data/nastyaRecipes.ts
// Запуск: node scripts/import-nastya.mjs
// Заодно проверяет: все продукты есть в базе, нет запрещённых слов, калории близки к исходным.
import { readFileSync, writeFileSync } from 'node:fs';
import { STARTER_FOODS } from '../src/data/starterFoods.ts';

const SRC = new URL('./nastya-recipes.json', import.meta.url);
const OUT = new URL('../src/data/nastyaRecipes.ts', import.meta.url);
const recipes = JSON.parse(readFileSync(SRC, 'utf8')).sort((a, b) => a.n - b.n);
const foods = new Map(STARTER_FOODS.map((f) => [f.id, f]));

// Слова, по которым приложение ставит запрет (как в src/lib/restrictions.ts), кроме гречки и белой рыбы — их оставили
const BANNED = ['орех', 'миндал', 'фундук', 'кешью', 'арахис', 'фисташ', 'семечк', 'сухар', 'хлебц', 'гранол', 'крекер',
  'финик', 'курага', 'изюм', 'карамел', 'гриб', 'шампиньон'];
const MEALS = new Set(['breakfast', 'lunch', 'dinner', 'snack']);
const problems = [];
const ids = new Set();

const out = recipes.map((r) => {
  if (ids.has(r.id) || !/^n-[a-z0-9_]+$/.test(r.id)) problems.push(`${r.n}: плохой или повторный id ${r.id}`);
  ids.add(r.id);
  if (!r.meals?.length || r.meals.some((m) => !MEALS.has(m))) problems.push(`${r.n}: приём пищи ${r.meals}`);
  const total = { kcal: 0, p: 0, f: 0, c: 0 };
  const ingredients = r.ingredients.map((i) => {
    const food = i.foodId ? foods.get(i.foodId) : undefined;
    if (i.foodId && !food) problems.push(`${r.n}: нет продукта ${i.foodId}`);
    if (!i.foodId && !i.per100) problems.push(`${r.n}: у «${i.name}» нет КБЖУ`);
    const bad = BANNED.find((w) => i.name.toLowerCase().replace(/ё/g, 'е').includes(w));
    if (bad) problems.push(`${r.n}: «${i.name}» — запрещённое слово «${bad}»`);
    const per = i.per100 ?? food;
    for (const k of Object.keys(total)) total[k] += ((per?.[k] ?? 0) * i.grams) / 100;
    const ing = { name: i.name, grams: i.grams };
    if (i.foodId) ing.foodId = i.foodId;
    if (i.amountText) ing.amountText = i.amountText;
    if (i.per100) ing.per100 = i.per100;
    return ing;
  });
  const [sk] = String(r.srcKcal).split('/').map(Number);
  const diff = sk ? Math.round(((total.kcal - sk) / sk) * 100) : 0;
  console.log(
    `${String(r.n).padStart(2)} ${r.name.slice(0, 44).padEnd(44)} ${Math.round(total.kcal)} ккал (у Насти ${r.srcKcal}) ${Math.abs(diff) > 20 ? '⚠️ ' : ''}${diff > 0 ? '+' : ''}${diff}%`,
  );
  return {
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    meals: r.meals,
    kinds: r.kinds ?? [],
    timeMin: r.timeMin,
    servings: r.servings ?? 1,
    ingredients,
    steps: r.steps,
    note: [r.note, 'Рецепт из меню Насти Мироновой, переписан для нас.'].filter(Boolean).join(' '),
  };
});

if (problems.length) {
  console.log('\nПроблемы:\n' + problems.join('\n'));
  process.exitCode = 1;
}
writeFileSync(
  OUT,
  `// Рецепты из меню Насти Мироновой (порция на одного). Файл создан скриптом scripts/import-nastya.mjs\nimport type { MenuRecipe } from '../lib/types';\n\nexport const NASTYA_RECIPES: MenuRecipe[] = ${JSON.stringify(out, null, 2)};\n`,
);
console.log(`\nГотово: ${out.length} рецептов → src/data/nastyaRecipes.ts`);
