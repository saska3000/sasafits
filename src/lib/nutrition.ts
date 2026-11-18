import type { GoalType, Macros, MealType, Profile } from './types';

export const ZERO: Macros = { kcal: 0, p: 0, f: 0, c: 0 };

export const MEALS: { id: MealType; label: string; icon: string }[] = [
  { id: 'breakfast', label: 'Завтрак', icon: '☀️' },
  { id: 'lunch', label: 'Обед', icon: '🍲' },
  { id: 'dinner', label: 'Ужин', icon: '🌙' },
  { id: 'snack', label: 'Перекусы', icon: '🍎' },
];

export function mealLabel(m: MealType): string {
  return MEALS.find((x) => x.id === m)?.label ?? m;
}

/** Предлагаем приём пищи по времени суток */
export function guessMeal(date = new Date()): MealType {
  const h = date.getHours();
  if (h < 11) return 'breakfast';
  if (h < 16) return 'lunch';
  if (h >= 18 && h < 23) return 'dinner';
  return 'snack';
}

export function scale(per100: Macros, grams: number): Macros {
  const k = grams / 100;
  return { kcal: per100.kcal * k, p: per100.p * k, f: per100.f * k, c: per100.c * k };
}

export function sum(list: Macros[]): Macros {
  return list.reduce(
    (a, b) => ({ kcal: a.kcal + b.kcal, p: a.p + b.p, f: a.f + b.f, c: a.c + b.c }),
    { ...ZERO },
  );
}

/** Сходятся ли калории с БЖУ (белки и углеводы — 4 ккал/г, жиры — 9 ккал/г) */
export function kcalMismatch(m: Macros): boolean {
  const calc = m.p * 4 + m.f * 9 + m.c * 4;
  if (m.kcal < 20 && calc < 20) return false;
  return Math.abs(calc - m.kcal) / Math.max(m.kcal, calc) > 0.2;
}

export const ACTIVITY_LEVELS: { value: number; label: string; hint: string }[] = [
  { value: 1.2, label: 'Минимальная', hint: 'сидячая работа, без тренировок' },
  { value: 1.375, label: 'Лёгкая', hint: '1–3 тренировки в неделю' },
  { value: 1.55, label: 'Средняя', hint: '3–5 тренировок в неделю' },
  { value: 1.725, label: 'Высокая', hint: '6–7 тренировок в неделю' },
  { value: 1.9, label: 'Очень высокая', hint: 'тяжёлый физический труд + спорт' },
];

export const GOAL_TYPES: { value: GoalType; label: string; kcalFactor: number; proteinPerKg: number }[] = [
  { value: 'lose', label: 'Похудение', kcalFactor: 0.8, proteinPerKg: 1.6 },
  { value: 'maintain', label: 'Поддержание', kcalFactor: 1, proteinPerKg: 1.6 },
  { value: 'gain', label: 'Набор мышц', kcalFactor: 1.1, proteinPerKg: 1.8 },
];

/** Доля калорий из жиров в расчёте нормы */
export const FAT_SHARE = 0.28;

export interface GoalCalc {
  bmr: number;
  tdee: number;
  goals: Macros;
}

/**
 * Формула Миффлина–Сан Жеора:
 * обмен в покое = 10 × вес + 6,25 × рост − 5 × возраст + 5 (мужчины) или − 161 (женщины).
 * Затем × активность, затем поправка на цель.
 * Белок — по весу тела, жиры — 28 % калорий, углеводы — остаток.
 */
export function calcGoals(p: Pick<Profile, 'sex' | 'age' | 'heightCm' | 'weightKg' | 'activity' | 'goalType'>): GoalCalc | null {
  if (!p.sex || !p.age || !p.heightCm || !p.weightKg) return null;
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'm' ? 5 : -161);
  const tdee = bmr * p.activity;
  const g = GOAL_TYPES.find((x) => x.value === p.goalType) ?? GOAL_TYPES[1];
  const kcal = Math.round((tdee * g.kcalFactor) / 10) * 10;
  const protein = Math.round(p.weightKg * g.proteinPerKg);
  const fat = Math.round((kcal * FAT_SHARE) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), goals: { kcal, p: protein, f: fat, c: carbs } };
}
