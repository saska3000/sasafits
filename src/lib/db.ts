import Dexie, { type Table } from 'dexie';
import type { DiaryEntry, Favorite, Food, Profile, Recipe, Vote } from './types';

/**
 * Локальная база данных в браузере (IndexedDB).
 * Удалённые записи помечаются deleted: true, а не стираются —
 * это понадобится для синхронизации между устройствами.
 */
class KaloriiDB extends Dexie {
  profiles!: Table<Profile, string>;
  foods!: Table<Food, string>;
  entries!: Table<DiaryEntry, string>;
  favorites!: Table<Favorite, string>;
  recipes!: Table<Recipe, string>;
  votes!: Table<Vote, string>;

  constructor() {
    super('kalorii');
    this.version(1).stores({
      profiles: 'id, updatedAt',
      foods: 'id, barcode, updatedAt',
      entries: 'id, [profileId+date], profileId, refId, updatedAt',
      favorites: 'id, profileId, updatedAt',
    });
    this.version(2)
      .stores({
        recipes: 'id, updatedAt',
        votes: 'id, [date+meal], profileId, updatedAt',
      })
      .upgrade((tx) =>
        tx
          .table('profiles')
          .toCollection()
          .modify((p: Profile) => {
            if (p.portionFactor == null) p.portionFactor = p.name === 'Парень' ? 1.2 : 1;
          }),
      );
  }
}

export const db = new KaloriiDB();

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/** Просим браузер не удалять наши данные при нехватке места */
export async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    /* не страшно */
  }
}
