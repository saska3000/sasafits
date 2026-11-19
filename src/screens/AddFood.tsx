import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AmountSheet } from '../components/AmountSheet';
import { FoodList } from '../components/FoodList';
import { RecipePic } from '../components/RecipePic';
import { IconBarcode, IconPlus, IconSearch, IconX } from '../components/Icons';
import { Empty, TopBar, toast, useGoBack } from '../components/ui';
import { addFoodEntry, setFavorite, useFavoriteIds, useProfileEntries } from '../lib/diary';
import { isValidDateStr, plural, todayStr } from '../lib/format';
import { recentFoodIds, searchFoods, useAllFoods } from '../lib/foods';
import { guessMeal, mealLabel } from '../lib/nutrition';
import { OffError, saveOffFood, searchOff } from '../lib/off';
import { useCurrentProfile } from '../lib/profiles';
import { addRecipeEntry, calcRecipe, factorOf, portionFor, useRecipes } from '../lib/recipes';
import type { Food, MealType, Recipe } from '../lib/types';

type Tab = 'recent' | 'fav' | 'mine' | 'recipes';
const MEAL_IDS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function AddFoodScreen() {
  const profile = useCurrentProfile();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [params] = useSearchParams();
  const d = params.get('d');
  const date = isValidDateStr(d) ? d : todayStr();
  const mealParam = params.get('meal') as MealType | null;
  const meal: MealType = mealParam && MEAL_IDS.includes(mealParam) ? mealParam : guessMeal();

  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('recent');
  const [picked, setPicked] = useState<Food | null>(null);
  const [pickedRecipe, setPickedRecipe] = useState<Recipe | null>(null);
  const recipes = useRecipes();
  const [offResults, setOffResults] = useState<{ query: string; foods: Food[] } | null>(null);
  const [offLoading, setOffLoading] = useState(false);
  const [offError, setOffError] = useState('');

  const runOff = async () => {
    const qq = query.trim();
    if (qq.length < 2) return;
    setOffLoading(true);
    setOffError('');
    try {
      setOffResults({ query: qq, foods: await searchOff(qq) });
    } catch (e) {
      setOffError(e instanceof OffError ? e.message : 'Не получилось поискать. Попробуйте позже.');
    } finally {
      setOffLoading(false);
    }
  };
  const [added, setAdded] = useState(0);

  const foods = useAllFoods();
  const entries = useProfileEntries(profile.id);
  const favIds = useFavoriteIds(profile.id);

  const byId = useMemo(() => new Map((foods ?? []).map((f) => [f.id, f])), [foods]);

  const list: Food[] = useMemo(() => {
    if (!foods) return [];
    if (query.trim()) return searchFoods(foods, query);
    if (tab === 'recent') {
      return recentFoodIds(entries ?? [])
        .map((id) => byId.get(id))
        .filter((f): f is Food => !!f);
    }
    if (tab === 'fav') {
      return foods.filter((f) => favIds?.has(f.id)).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }
    return foods.filter((f) => f.source !== 'starter').sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [foods, query, tab, entries, byId, favIds]);

  const q = query.trim().toLowerCase().replace(/ё/g, 'е');
  const recipeList: Recipe[] = !recipes
    ? []
    : q
      ? recipes.filter((r) => r.name.toLowerCase().replace(/ё/g, 'е').includes(q)).slice(0, 8)
      : tab === 'recipes'
        ? recipes.filter((r) => r.meals.includes(meal)).concat(recipes.filter((r) => !r.meals.includes(meal)))
        : [];

  const back = `/?d=${date}`;
  const newFoodUrl = `/food/new?d=${date}&meal=${meal}${query.trim() ? `&name=${encodeURIComponent(query.trim())}` : ''}`;

  return (
    <div className="screen">
      <TopBar
        back={back}
        title={
          <div className="add-title">
            <div>{mealLabel(meal)}</div>
            {added > 0 && (
              <div className="muted small">
                добавлено {added} {plural(added, 'продукт', 'продукта', 'продуктов')}
              </div>
            )}
          </div>
        }
        right={
          added > 0 ? (
            <button className="btn small primary" onClick={() => goBack(back)}>
              Готово
            </button>
          ) : (
            <span className="topbar-spacer" />
          )
        }
      />

      <main className="content">
        <div className="search">
          <IconSearch className="search-icon" />
          <input
            className="input"
            type="search"
            placeholder="Найти продукт"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
            autoComplete="off"
          />
          {query && (
            <button className="search-clear" aria-label="Очистить" onClick={() => setQuery('')}>
              <IconX width={18} height={18} />
            </button>
          )}
        </div>

        <div className="add-actions">
          <button className="btn primary" onClick={() => navigate(`/scan?d=${date}&meal=${meal}`)}>
            <IconBarcode width={22} height={22} /> Сканировать
          </button>
          <button className="btn outline wide" onClick={() => navigate(newFoodUrl)}>
            <IconPlus width={20} height={20} /> Вручную
          </button>
        </div>

        {!query.trim() && (
          <div className="segmented">
            <button className={tab === 'recent' ? 'active' : ''} onClick={() => setTab('recent')}>
              Недавние
            </button>
            <button className={tab === 'fav' ? 'active' : ''} onClick={() => setTab('fav')}>
              Избранное
            </button>
            <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>
              Мои
            </button>
            <button className={tab === 'recipes' ? 'active' : ''} onClick={() => setTab('recipes')}>
              Блюда
            </button>
          </div>
        )}

        {recipeList.length > 0 && (
          <>
            {q && <h3 className="group-title">Блюда по рецептам</h3>}
            <ul className="food-list">
              {recipeList.map((r) => (
                <li key={r.id}>
                  <button className="food-row recipe-row" onClick={() => setPickedRecipe(r)}>
                    <RecipePic recipe={r} className="recipe-emoji" />
                    <div className="food-main">
                      <div className="food-name">{r.name}</div>
                    </div>
                    <div className="food-kcal">
                      <b>{Math.round(portionFor(calcRecipe(r), profile).kcal)}</b>
                      <span className="muted small">ккал/порция</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {q && <h3 className="group-title">Продукты</h3>}
          </>
        )}

        {foods && tab !== 'recipes' && list.length === 0 && recipeList.length === 0 && (
          query.trim() ? (
            <Empty title="Ничего не нашлось">
              Попробуйте другое слово или добавьте продукт сами — с этикетки.
              <button className="btn primary" style={{ marginTop: 12 }} onClick={() => navigate(newFoodUrl)}>
                Создать «{query.trim()}»
              </button>
            </Empty>
          ) : tab === 'recent' ? (
            <Empty title="Пока пусто">Здесь появятся продукты, которые вы добавляли. Начните с поиска сверху.</Empty>
          ) : tab === 'fav' ? (
            <Empty title="Нет избранного">Нажмите ☆ в карточке продукта, чтобы он появился здесь.</Empty>
          ) : (
            <Empty title="Своих продуктов пока нет">Добавьте продукт с упаковки — он сохранится здесь.</Empty>
          )
        )}

        {tab !== 'recipes' || q ? <FoodList foods={list} onPick={setPicked} favorites={favIds} /> : null}

        {q.length >= 2 && (
          <>
            {offResults?.query === query.trim() ? (
              <>
                <h3 className="group-title">Open Food Facts — товары из магазинов</h3>
                {offResults.foods.length ? (
                  <FoodList
                    foods={offResults.foods}
                    onPick={async (f) => setPicked(await saveOffFood(f))}
                    favorites={favIds}
                  />
                ) : (
                  <div className="muted small center">В Open Food Facts тоже не нашлось.</div>
                )}
              </>
            ) : (
              <button className="btn outline" onClick={runOff} disabled={offLoading}>
                {offLoading ? 'Ищу…' : `Искать «${query.trim()}» в магазинных товарах`}
              </button>
            )}
            {offError && <div className="hint">{offError}</div>}
          </>
        )}
      </main>

      {pickedRecipe && (
        <AmountSheet
          open
          onClose={() => setPickedRecipe(null)}
          name={pickedRecipe.name}
          per100={calcRecipe(pickedRecipe).per100}
          servings={[{ label: 'порция', grams: calcRecipe(pickedRecipe).portionGrams || 100 }]}
          onlyServings
          initial={{ amount: factorOf(profile), unitLabel: 'порция', unitGrams: calcRecipe(pickedRecipe).portionGrams || 100 }}
          tags={calcRecipe(pickedRecipe).tags}
          meal={meal}
          submitLabel="Добавить"
          onSubmit={async (r) => {
            await addRecipeEntry({ profile, date, meal: r.meal, recipe: pickedRecipe, amount: r.amount });
            setPickedRecipe(null);
            setAdded((n) => n + 1);
            toast(`Добавлено: ${mealLabel(r.meal)}`);
          }}
        />
      )}

      {picked && (
        <AmountSheet
          open
          onClose={() => setPicked(null)}
          name={picked.name}
          subtitle={picked.brand}
          per100={picked}
          servings={picked.servings}
          tags={picked.tags}
          meal={meal}
          submitLabel="Добавить"
          favorite={favIds?.has(picked.id)}
          onToggleFavorite={() => setFavorite(profile.id, picked.id, !favIds?.has(picked.id))}
          onSubmit={async (r) => {
            await addFoodEntry({ profileId: profile.id, date, meal: r.meal, food: picked, amount: r.amount, unit: r.unit });
            setPicked(null);
            setAdded((n) => n + 1);
            toast(`Добавлено: ${mealLabel(r.meal)}`);
          }}
        />
      )}
    </div>
  );
}
