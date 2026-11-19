import { useLiveQuery } from 'dexie-react-hooks';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { db, newId } from './db';
import type { Profile } from './types';

const CURRENT_KEY = 'currentProfileId';

/** Стартовые профили: имена и норма. Рост, вес и цель каждый вводит у себя в профиле */
function defaultProfiles(): Profile[] {
  const now = Date.now();
  return [
    {
      id: newId(),
      name: 'Саша',
      activity: 1.55,
      goalType: 'lose',
      goals: { kcal: 1600, p: 115, f: 50, c: 172 },
      restrictions: ['nuts', 'hard', 'sticky', 'mushrooms'],
      portionFactor: 1,
      updatedAt: now,
    },
    {
      id: newId(),
      name: 'Парень',
      activity: 1.55,
      goalType: 'lose',
      goals: { kcal: 2000, p: 125, f: 62, c: 235 },
      restrictions: ['mushrooms', 'buckwheat', 'whitefish'],
      portionFactor: 1.2,
      updatedAt: now,
    },
  ];
}

let seeding: Promise<void> | null = null;
async function ensureProfiles() {
  if (!seeding) {
    seeding = db.transaction('rw', db.profiles, async () => {
      if ((await db.profiles.count()) === 0) await db.profiles.bulkAdd(defaultProfiles());
    });
  }
  return seeding;
}

interface ProfileCtx {
  profiles: Profile[];
  current: Profile | null;
  setCurrent: (id: string | null) => void;
  updateProfile: (id: string, patch: Partial<Profile>) => Promise<void>;
}

const Ctx = createContext<ProfileCtx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentId, setCurrentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CURRENT_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    ensureProfiles();
  }, []);

  const profiles = useLiveQuery(async () => (await db.profiles.toArray()).filter((p) => !p.deleted), []);

  const setCurrent = useCallback((id: string | null) => {
    setCurrentId(id);
    try {
      if (id) localStorage.setItem(CURRENT_KEY, id);
      else localStorage.removeItem(CURRENT_KEY);
    } catch {
      /* приватный режим — просто не запомним */
    }
  }, []);

  const updateProfile = useCallback(async (id: string, patch: Partial<Profile>) => {
    await db.profiles.update(id, { ...patch, updatedAt: Date.now() });
  }, []);

  if (!profiles) return null;
  const current = profiles.find((p) => p.id === currentId) ?? null;

  return <Ctx.Provider value={{ profiles, current, setCurrent, updateProfile }}>{children}</Ctx.Provider>;
}

export function useProfiles(): ProfileCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('ProfileProvider missing');
  return c;
}

/** Текущий профиль (на экранах после выбора профиля он всегда есть) */
export function useCurrentProfile(): Profile {
  const { current } = useProfiles();
  if (!current) throw new Error('No current profile');
  return current;
}
