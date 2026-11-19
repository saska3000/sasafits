import { useState } from 'react';
import { fmtNum, humanDate, parseNum } from '../lib/format';
import type { Profile } from '../lib/types';
import { deleteWeight, setWeight } from '../lib/weight';
import { Sheet, toast } from './ui';

/** Вписать вес вручную (или удалить запись за день) */
export function WeightSheet({
  profile,
  date,
  initial,
  exists,
  onClose,
}: {
  profile: Profile;
  date: string;
  initial?: number;
  exists: boolean;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial != null ? fmtNum(initial) : '');
  const [error, setError] = useState('');

  const save = async () => {
    const kg = parseNum(value);
    if (!isFinite(kg) || kg < 25 || kg > 300) return setError('Впишите вес в килограммах, например 64,5');
    await setWeight(profile, date, kg);
    toast('Вес записан');
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={`Вес · ${humanDate(date).toLowerCase()}`}>
      <label className="field">
        <span>Килограммы</span>
        <input
          className="input weight-input"
          inputMode="decimal"
          autoFocus
          placeholder="64,5"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && save()}
        />
      </label>
      {error && <div className="hint">{error}</div>}
      <button className="btn primary" onClick={save}>
        Сохранить
      </button>
      {exists && (
        <button
          className="btn outline danger"
          onClick={async () => {
            await deleteWeight(profile.id, date);
            toast('Запись удалена');
            onClose();
          }}
        >
          Удалить запись за этот день
        </button>
      )}
    </Sheet>
  );
}
