export type ThemeMode = 'auto' | 'light' | 'dark';

const KEY = 'theme';

export function getTheme(): ThemeMode {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'light' || t === 'dark' ? t : 'auto';
  } catch {
    return 'auto';
  }
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'auto') delete root.dataset.theme;
  else root.dataset.theme = mode;
  try {
    if (mode === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, mode);
  } catch {
    /* ignore */
  }
  syncThemeColor();
}

/** Цвет строки состояния телефона под цвет фона */
export function syncThemeColor() {
  const bg = getComputedStyle(document.body).backgroundColor;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}
