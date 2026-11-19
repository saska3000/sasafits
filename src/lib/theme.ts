export type ThemeMode = 'auto' | 'light' | 'dark';

const KEY = 'theme';

/** По умолчанию — светлая; «как на телефоне» и тёмная включаются вручную в профиле */
export function getTheme(): ThemeMode {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'auto' || t === 'dark' ? t : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'auto') delete root.dataset.theme;
  else root.dataset.theme = mode;
  try {
    localStorage.setItem(KEY, mode);
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
