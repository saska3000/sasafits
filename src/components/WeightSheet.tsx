import { useState, type ReactNode } from 'react';
import { fmtNum, humanDate, parseNum } from '../lib/format';
import type { Profile } from '../lib/types';
import { deleteWeight, setProfileWeights, setWeight } from '../lib/weight';
import { Sheet, toast } from './ui';

/** Окошко «впишите килограммы» */
export function KgSheet({
  title,
  hint,
  initial,
  onSave,
  extra,
  onClose,
}: {
  title: string;
  hint?: ReactNode;
  initial?: number;
  onSave: (kg: number) => Promise<void>;
  extra?: ReactNode;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial != null ? fmtNum(initial) : '');
  const [error, setError] = useState('');

  const save = async () => {
    const kg = parseNum(value);
    if (!isFinite(kg) || kg < 25 || kg > 300) return setError('Впишите вес в килограммах, например 64,5');
    await onSave(kg);
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={title}>
      {hint && <div className="muted small">{hint}</div>}
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
      {extra}
    </Sheet>
  );
}

/** Вес за конкретный день (или удалить запись за день) */
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
  return (
    <KgSheet
      title={`Вес · ${humanDate(date).toLowerCase()}`}
      initial={initial}
      onClose={onClose}
      onSave={async (kg) => {
        await setWeight(profile, date, kg);
        toast('Вес записан');
      }}
      extra={
        exists && (
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
        )
      }
    />
  );
}

/** Старт («с какого веса начинали») или цель */
export function GoalSheet({ profile, kind, onClose }: { profile: Profile; kind: 'start' | 'target'; onClose: () => void }) {
  const start = kind === 'start';
  return (
    <KgSheet
      title={start ? 'Вес на старте' : 'Цель'}
      hint={
        start
          ? 'С какого веса вы начинали — даже если это было до приложения. От него идёт тропинка.'
          : 'Какой вес хотите. Флажок на тропинке — это он.'
      }
      initial={start ? profile.startWeightKg : profile.targetWeightKg}
      onClose={onClose}
      onSave={async (kg) => {
        await setProfileWeights(profile.id, start ? { startWeightKg: kg } : { targetWeightKg: kg });
        toast(start ? 'Старт сохранён' : 'Цель сохранена');
      }}
    />
  );
}
