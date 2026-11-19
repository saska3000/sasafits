/** Метки ограничений в питании */
export type Tag = 'nuts' | 'hard' | 'sticky' | 'mushrooms' | 'buckwheat' | 'whitefish';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** Калории и БЖУ. p — белки, f — жиры, c — углеводы (граммы) */
export interface Macros {
  kcal: number;
  p: number;
  f: number;
  c: number;
}

/** Порция: «1 шт» = 55 г */
export interface Serving {
  label: string;
  grams: number;
}

/** Базовый продукт из встроенного справочника (значения на 100 г) */
export interface StarterFood extends Macros {
  id: string;
  name: string;
  cat: string;
  servings?: Serving[];
  tags?: Tag[];
}

/** Любой продукт в приложении (значения на 100 г) */
export interface Food extends Macros {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  cat?: string;
  servings?: Serving[];
  tags?: Tag[];
  source: 'starter' | 'user' | 'off';
  createdAt?: number;
  updatedAt: number;
  deleted?: boolean;
}

export type GoalType = 'lose' | 'maintain' | 'gain';

export interface Profile {
  id: string;
  name: string;
  sex?: 'f' | 'm';
  age?: number;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  /** С какого веса начинали (до приложения тоже) — от него идёт тропинка к цели */
  startWeightKg?: number;
  /** Как зовут питомца на главной */
  petName?: string;
  /** Коэффициент активности для формулы (1.2 … 1.9) */
  activity: number;
  goalType: GoalType;
  /** Дневная норма */
  goals: Macros;
  /** Чего этому человеку нельзя — при добавлении будет предупреждение */
  restrictions: Tag[];
  /** Размер порции относительно стандартной (1 — как у Саши в меню, 1,2 — у парня) */
  portionFactor?: number;
  updatedAt: number;
  deleted?: boolean;
}

/** День, когда человек заходил в приложение — из них растёт сад */
export interface Visit {
  /** `${profileId}:${date}` */
  id: string;
  profileId: string;
  date: string;
  updatedAt: number;
  deleted?: boolean;
}

/** Вес за день: одна запись на человека в день */
export interface WeightEntry {
  /** `${profileId}:${date}` */
  id: string;
  profileId: string;
  date: string;
  kg: number;
  updatedAt: number;
  deleted?: boolean;
}

/** Запись в дневнике. Хранит «снимок» продукта, чтобы история не менялась при правке продукта */
export interface DiaryEntry {
  id: string;
  profileId: string;
  /** Дата в виде 2026-11-18 */
  date: string;
  meal: MealType;
  refType: 'food' | 'recipe';
  refId: string;
  name: string;
  /** Значения на 100 г на момент добавления */
  per100: Macros;
  /** Сколько единиц (например, 2) */
  amount: number;
  /** Единица: «г» или название порции */
  unitLabel: string;
  /** Сколько граммов в одной единице (для «г» — 1) */
  unitGrams: number;
  servings?: Serving[];
  tags?: Tag[];
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
}

export interface Favorite {
  /** `${profileId}:${foodId}` */
  id: string;
  profileId: string;
  foodId: string;
  updatedAt: number;
  deleted?: boolean;
}

/** Особенности блюда для подбора «чего хочется» */
export type RecipeKind = 'meat' | 'sweet';

export interface RecipeIngredient {
  /** Продукт из базы, если есть — тогда КБЖУ берутся из него */
  foodId?: string;
  name: string;
  /** Сколько граммов во всём блюде */
  grams: number;
  /** Как написано: «3 шт», «200 г» */
  amountText?: string;
  /** Пояснение: «щепотка», «2 листа» */
  note?: string;
  /** КБЖУ на 100 г (если продукта нет в базе или чтобы не зависеть от его правки) */
  per100?: Macros;
  tags?: Tag[];
}

/** Рецепт в том виде, как он лежит в файле меню */
export interface MenuRecipe {
  id: string;
  name: string;
  emoji?: string;
  /** Картинка: путь к файлу (recipes/m-curry.jpg) или сама картинка (data:image/jpeg…) */
  image?: string;
  meals: MealType[];
  kinds: RecipeKind[];
  timeMin?: number;
  /** Сколько стандартных порций выходит из всего блюда */
  servings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  portionNote?: string;
  note?: string;
}

export interface Recipe extends MenuRecipe {
  source: 'menu' | 'user';
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
}

/** Голос в свайпах: нравится / не нравится — на конкретный день и приём пищи */
export interface Vote {
  /** `${date}:${meal}:${profileId}:${recipeId}` */
  id: string;
  date: string;
  meal: MealType;
  profileId: string;
  recipeId: string;
  liked: boolean;
  updatedAt: number;
  deleted?: boolean;
}
