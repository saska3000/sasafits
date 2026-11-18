import { db } from './db';
import { todayStr } from './format';

const APP = 'kalorii';

interface BackupFile {
  app: string;
  version: number;
  exportedAt: string;
  tables: Record<string, { id: string; updatedAt: number }[]>;
}

const TABLES = ['profiles', 'foods', 'entries', 'favorites', 'recipes', 'votes'] as const;

/** Сохранить все данные в файл (на телефоне откроется меню «Поделиться» → «Сохранить в Файлы») */
export async function exportBackup(): Promise<void> {
  const tables: BackupFile['tables'] = {};
  for (const t of TABLES) tables[t] = await db.table(t).toArray();
  const data: BackupFile = { app: APP, version: 1, exportedAt: new Date().toISOString(), tables };
  const name = `sasafits-${todayStr()}.json`;
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });

  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Загрузить данные из файла. Ничего не стирает: более новые записи заменяют старые */
export async function importBackup(file: File): Promise<number> {
  const text = await file.text();
  let data: BackupFile;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Это не файл копии: не получается прочитать.');
  }
  if (data?.app !== APP || typeof data.tables !== 'object') {
    throw new Error('Это не файл копии приложения SasaFits.');
  }
  let count = 0;
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) {
      const rows = data.tables[t];
      if (!Array.isArray(rows)) continue;
      const table = db.table(t);
      for (const row of rows) {
        if (!row?.id) continue;
        const existing = await table.get(row.id);
        if (!existing || (row.updatedAt ?? 0) >= (existing.updatedAt ?? 0)) {
          await table.put(row);
          count++;
        }
      }
    }
  });
  return count;
}
