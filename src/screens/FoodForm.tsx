import { useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { AmountSheet } from '../components/AmountSheet';
import { fixFoodEverywhere } from '../components/EntryFixSheet';
import { IconWarn } from '../components/Icons';
import { TopBar, toast, useGoBack } from '../components/ui';
import { db } from '../lib/db';
import { addFoodEntry } from '../lib/diary';
import { deleteUserFood, saveUserFood } from '../lib/foods';
import { fmtNum, isValidDateStr, parseNum } from '../lib/format';
import { kcalMismatch, mealLabel } from '../lib/nutrition';
import { useCurrentProfile } from '../lib/profiles';
import { ALL_TAGS, TAG_LABELS, detectTags } from '../lib/restrictions';
import type { Food, MealType, Tag } from '../lib/types';

interface FormState {
  name: string;
  brand: string;
  kcal: string;
  p: string;
  f: string;
  c: string;
  servingLabel: string;
  servingGrams: string;
  barcode: string;
  tags: Tag[];
}

const EMPTY: FormState = {
  name: '',
  brand: '',
  kcal: '',
  p: '',
  f: '',
  c: '',
  servingLabel: '',
  servingGrams: '',
  barcode: '',
  tags: [],
};

function fromFood(f: Food): FormState {
  const s = f.servings?.[0];
  return {
    name: f.name,
    brand: f.brand ?? '',
    kcal: fmtNum(f.kcal),
    p: fmtNum(f.p),
    f: fmtNum(f.f),
    c: fmtNum(f.c),
    servingLabel: s?.label ?? '',
    servingGrams: s ? fmtNum(s.grams) : '',
    barcode: f.barcode ?? '',
    tags: f.tags ?? [],
  };
}

export function FoodFormScreen() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const goBack = useGoBack();
  const profile = useCurrentProfile();
  const d = params.get('d');
  const date = isValidDateStr(d) ? d : null;
  const meal = (params.get('meal') as MealType | null) ?? 'snack';

  const location = useLocation();
  const navState = location.state as { prefill?: Food; hint?: string } | null;
  const [form, setForm] = useState<FormState>(() => {
    const base = navState?.prefill ? fromFood(navState.prefill) : EMPTY;
    const blank = (v: string) => (v === '0' ? '' : v);
    return {
      ...base,
      kcal: blank(base.kcal),
      p: blank(base.p),
      f: blank(base.f),
      c: blank(base.c),
      name: base.name || params.get('name') || '',
      barcode: params.get('barcode') ?? base.barcode,
    };
  });
  const [tagsTouched, setTagsTouched] = useState(false);
  const [loaded, setLoaded] = useState(!id);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<Food | null>(null);

  useEffect(() => {
    if (!id) return;
    db.foods.get(id).then((f) => {
      if (f) {
        setForm(fromFood(f));
        setTagsTouched(true);
      }
      setLoaded(true);
    });
  }, [id]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setForm((s) => {
      const next = { ...s, [k]: v };
      if ((k === 'name' || k === 'brand') && !tagsTouched) next.tags = detectTags(next.name, next.brand);
      return next;
    });
  };

  const toggleTag = (t: Tag) => {
    setTagsTouched(true);
    setForm((s) => ({ ...s, tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : [...s.tags, t] }));
  };

  const num = (s: string) => (s.trim() === '' ? 0 : parseNum(s));
  const macros = { kcal: num(form.kcal), p: num(form.p), f: num(form.f), c: num(form.c) };
  const macrosValid = Object.values(macros).every((x) => isFinite(x) && x >= 0);
  const mismatch = macrosValid && form.kcal.trim() !== '' && kcalMismatch(macros);

  const save = async () => {
    setError('');
    if (!form.name.trim()) return setError('Напишите название продукта.');
    if (form.kcal.trim() === '') return setError('Укажите калории на 100 г.');
    if (!macrosValid) return setError('Проверьте числа: должны быть цифры, например 12,5.');
    if (macros.kcal > 950 || macros.p + macros.f + macros.c > 105) {
      return setError('Похоже, значения указаны не на 100 г. Проверьте этикетку.');
    }
    const sg = num(form.servingGrams);
    const servings = form.servingGrams.trim() && sg > 0 ? [{ label: form.servingLabel.trim() || '1 порция', grams: sg }] : undefined;
    const food = await saveUserFood({
      id,
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      barcode: form.barcode.replace(/\D/g, '') || undefined,
      ...macros,
      servings,
      tags: form.tags,
    });
    if (id) await fixFoodEverywhere(id, food.name, { kcal: food.kcal, p: food.p, f: food.f, c: food.c });
    if (date && !id) {
      setSaved(food);
    } else {
      toast(id ? 'Сохранено — и в записях дневника тоже' : 'Продукт сохранён');
      goBack('/products');
    }
  };

  const remove = async () => {
    if (!id) return;
    if (!confirm('Удалить продукт из вашей базы? Записи в дневнике останутся.')) return;
    await deleteUserFood(id);
    toast('Продукт удалён');
    goBack('/products');
  };

  if (!loaded) return null;

  return (
    <div className="screen">
      <TopBar back title={id ? 'Продукт' : 'Новый продукт'} right={<span className="topbar-spacer" />} />
      <main className="content form">
        {navState?.hint && <div className="hint">{navState.hint}</div>}
        <label className="field">
          <span>Название</span>
          <input className="input" value={form.name} onChange={set('name')} placeholder="Например: Творог 5%" autoFocus={!id} />
        </label>
        <label className="field">
          <span>Производитель (необязательно)</span>
          <input className="input" value={form.brand} onChange={set('brand')} placeholder="Например: Простоквашино" />
        </label>

        <div className="label">На 100 г — как на упаковке</div>
        <div className="grid4">
          <label className="field">
            <span>Ккал</span>
            <input className="input" inputMode="decimal" value={form.kcal} onChange={set('kcal')} />
          </label>
          <label className="field">
            <span>Белки</span>
            <input className="input" inputMode="decimal" value={form.p} onChange={set('p')} />
          </label>
          <label className="field">
            <span>Жиры</span>
            <input className="input" inputMode="decimal" value={form.f} onChange={set('f')} />
          </label>
          <label className="field">
            <span>Углев.</span>
            <input className="input" inputMode="decimal" value={form.c} onChange={set('c')} />
          </label>
        </div>
        {mismatch && (
          <div className="hint">
            Калории не очень сходятся с БЖУ (по БЖУ выходит около {Math.round(macros.p * 4 + macros.f * 9 + macros.c * 4)} ккал). Проверьте
            цифры — или оставьте как на этикетке.
          </div>
        )}

        <div className="label">Порция (необязательно)</div>
        <div className="grid2">
          <label className="field">
            <span>Название порции</span>
            <input className="input" value={form.servingLabel} onChange={set('servingLabel')} placeholder="1 шт, 1 пачка…" />
          </label>
          <label className="field">
            <span>Вес порции, г</span>
            <input className="input" inputMode="decimal" value={form.servingGrams} onChange={set('servingGrams')} />
          </label>
        </div>

        <label className="field">
          <span>Штрих-код (необязательно)</span>
          <input className="input" inputMode="numeric" value={form.barcode} onChange={set('barcode')} placeholder="Цифры под штрих-кодом" />
        </label>

        <div className="label">Есть в составе</div>
        <div className="chips">
          {ALL_TAGS.map((t) => (
            <button key={t} className={'chip' + (form.tags.includes(t) ? ' active warn-chip' : '')} onClick={() => toggleTag(t)}>
              {TAG_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="muted small">Отмечается само по названию. Нужно, чтобы приложение предупреждало, если продукт вам нельзя.</div>

        {error && (
          <div className="warn">
            <IconWarn width={18} height={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-actions">
          {id && (
            <button className="btn outline danger" onClick={remove}>
              Удалить
            </button>
          )}
          <button className="btn primary grow" onClick={save}>
            {date && !id ? `Сохранить и добавить в «${mealLabel(meal)}»` : 'Сохранить'}
          </button>
        </div>
      </main>

      {saved && date && (
        <AmountSheet
          open
          onClose={() => goBack(`/?d=${date}`)}
          name={saved.name}
          subtitle={saved.brand}
          per100={saved}
          servings={saved.servings}
          tags={saved.tags}
          meal={meal}
          submitLabel="Добавить"
          onSubmit={async (r) => {
            await addFoodEntry({ profileId: profile.id, date, meal: r.meal, food: saved, amount: r.amount, unit: r.unit });
            toast(`Добавлено: ${mealLabel(r.meal)}`);
            goBack(`/?d=${date}`, 2);
          }}
        />
      )}
    </div>
  );
}
