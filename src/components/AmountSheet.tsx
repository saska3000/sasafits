import { useEffect, useMemo, useRef, useState } from 'react';
import { GRAM, unitsFor, type Unit } from '../lib/diary';
import { fmtG, fmtKcal, fmtNum, parseNum } from '../lib/format';
import { MEALS, scale } from '../lib/nutrition';
import { useCurrentProfile } from '../lib/profiles';
import { conflictText, conflicts } from '../lib/restrictions';
import type { Macros, MealType, Serving, Tag } from '../lib/types';
import { IconStar, IconTrash, IconWarn } from './Icons';
import { Sheet } from './ui';

export interface AmountResult {
  amount: number;
  unit: Unit;
  meal: MealType;
}

interface Props {
  open: boolean;
  onClose: () => void;
  name: string;
  subtitle?: string;
  per100: Macros;
  servings?: Serving[];
  tags?: Tag[];
  initial?: { amount: number; unitLabel: string; unitGrams: number };
  meal: MealType;
  submitLabel: string;
  onSubmit: (r: AmountResult) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  /** Только порции, без граммов (для блюд по рецепту) */
  onlyServings?: boolean;
  favorite?: boolean;
  onToggleFavorite?: () => void;
}

const QUICK_GRAMS = [50, 100, 150, 200, 250];

export function AmountSheet(props: Props) {
  const profile = useCurrentProfile();
  const units = useMemo(() => {
    const list = props.onlyServings && props.servings?.length ? unitsFor(props.servings).slice(1) : unitsFor(props.servings);
    const init = props.initial;
    if (init && !list.some((u) => u.label === init.unitLabel && u.grams === init.unitGrams)) {
      list.push({ label: init.unitLabel, grams: init.unitGrams });
    }
    return list;
  }, [props.servings, props.initial, props.onlyServings]);

  const [unitIdx, setUnitIdx] = useState(0);
  const [amountStr, setAmountStr] = useState('100');
  const [meal, setMeal] = useState<MealType>(props.meal);
  const inputRef = useRef<HTMLInputElement>(null);

  // Начальные значения при каждом открытии
  useEffect(() => {
    if (!props.open) return;
    setMeal(props.meal);
    const init = props.initial;
    if (init) {
      const idx = units.findIndex((u) => u.label === init.unitLabel && u.grams === init.unitGrams);
      setUnitIdx(Math.max(0, idx));
      setAmountStr(fmtNum(init.amount, 2));
    } else if (props.onlyServings) {
      setUnitIdx(0);
      setAmountStr('1');
    } else if (units.length > 1) {
      setUnitIdx(1);
      setAmountStr('1');
    } else {
      setUnitIdx(0);
      setAmountStr('100');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const unit = units[unitIdx] ?? GRAM;
  const amount = parseNum(amountStr);
  const valid = amount > 0 && amount < 100000;
  const grams = valid ? amount * unit.grams : 0;
  const m = scale(props.per100, grams);
  const bad = conflicts(props.tags, profile.restrictions);

  const submit = () => {
    if (!valid) {
      inputRef.current?.focus();
      return;
    }
    props.onSubmit({ amount, unit, meal });
  };

  const changeUnit = (idx: number) => {
    const next = units[idx];
    if (valid && next) {
      // Пересчитываем количество, чтобы вес остался тем же
      const g = amount * unit.grams;
      const a = next.grams === 1 ? Math.round(g) : Math.round((g / next.grams) * 4) / 4 || 1;
      setAmountStr(fmtNum(a, 2));
    }
    setUnitIdx(idx);
  };

  return (
    <Sheet
      open={props.open}
      onClose={props.onClose}
      title={
        <div className="amount-title">
          <div>{props.name}</div>
          {props.subtitle && <div className="muted small">{props.subtitle}</div>}
        </div>
      }
    >
      {bad.length > 0 && (
        <div className="warn">
          <IconWarn width={18} height={18} />
          <span>{conflictText(bad)}</span>
        </div>
      )}

      <div className="per100 muted small">
        {props.onlyServings ? 'Блюдо по рецепту · на 100 г:' : 'На 100 г:'} {fmtKcal(props.per100.kcal)} ккал · Б {fmtG(props.per100.p)} · Ж {fmtG(props.per100.f)} · У {fmtG(props.per100.c)}
      </div>

      <div className="amount-row">
        <input
          ref={inputRef}
          className="input big"
          inputMode="decimal"
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          aria-label="Количество"
        />
        <select className="input" value={unitIdx} onChange={(e) => changeUnit(Number(e.target.value))} aria-label="Единица">
          {units.map((u, i) => (
            <option key={i} value={i}>
              {u.grams === 1 && u.label === 'г' ? 'граммов' : `${u.label} (${fmtNum(u.grams, 0)} г)`}
            </option>
          ))}
        </select>
      </div>

      {props.onlyServings && (
        <div className="chips">
          {[0.5, 1, 1.2, 1.5, 2].map((a) => (
            <button key={a} className={'chip' + (amount === a ? ' active' : '')} onClick={() => setAmountStr(fmtNum(a, 2))}>
              {fmtNum(a, 2)} {a === 1 ? 'порция' : a < 1 ? 'порции' : a < 5 ? 'порции' : 'порций'}
            </button>
          ))}
        </div>
      )}

      {unit.grams === 1 && (
        <div className="chips">
          {QUICK_GRAMS.map((g) => (
            <button key={g} className={'chip' + (amount === g ? ' active' : '')} onClick={() => setAmountStr(String(g))}>
              {g} г
            </button>
          ))}
        </div>
      )}

      <div className="amount-result">
        <div>
          <div className="big-num">{fmtKcal(m.kcal)}</div>
          <div className="muted small">ккал{unit.grams !== 1 && valid ? ` · ${fmtNum(grams, 0)} г` : ''}</div>
        </div>
        <div className="amount-macros">
          <div>
            <b>{fmtG(m.p)}</b>
            <span className="muted small">белки</span>
          </div>
          <div>
            <b>{fmtG(m.f)}</b>
            <span className="muted small">жиры</span>
          </div>
          <div>
            <b>{fmtG(m.c)}</b>
            <span className="muted small">углеводы</span>
          </div>
        </div>
      </div>

      <div className="label">Приём пищи</div>
      <div className="chips">
        {MEALS.map((x) => (
          <button key={x.id} className={'chip' + (meal === x.id ? ' active' : '')} onClick={() => setMeal(x.id)}>
            {x.label}
          </button>
        ))}
      </div>

      <div className="sheet-actions">
        {props.onToggleFavorite && (
          <button
            className={'icon-btn outline' + (props.favorite ? ' fav' : '')}
            aria-label={props.favorite ? 'Убрать из избранного' : 'В избранное'}
            onClick={props.onToggleFavorite}
          >
            <IconStar filled={props.favorite} />
          </button>
        )}
        {props.onEdit && (
          <button className="btn outline" onClick={props.onEdit}>
            Изменить
          </button>
        )}
        {props.onDelete && (
          <button className="icon-btn outline danger" aria-label="Удалить" onClick={props.onDelete}>
            <IconTrash />
          </button>
        )}
        <button className="btn primary grow" disabled={!valid} onClick={submit}>
          {props.submitLabel}
        </button>
      </div>
    </Sheet>
  );
}
