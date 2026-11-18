import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmountSheet } from '../components/AmountSheet';
import { FoodList } from '../components/FoodList';
import { IconPlus, IconSearch, IconX } from '../components/Icons';
import { Empty, TopBar, toast } from '../components/ui';
import { addFoodEntry, setFavorite, useFavoriteIds } from '../lib/diary';
import { todayStr } from '../lib/format';
import { STARTER, searchFoods, useAllFoods } from '../lib/foods';
import { guessMeal, mealLabel } from '../lib/nutrition';
import { useCurrentProfile } from '../lib/profiles';
import type { Food } from '../lib/types';

type Tab = 'mine' | 'fav' | 'base';

export function ProductsScreen() {
  const profile = useCurrentProfile();
  const navigate = useNavigate();
  const foods = useAllFoods();
  const favIds = useFavoriteIds(profile.id);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('mine');
  const [picked, setPicked] = useState<Food | null>(null);

  const mine = useMemo(
    () => (foods ?? []).filter((f) => f.source !== 'starter').sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [foods],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Food[]>();
    for (const f of STARTER) {
      const k = f.cat ?? 'Другое';
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(f);
    }
    return [...map.entries()];
  }, []);

  const searching = query.trim().length > 0;
  const results = searching && foods ? searchFoods(foods, query) : [];
  const favs = (foods ?? []).filter((f) => favIds?.has(f.id));

  return (
    <div className="screen">
      <TopBar title="Продукты" />
      <main className="content">
        <div className="search">
          <IconSearch className="search-icon" />
          <input
            className="input"
            type="search"
            placeholder="Найти продукт"
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

        <button className="btn outline wide" onClick={() => navigate('/food/new')}>
          <IconPlus width={20} height={20} /> Добавить свой продукт
        </button>

        {searching ? (
          results.length ? <FoodList foods={results} onPick={setPicked} favorites={favIds} /> : <Empty title="Ничего не нашлось" />
        ) : (
          <>
            <div className="segmented">
              <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>
                Мои ({mine.length})
              </button>
              <button className={tab === 'fav' ? 'active' : ''} onClick={() => setTab('fav')}>
                Избранное
              </button>
              <button className={tab === 'base' ? 'active' : ''} onClick={() => setTab('base')}>
                Базовые
              </button>
            </div>
            {tab === 'mine' &&
              (mine.length ? (
                <FoodList foods={mine} onPick={setPicked} favorites={favIds} />
              ) : (
                <Empty title="Своих продуктов пока нет">
                  Добавьте продукт с упаковки: название и КБЖУ на 100 г. Он будет находиться в поиске.
                </Empty>
              ))}
            {tab === 'fav' &&
              (favs.length ? (
                <FoodList foods={favs} onPick={setPicked} favorites={favIds} />
              ) : (
                <Empty title="Нет избранного">Нажмите ☆ в карточке продукта — и он будет здесь.</Empty>
              ))}
            {tab === 'base' &&
              grouped.map(([cat, list]) => (
                <section key={cat}>
                  <h3 className="group-title">{cat}</h3>
                  <FoodList foods={list} onPick={setPicked} favorites={favIds} />
                </section>
              ))}
          </>
        )}
      </main>

      {picked && (
        <AmountSheet
          open
          onClose={() => setPicked(null)}
          name={picked.name}
          subtitle={picked.brand}
          per100={picked}
          servings={picked.servings}
          tags={picked.tags}
          meal={guessMeal()}
          submitLabel="В дневник за сегодня"
          favorite={favIds?.has(picked.id)}
          onToggleFavorite={() => setFavorite(profile.id, picked.id, !favIds?.has(picked.id))}
          onEdit={picked.source !== 'starter' ? () => navigate(`/food/${picked.id}/edit`) : undefined}
          onSubmit={async (r) => {
            await addFoodEntry({ profileId: profile.id, date: todayStr(), meal: r.meal, food: picked, amount: r.amount, unit: r.unit });
            setPicked(null);
            toast(`Добавлено: ${mealLabel(r.meal)}, сегодня`);
          }}
        />
      )}
    </div>
  );
}
