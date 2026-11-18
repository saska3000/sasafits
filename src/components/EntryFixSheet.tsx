import { useState } from 'react';
import { db } from '../lib/db';
import { fmtNum, parseNum } from '../lib/format';
import { kcalMismatch } from '../lib/nutrition';
import type { DiaryEntry, Macros } from '../lib/types';
import { IconWarn } from './Icons';
import { Sheet, toast } from './ui';

/**
 * Исправить название и КБЖУ записи в дневнике.
 * Если это свой продукт или найденный по штрих-коду — исправляем и сам продукт,
 * и все записи с ним, чтобы ошибка не повторилась.
 */
export async function fixFoodEverywhere(foodId: string, name: string, per100: Macros) {
  const now = Date.now();
  const food = await db.foods.get(foodId);
  if (food && !food.deleted) {
    await db.foods.update(foodId, { name, ...per100, updatedAt: now });
  }
  const entryName = food?.brand ? `${name} (${food.brand})` : name;
  await db.entries
    .where('refId')
    .equals(foodId)
    .modify((e: DiaryEntry) => {
      if (e.refType !== 'food') return;
      e.per100 = { ...per100 };
      e.name = entryName;
      e.updatedAt = now;
    });
}

export function EntryFixSheet({ entry, onClose }: { entry: DiaryEntry; onClose: () => void }) {
  const strip = (n: string) => n.replace(/\s*\([^)]*\)\s*$/, '');
  const [name, setName] = useState(strip(entry.name));
  const [vals, setVals] = useState({
    kcal: fmtNum(entry.per100.kcal),
    p: fmtNum(entry.per100.p),
    f: fmtNum(entry.per100.f),
    c: fmtNum(entry.per100.c),
  });
  const [error, setError] = useState('');

  const num = (s: string) => (s.trim() === '' ? 0 : parseNum(s));
  const per100: Macros = { kcal: num(vals.kcal), p: num(vals.p), f: num(vals.f), c: num(vals.c) };
  const valid = Object.values(per100).every((x) => isFinite(x) && x >= 0);

  const save = async () => {
    if (!name.trim()) return setError('Напишите название.');
    if (!valid) return setError('Проверьте числа: должны быть цифры, например 12,5.');
    if (per100.kcal > 950 || per100.p + per100.f + per100.c > 105) {
      return setError('Похоже, это не на 100 г. Посмотрите на упаковке строку «на 100 г».');
    }
    const food = entry.refType === 'food' ? await db.foods.get(entry.refId) : undefined;
    if (food && !food.deleted) {
      await fixFoodEverywhere(food.id, name.trim(), per100);
      toast('Исправлено — и в продукте, и в дневнике');
    } else {
      await db.entries.update(entry.id, { name: name.trim(), per100, updatedAt: Date.now() });
      toast('Исправлено');
    }
    onClose();
  };

  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement>) => setVals((v) => ({ ...v, [k]: e.target.value }));

  return (
    <Sheet open onClose={onClose} title="Исправить продукт">
      <label className="field">
        <span>Название</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="label">На 100 г — как на упаковке</div>
      <div className="grid4">
        <label className="field">
          <span>Ккал</span>
          <input className="input" inputMode="decimal" value={vals.kcal} onChange={set('kcal')} />
        </label>
        <label className="field">
          <span>Белки</span>
          <input className="input" inputMode="decimal" value={vals.p} onChange={set('p')} />
        </label>
        <label className="field">
          <span>Жиры</span>
          <input className="input" inputMode="decimal" value={vals.f} onChange={set('f')} />
        </label>
        <label className="field">
          <span>Углев.</span>
          <input className="input" inputMode="decimal" value={vals.c} onChange={set('c')} />
        </label>
      </div>
      {valid && kcalMismatch(per100) && (
        <div className="hint">
          Калории не очень сходятся с БЖУ (по БЖУ выходит около {Math.round(per100.p * 4 + per100.f * 9 + per100.c * 4)} ккал). Проверьте
          цифры.
        </div>
      )}
      {error && (
        <div className="warn">
          <IconWarn width={18} height={18} />
          <span>{error}</span>
        </div>
      )}
      <button className="btn primary" onClick={save}>
        Сохранить исправление
      </button>
    </Sheet>
  );
}
