import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconPlus, IconSearch, IconWarn, IconX } from '../components/Icons';
import { RecipePic } from '../components/RecipePic';
import { Empty, TopBar } from '../components/ui';
import { fmtKcal } from '../lib/format';
import { MEALS } from '../lib/nutrition';
import { useCurrentProfile } from '../lib/profiles';
import { calcRecipe, portionFor, useRecipes } from '../lib/recipes';
import { conflicts } from '../lib/restrictions';
import type { MealType } from '../lib/types';

export function RecipesScreen() {
  const profile = useCurrentProfile();
  const navigate = useNavigate();
  const recipes = useRecipes();
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState<MealType | 'all'>('all');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/ё/g, 'е');
    return (recipes ?? [])
      .filter((r) => meal === 'all' || r.meals.includes(meal))
      .filter((r) => !q || r.name.toLowerCase().replace(/ё/g, 'е').includes(q))
      .map((r) => ({ r, calc: calcRecipe(r) }));
  }, [recipes, query, meal]);

  return (
    <div className="screen">
      <TopBar title="Рецепты" />
      <main className="content">
        <Link to="/swipe" className="swipe-cta">
          <span className="swipe-cta-emoji">💞</span>
          <span>
            <b>Что поедим?</b>
            <span className="small">Свайпайте вдвоём — совпадение покажет, что приготовить</span>
          </span>
        </Link>

        <div className="search">
          <IconSearch className="search-icon" />
          <input
            className="input"
            type="search"
            placeholder="Найти рецепт"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button className="search-clear" aria-label="Очистить" onClick={() => setQuery('')}>
              <IconX width={18} height={18} />
            </button>
          )}
        </div>

        <div className="chips scroll-x">
          <button className={'chip' + (meal === 'all' ? ' active' : '')} onClick={() => setMeal('all')}>
            Все
          </button>
          {MEALS.map((m) => (
            <button key={m.id} className={'chip' + (meal === m.id ? ' active' : '')} onClick={() => setMeal(m.id)}>
              {m.label}
            </button>
          ))}
        </div>

        <button className="btn outline wide" onClick={() => navigate('/recipe/new')}>
          <IconPlus width={20} height={20} /> Новый рецепт
        </button>

        {recipes && list.length === 0 && <Empty title="Ничего не нашлось" />}

        <ul className="food-list">
          {list.map(({ r, calc }) => {
            const mine = portionFor(calc, profile);
            const bad = conflicts(calc.tags, profile.restrictions).length > 0;
            return (
              <li key={r.id}>
                <Link to={`/recipe/${r.id}`} className="food-row recipe-row">
                  <RecipePic recipe={r} className="recipe-emoji" />
                  <div className="food-main">
                    <div className="food-name">
                      {bad && <IconWarn className="warn-icon" width={16} height={16} />}
                      {r.name}
                    </div>
                    <div className="muted small">
                      {r.timeMin ? `${r.timeMin} мин · ` : ''}Б {Math.round(mine.p)} · Ж {Math.round(mine.f)} · У {Math.round(mine.c)}
                    </div>
                  </div>
                  <div className="food-kcal">
                    <b>{fmtKcal(mine.kcal)}</b>
                    <span className="muted small">ккал/порция</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
