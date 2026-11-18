import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FoodList } from '../components/FoodList';
import { RecipePic, photoToDataUrl } from '../components/RecipePic';
import { IconPlus, IconSearch, IconTrash, IconWarn } from '../components/Icons';
import { Sheet, TopBar, toast, useGoBack } from '../components/ui';
import { db } from '../lib/db';
import { searchFoods, useAllFoods } from '../lib/foods';
import { fmtG, fmtKcal, fmtNum, parseNum } from '../lib/format';
import { MEALS } from '../lib/nutrition';
import { calcRecipe, saveRecipe } from '../lib/recipes';
import type { Food, MealType, RecipeIngredient, RecipeKind } from '../lib/types';

const EMOJIS = ['🍽️', '🥗', '🍲', '🍛', '🍝', '🍗', '🥩', '🍳', '🥞', '🧆', '🌯', '🌮', '🥙', '🍣', '🍜', '🥣', '🍕', '🍔', '🥪', '🍧', '🍨', '🍓', '🍌', '🥤', '🧀', '🥕', '🥒', '🍅'];

const KINDS: { id: RecipeKind; label: string }[] = [
  { id: 'meat', label: 'Мясное' },
  { id: 'sweet', label: 'Сладкое' },
];

const MEAT_WORDS = ['кур', 'говя', 'свин', 'индей', 'фарш', 'бедр', 'груд', 'ветчин', 'колбас', 'сосиск', 'печен'];

export function RecipeFormScreen() {
  const { id } = useParams();
  const goBack = useGoBack();
  const [loaded, setLoaded] = useState(!id);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const [image, setImage] = useState<string | undefined>(undefined);
  const photoRef = useRef<HTMLInputElement>(null);
  const [meals, setMeals] = useState<MealType[]>(['lunch', 'dinner']);
  const [kinds, setKinds] = useState<RecipeKind[]>([]);
  const [kindsTouched, setKindsTouched] = useState(false);
  const [time, setTime] = useState('');
  const [servingsStr, setServingsStr] = useState('2');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [stepsText, setStepsText] = useState('');
  const [portionNote, setPortionNote] = useState('');
  const [note, setNote] = useState('');
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    db.recipes.get(id).then((r) => {
      if (r) {
        setName(r.name);
        setEmoji(r.emoji ?? '🍽️');
        setImage(r.image);
        setMeals(r.meals);
        setKinds(r.kinds);
        setKindsTouched(true);
        setTime(r.timeMin ? String(r.timeMin) : '');
        setServingsStr(fmtNum(r.servings));
        setIngredients(r.ingredients);
        setStepsText(r.steps.join('\n'));
        setPortionNote(r.portionNote ?? '');
        setNote(r.note ?? '');
      }
      setLoaded(true);
    });
  }, [id]);

  const servings = parseNum(servingsStr);
  const calc = calcRecipe({ ingredients, servings: servings > 0 ? servings : 1 });

  const setIngs = (list: RecipeIngredient[]) => {
    setIngredients(list);
    if (!kindsTouched) {
      const hasMeat = list.some((i) => MEAT_WORDS.some((w) => i.name.toLowerCase().includes(w)));
      setKinds((k) => (hasMeat ? [...new Set<RecipeKind>([...k, 'meat'])] : k.filter((x) => x !== 'meat')));
    }
  };

  const addFood = (f: Food, grams: number) => {
    setIngs([
      ...ingredients,
      {
        foodId: f.id,
        name: f.name,
        grams,
        amountText: `${fmtNum(grams, 0)} г`,
        per100: { kcal: f.kcal, p: f.p, f: f.f, c: f.c },
        tags: f.tags,
      },
    ]);
  };

  const setGrams = (idx: number, v: string) => {
    const g = parseNum(v);
    setIngs(
      ingredients.map((i, n) => (n === idx ? { ...i, grams: g > 0 ? g : 0, amountText: g > 0 ? `${fmtNum(g, 0)} г` : i.amountText } : i)),
    );
  };

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const save = async () => {
    setError('');
    if (!name.trim()) return setError('Напишите название блюда.');
    if (!ingredients.length) return setError('Добавьте хотя бы один продукт.');
    if (!(servings > 0)) return setError('Укажите, на сколько порций рецепт.');
    if (!meals.length) return setError('Отметьте, когда это едят: завтрак, обед…');
    const t = parseNum(time);
    const r = await saveRecipe({
      id,
      name: name.trim(),
      emoji,
      image,
      meals,
      kinds,
      timeMin: t > 0 ? Math.round(t) : undefined,
      servings,
      ingredients,
      steps: stepsText
        .split('\n')
        .map((s) => s.replace(/^\s*\d+[.)]\s*/, '').trim())
        .filter(Boolean),
      portionNote: portionNote.trim() || undefined,
      note: note.trim() || undefined,
    });
    toast('Рецепт сохранён');
    goBack(`/recipe/${r.id}`);
  };

  if (!loaded) return null;

  return (
    <div className="screen">
      <TopBar back title={id ? 'Изменить рецепт' : 'Новый рецепт'} right={<span className="topbar-spacer" />} />
      <main className="content form">
        <label className="field">
          <span>Название</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Паста с курицей" />
        </label>

        <div className="label">Картинка</div>
        <div className="photo-row">
          <RecipePic recipe={{ image, emoji, name }} className="photo-preview" />
          <div className="stack grow">
            <button className="btn outline" onClick={() => photoRef.current?.click()}>
              📷 {image ? 'Другое фото' : 'Добавить фото'}
            </button>
            {image && (
              <button className="btn outline danger" onClick={() => setImage(undefined)}>
                Убрать фото
              </button>
            )}
          </div>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try {
                setImage(await photoToDataUrl(f));
              } catch {
                toast('Не получилось открыть фото');
              }
            }}
          />
        </div>
        <div className="muted small">Если фото нет — будет смайлик:</div>
        <div className="emoji-pick">
          {EMOJIS.map((e) => (
            <button key={e} className={emoji === e ? 'active' : ''} onClick={() => setEmoji(e)}>
              {e}
            </button>
          ))}
        </div>

        <div className="label">Когда едим</div>
        <div className="chips">
          {MEALS.map((m) => (
            <button key={m.id} className={'chip' + (meals.includes(m.id) ? ' active' : '')} onClick={() => setMeals(toggle(meals, m.id))}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="label">Какое блюдо (для подбора свайпами)</div>
        <div className="chips">
          {KINDS.map((k) => (
            <button
              key={k.id}
              className={'chip' + (kinds.includes(k.id) ? ' active' : '')}
              onClick={() => {
                setKindsTouched(true);
                setKinds(toggle(kinds, k.id));
              }}
            >
              {k.label}
            </button>
          ))}
        </div>

        <div className="grid2">
          <label className="field">
            <span>Сколько порций выходит</span>
            <input className="input" inputMode="decimal" value={servingsStr} onChange={(e) => setServingsStr(e.target.value)} />
          </label>
          <label className="field">
            <span>Время, мин</span>
            <input className="input" inputMode="numeric" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <section className="card">
          <h2>Продукты</h2>
          {ingredients.length === 0 && <div className="muted small">Пока пусто. Добавьте продукты с граммовкой на всё блюдо.</div>}
          <ul className="ing-edit">
            {ingredients.map((i, n) => (
              <li key={`${n}-${i.name}-${i.grams}`}>
                <div className="ing-name">
                  {i.name}
                  <span className="muted small">{fmtKcal(((i.per100?.kcal ?? 0) * i.grams) / 100)} ккал</span>
                </div>
                <input
                  className="input"
                  inputMode="decimal"
                  aria-label={`Граммы: ${i.name}`}
                  defaultValue={fmtNum(i.grams, 1)}
                  onBlur={(e) => setGrams(n, e.target.value)}
                />
                <span className="muted small">г</span>
                <button className="icon-btn" aria-label="Убрать" onClick={() => setIngs(ingredients.filter((_, k) => k !== n))}>
                  <IconTrash width={20} height={20} />
                </button>
              </li>
            ))}
          </ul>
          <button className="btn outline" onClick={() => setPicking(true)}>
            <IconPlus width={20} height={20} /> Добавить продукт
          </button>
          <div className="calc small">
            <div>
              <b>Одна порция:</b> {fmtKcal(calc.portion.kcal)} ккал · Б {fmtG(calc.portion.p)} · Ж {fmtG(calc.portion.f)} · У{' '}
              {fmtG(calc.portion.c)}
            </div>
            <div className="muted">Всё блюдо: {fmtKcal(calc.total.kcal)} ккал. Порция парня считается ×1,2 (меняется в профиле).</div>
          </div>
        </section>

        <label className="field">
          <span>Шаги — каждый с новой строки</span>
          <textarea className="input textarea" rows={6} value={stepsText} onChange={(e) => setStepsText(e.target.value)} />
        </label>
        <label className="field">
          <span>Порции (необязательно)</span>
          <input className="input" value={portionNote} onChange={(e) => setPortionNote(e.target.value)} placeholder="Тебе 150 г, ему 200 г" />
        </label>
        <label className="field">
          <span>Заметка (необязательно)</span>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        {error && (
          <div className="warn">
            <IconWarn width={18} height={18} />
            <span>{error}</span>
          </div>
        )}
        <button className="btn primary" onClick={save}>
          Сохранить рецепт
        </button>
      </main>

      <IngredientPicker open={picking} onClose={() => setPicking(false)} onPick={addFood} />
    </div>
  );
}

function IngredientPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (f: Food, grams: number) => void }) {
  const foods = useAllFoods();
  const [query, setQuery] = useState('');
  const [chosen, setChosen] = useState<Food | null>(null);
  const [grams, setGrams] = useState('100');
  const results = foods && query.trim() ? searchFoods(foods, query, 30) : [];

  const close = () => {
    setChosen(null);
    setQuery('');
    onClose();
  };

  return (
    <Sheet open={open} onClose={close} title={chosen ? chosen.name : 'Добавить продукт'}>
      {chosen ? (
        <>
          <label className="field">
            <span>Сколько граммов во всём блюде</span>
            <input className="input big" inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} autoFocus />
          </label>
          {chosen.servings?.[0] && (
            <div className="chips">
              {[1, 2, 3, 4].map((k) => (
                <button key={k} className="chip" onClick={() => setGrams(String(k * chosen.servings![0].grams))}>
                  {k} × {chosen.servings![0].label}
                </button>
              ))}
            </div>
          )}
          <div className="sheet-actions">
            <button className="btn outline" onClick={() => setChosen(null)}>
              Назад
            </button>
            <button
              className="btn primary grow"
              disabled={!(parseNum(grams) > 0)}
              onClick={() => {
                onPick(chosen, parseNum(grams));
                close();
              }}
            >
              Добавить
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="search">
            <IconSearch className="search-icon" />
            <input className="input" type="search" placeholder="Найти продукт" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
          </div>
          <FoodList
            foods={results}
            onPick={(f) => {
              setChosen(f);
              setGrams(f.servings?.[0] ? String(f.servings[0].grams) : '100');
            }}
          />
          {query.trim() && results.length === 0 && <div className="muted small">Не нашлось. Сначала добавьте продукт во вкладке «Продукты».</div>}
        </>
      )}
    </Sheet>
  );
}
