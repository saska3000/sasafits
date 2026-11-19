import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AmountSheet } from '../components/AmountSheet';
import { IconWarn } from '../components/Icons';
import { RecipePic } from '../components/RecipePic';
import { Empty, TopBar, toast, useGoBack } from '../components/ui';
import { fmtG, fmtKcal, fmtNum, isValidDateStr, plural, todayStr } from '../lib/format';
import { guessMeal, mealLabel } from '../lib/nutrition';
import { PHOTO_CREDITS } from '../data/photoCredits';
import { useCurrentProfile } from '../lib/profiles';
import { addRecipeEntry, calcRecipe, deleteRecipe, factorOf, portionFor, useRecipe } from '../lib/recipes';
import { conflictText, conflicts } from '../lib/restrictions';
import type { MealType } from '../lib/types';

export function RecipeDetailScreen() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const profile = useCurrentProfile();
  const recipe = useRecipe(id);
  const [adding, setAdding] = useState(false);

  const d = params.get('d');
  const date = isValidDateStr(d) ? d : todayStr();
  const meal = (params.get('meal') as MealType | null) ?? guessMeal();

  if (recipe === undefined) return null;
  if (recipe === null || recipe.deleted) {
    return (
      <div className="screen">
        <TopBar back="/recipes" title="Рецепт" />
        <Empty title="Рецепт не найден" />
      </div>
    );
  }

  const calc = calcRecipe(recipe);
  const mine = portionFor(calc, profile);
  const factor = factorOf(profile);
  const bad = conflicts(calc.tags, profile.restrictions);

  const remove = async () => {
    if (!confirm('Удалить рецепт? Записи в дневнике останутся.')) return;
    await deleteRecipe(recipe.id);
    toast('Рецепт удалён');
    goBack('/recipes');
  };

  return (
    <div className="screen">
      <TopBar back="/recipes" title="Рецепт" />
      <main className="content">
        <section className="recipe-hero">
          <RecipePic recipe={recipe} className="recipe-hero-pic" />
          {PHOTO_CREDITS[recipe.id] && recipe.image?.startsWith('recipes/') && (
            <div className="photo-credit">
              Фото:{' '}
              <a href={PHOTO_CREDITS[recipe.id].source} target="_blank" rel="noreferrer">
                Pinterest
              </a>
            </div>
          )}
          <h1>{recipe.name}</h1>
          <div className="muted small">
            {recipe.timeMin ? `⏱ ${recipe.timeMin} мин · ` : ''}
            {recipe.meals.map(mealLabel).join(', ')} ·{' '}
            {recipe.servings === 1
              ? 'на 1 порцию'
              : `выход ≈ ${fmtNum(recipe.servings)} ${Number.isInteger(recipe.servings) ? plural(recipe.servings, 'порция', 'порции', 'порций') : 'порции'}`}
          </div>
        </section>

        {bad.length > 0 && (
          <div className="warn">
            <IconWarn width={18} height={18} />
            <span>{conflictText(bad)}</span>
          </div>
        )}

        <section className="card">
          <div className="label" style={{ marginTop: 0 }}>
            Ваша порция{factor !== 1 ? ` (×${fmtNum(factor, 2)})` : ''}
          </div>
          <div className="amount-result" style={{ marginTop: 8 }}>
            <div>
              <div className="big-num">{fmtKcal(mine.kcal)}</div>
              <div className="muted small">ккал</div>
            </div>
            <div className="amount-macros">
              <div>
                <b>{fmtG(mine.p)}</b>
                <span className="muted small">белки</span>
              </div>
              <div>
                <b>{fmtG(mine.f)}</b>
                <span className="muted small">жиры</span>
              </div>
              <div>
                <b>{fmtG(mine.c)}</b>
                <span className="muted small">углеводы</span>
              </div>
            </div>
          </div>
          {recipe.portionNote && <p className="small recipe-portion">🍽 {recipe.portionNote}</p>}
          <button className="btn primary" style={{ width: '100%' }} onClick={() => setAdding(true)}>
            Добавить в дневник
          </button>
        </section>

        <section className="card">
          <h2>Продукты</h2>
          <ul className="ing-list">
            {recipe.ingredients.map((i, n) => (
              <li key={n}>
                <span>
                  {i.name}
                  {i.note && <span className="muted small"> · {i.note}</span>}
                </span>
                <span className="muted">{i.amountText ?? `${fmtNum(i.grams, 0)} г`}</span>
              </li>
            ))}
          </ul>
          <div className="muted small">Всё блюдо: {fmtKcal(calc.total.kcal)} ккал</div>
        </section>

        {recipe.steps.length > 0 && (
          <section className="card">
            <h2>Как готовить</h2>
            <ol className="steps">
              {recipe.steps.map((s, n) => (
                <li key={n}>{s}</li>
              ))}
            </ol>
          </section>
        )}

        {recipe.note && <div className="hint">{recipe.note}</div>}

        <div className="form-actions">
          <button className="btn outline danger" onClick={remove}>
            Удалить
          </button>
          <button className="btn outline grow" onClick={() => navigate(`/recipe/${recipe.id}/edit`)}>
            Изменить рецепт
          </button>
        </div>
      </main>

      {adding && (
        <AmountSheet
          open
          onClose={() => setAdding(false)}
          name={recipe.name}
          per100={calc.per100}
          servings={[{ label: 'порция', grams: calc.portionGrams || 100 }]}
          onlyServings
          initial={{ amount: factor, unitLabel: 'порция', unitGrams: calc.portionGrams || 100 }}
          tags={calc.tags}
          meal={meal}
          submitLabel="Добавить"
          onSubmit={async (r) => {
            await addRecipeEntry({ profile, date, meal: r.meal, recipe, amount: r.amount });
            setAdding(false);
            toast(`Добавлено: ${mealLabel(r.meal)}`);
          }}
        />
      )}
    </div>
  );
}
