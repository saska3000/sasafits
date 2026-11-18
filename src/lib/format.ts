/** Дата в виде 2026-11-18 по местному времени */
export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}

export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, n: number): string {
  const d = parseDateStr(s);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function isValidDateStr(s: string | null): s is string {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

const dayFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });

/** «Сегодня», «Вчера», «Завтра» или «пн, 16 ноября» */
export function humanDate(s: string): string {
  const today = todayStr();
  if (s === today) return 'Сегодня';
  if (s === addDays(today, -1)) return 'Вчера';
  if (s === addDays(today, 1)) return 'Завтра';
  return dayFmt.format(parseDateStr(s));
}

/** Число с запятой: 12,5 */
export function fmtNum(x: number, digits = 1): string {
  if (!isFinite(x)) return '0';
  const r = Math.round(x * 10 ** digits) / 10 ** digits;
  return String(r).replace('.', ',');
}

/** Граммы БЖУ: до 10 — с десятыми, дальше целые */
export function fmtG(x: number): string {
  return x < 10 ? fmtNum(x, 1) : String(Math.round(x));
}

export function fmtKcal(x: number): string {
  return String(Math.round(x));
}

/** Разбор числа из поля ввода: понимает и «12,5», и «12.5» */
export function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(',', '.').replace(/\s/g, ''));
  return isFinite(n) ? n : NaN;
}

/** Правильное окончание: 1 продукт, 2 продукта, 5 продуктов */
export function plural(n: number, one: string, few: string, many: string): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}
