import type { Tag } from './types';

export const ALL_TAGS: Tag[] = ['nuts', 'hard', 'sticky', 'mushrooms', 'buckwheat', 'whitefish'];

export const TAG_LABELS: Record<Tag, string> = {
  nuts: 'орехи',
  hard: 'твёрдое',
  sticky: 'липкое',
  mushrooms: 'грибы',
  buckwheat: 'гречка',
  whitefish: 'белая рыба',
};

/** Части слов, по которым узнаём ограничение в названии или составе */
const KEYWORDS: Record<Tag, string[]> = {
  nuts: ['орех', 'миндал', 'фундук', 'кешью', 'арахис', 'фисташ', 'пекан', 'макадам', 'кедров', 'семечк', 'пралине', ' nut ', ' nuts', 'almond', 'peanut', 'hazelnut', 'cashew', 'pistachio'],
  hard: ['сухар', 'хлебц', 'сушк', 'попкорн', 'леденц', 'грильяж', 'гранол', 'чипс', 'крекер', 'кранч'],
  sticky: ['ирис', 'тоффи', 'жеватель', 'козинак', 'нуга', 'чурчхел', 'финик', 'курага', 'изюм', 'карамел'],
  mushrooms: ['гриб', 'шампиньон', 'вешенк', 'опят', 'лисичк', 'трюфел', 'mushroom'],
  buckwheat: ['гречк', 'гречнев', 'buckwheat', 'лапша соба'],
  whitefish: ['треск', 'минтай', 'хек', 'пикш', 'тилапи', 'тиляпи', 'судак', 'камбал', 'палтус', 'навага', 'сайда', 'щук', 'окун', 'дорадо', 'сибас', 'путассу', 'мерлуз', 'пангасиус', ' cod', 'pollock', 'hake'],
};

function norm(s: string): string {
  return ' ' + s.toLowerCase().replace(/ё/g, 'е') + ' ';
}

/** Ищет ограничения в тексте (название, состав) */
export function detectTags(...texts: (string | undefined)[]): Tag[] {
  const t = norm(texts.filter(Boolean).join(' '));
  return ALL_TAGS.filter((tag) => KEYWORDS[tag].some((k) => t.includes(k)));
}

/** Какие метки продукта попадают в запреты человека */
export function conflicts(tags: Tag[] | undefined, restrictions: Tag[] | undefined): Tag[] {
  if (!tags?.length || !restrictions?.length) return [];
  return tags.filter((t) => restrictions.includes(t));
}

export function conflictText(tags: Tag[]): string {
  const names = tags.map((t) => TAG_LABELS[t]).join(', ');
  const braces = tags.some((t) => t === 'nuts' || t === 'hard' || t === 'sticky');
  return braces ? `${names} — с брекетами нельзя` : `${names} — в списке «не едим»`;
}
