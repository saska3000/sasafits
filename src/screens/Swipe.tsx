import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipePic } from '../components/RecipePic';
import { SwipeDeck, type SwipeDir } from '../components/SwipeDeck';
import { Empty, TopBar, toast } from '../components/ui';
import { fmtKcal, todayStr } from '../lib/format';
import { MEALS, guessMeal, mealLabel } from '../lib/nutrition';
import { useProfiles } from '../lib/profiles';
import {
  MOODS,
  addRecipeEntry,
  calcRecipe,
  castVote,
  fitsMood,
  matchIds,
  portionFor,
  resetVotes,
  useDayTotals,
  useRecipes,
  useVotes,
  type Mood,
  type RecipeCalc,
} from '../lib/recipes';
import { conflicts } from '../lib/restrictions';
import type { MealType, Profile, Recipe } from '../lib/types';

interface Card {
  recipe: Recipe;
  calc: RecipeCalc;
}

/** Простое «перемешивание», одинаковое в пределах одного захода */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function SwipeScreen() {
  const navigate = useNavigate();
  const { profiles, current } = useProfiles();
  const [swiperId, setSwiperId] = useState(current!.id);
  const [meal, setMeal] = useState<MealType>(guessMeal());
  const [mood, setMood] = useState<Mood | null>(null);
  const [seed] = useState(() => String(Math.random()));
  const [match, setMatch] = useState<Card | null>(null);
  // Что уже смахнули в этом заходе — чтобы карточка не мелькала, пока сохраняется голос
  const [swiped, setSwiped] = useState<Set<string>>(() => new Set());
  const date = todayStr();

  const recipes = useRecipes();
  const votes = useVotes(date, meal);
  const totals = useDayTotals(profiles, date);
  const swiper = profiles.find((p) => p.id === swiperId) ?? current!;
  const others = profiles.filter((p) => p.id !== swiper.id);

  const remaining = (p: Profile) => p.goals.kcal - (totals?.get(p.id)?.kcal ?? 0);

  // Все блюда, которые сейчас подходят обоим: по времени, ограничениям и остатку калорий
  const suitable: Card[] = useMemo(() => {
    if (!recipes || !totals) return [];
    return recipes
      .filter((r) => r.meals.includes(meal))
      .map((recipe) => ({ recipe, calc: calcRecipe(recipe) }))
      .filter(({ calc }) => profiles.every((p) => conflicts(calc.tags, p.restrictions).length === 0))
      .filter(({ calc }) => profiles.every((p) => portionFor(calc, p).kcal <= remaining(p)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, totals, meal, profiles]);

  const myVotes = new Map((votes ?? []).filter((v) => v.profileId === swiper.id).map((v) => [v.recipeId, v.liked]));
  const partnerLiked = new Set((votes ?? []).filter((v) => v.profileId !== swiper.id && v.liked).map((v) => v.recipeId));

  const deck: Card[] = useMemo(() => {
    if (!mood) return [];
    return suitable
      .filter((c) => fitsMood(c.recipe, c.calc, mood))
      .filter((c) => !myVotes.has(c.recipe.id) && !swiped.has(`${swiper.id}:${meal}:${c.recipe.id}`))
      .sort((a, b) => {
        const pa = partnerLiked.has(a.recipe.id) ? 0 : 1;
        const pb = partnerLiked.has(b.recipe.id) ? 0 : 1;
        return pa - pb || hash(seed + a.recipe.id) - hash(seed + b.recipe.id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suitable, mood, votes, swiper.id, seed, swiped]);

  const matches = useMemo(() => {
    const ids = new Set(matchIds(votes ?? [], profiles));
    return suitable.filter((c) => ids.has(c.recipe.id));
  }, [votes, profiles, suitable]);

  const myLikesWaiting = suitable.filter((c) => myVotes.get(c.recipe.id) === true && !matches.includes(c));

  const onSwipe = async (card: Card, dir: SwipeDir) => {
    const liked = dir === 'right';
    setSwiped((s) => new Set(s).add(`${swiper.id}:${meal}:${card.recipe.id}`));
    await castVote(date, meal, swiper.id, card.recipe.id, liked);
    if (liked && others.length > 0 && others.every((o) => (votes ?? []).some((v) => v.profileId === o.id && v.recipeId === card.recipe.id && v.liked))) {
      setMatch(card);
    }
  };

  const addForAll = async (card: Card) => {
    for (const p of profiles) await addRecipeEntry({ profile: p, date, meal, recipe: card.recipe });
    toast(`Записано обоим: ${mealLabel(meal)}`);
    setMatch(null);
  };

  const nextSwiper = others[0];

  return (
    <div className="screen swipe-screen">
      <TopBar back="/recipes" title="Что поедим?" right={<span className="topbar-spacer" />} />
      <main className="content">
        {/* Кто свайпает и на какой приём пищи */}
        <div className="segmented">
          {profiles.map((p) => (
            <button key={p.id} className={p.id === swiper.id ? 'active' : ''} onClick={() => setSwiperId(p.id)}>
              Свайпает {p.name}
            </button>
          ))}
        </div>
        <div className="chips scroll-x">
          {MEALS.map((m) => (
            <button key={m.id} className={'chip' + (meal === m.id ? ' active' : '')} onClick={() => setMeal(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="remain-row">
          {profiles.map((p) => (
            <div key={p.id} className="remain">
              <span className="muted small">{p.name}: осталось</span>
              <b className={remaining(p) <= 0 ? 'over' : ''}>{fmtKcal(Math.max(0, remaining(p)))} ккал</b>
            </div>
          ))}
        </div>

        {!mood ? (
          <>
            <h2 className="center" style={{ marginTop: 8 }}>
              Чего хочется, {swiper.name}?
            </h2>
            <div className="moods">
              {MOODS.map((m) => {
                const n = suitable.filter((c) => fitsMood(c.recipe, c.calc, m.id) && !myVotes.has(c.recipe.id)).length;
                return (
                  <button key={m.id} className={'mood' + (m.id === 'any' ? ' wide' : '')} onClick={() => setMood(m.id)} disabled={n === 0}>
                    <span className="mood-emoji">{m.emoji}</span>
                    <span>{m.label}</span>
                    <span className="muted small">{n ? `${n} ${n === 1 ? 'блюдо' : n < 5 ? 'блюда' : 'блюд'}` : 'нет'}</span>
                  </button>
                );
              })}
            </div>
            {suitable.length === 0 && recipes && totals && (
              <Empty title="Ничего не помещается">
                На {mealLabel(meal).toLowerCase()} нет блюд, которые влезают в остаток нормы вам обоим. Попробуйте другой приём пищи или
                что-то лёгкое из продуктов.
              </Empty>
            )}
          </>
        ) : deck.length > 0 ? (
          <>
            <div className="deck-head">
              <button className="chip" onClick={() => setMood(null)}>
                ← {MOODS.find((m) => m.id === mood)?.emoji} {MOODS.find((m) => m.id === mood)?.label}
              </button>
              <span className="muted small">
                осталось {deck.length} {deck.length === 1 ? 'карточка' : deck.length < 5 ? 'карточки' : 'карточек'}
              </span>
            </div>
            <SwipeDeck
              items={deck}
              keyOf={(c) => c.recipe.id}
              onSwipe={onSwipe}
              render={(c) => <RecipeCard card={c} profiles={profiles} swiper={swiper} remaining={remaining} />}
            />
          </>
        ) : (
          <div className="deck-done">
            <div className="empty-icon">🎉</div>
            <div className="empty-title">Карточки закончились</div>
            {nextSwiper && (
              <button className="btn primary" onClick={() => setSwiperId(nextSwiper.id)}>
                Теперь свайпает {nextSwiper.name} →
              </button>
            )}
            <div className="stack" style={{ marginTop: 10 }}>
              <button className="btn outline" onClick={() => setMood(null)}>
                Другое настроение
              </button>
              <button
                className="btn outline"
                onClick={async () => {
                  await resetVotes(date, meal, swiper.id);
                  setSwiped((s) => new Set([...s].filter((k) => !k.startsWith(`${swiper.id}:${meal}:`))));
                }}
              >
                Пересвайпать заново
              </button>
            </div>
          </div>
        )}

        {matches.length > 0 && (
          <section className="card matches">
            <h2>💞 Мэтчи на {mealLabel(meal).toLowerCase()}</h2>
            <ul className="food-list">
              {matches.map((c) => (
                <li key={c.recipe.id}>
                  <button className="food-row recipe-row" onClick={() => setMatch(c)}>
                    <RecipePic recipe={c.recipe} className="recipe-emoji" />
                    <div className="food-main">
                      <div className="food-name">{c.recipe.name}</div>
                      <div className="muted small">{profiles.map((p) => `${p.name} ${fmtKcal(portionFor(c.calc, p).kcal)}`).join(' · ')} ккал</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {myLikesWaiting.length > 0 && others[0] && (
          <div className="muted small center">
            {swiper.name}: понравилось {myLikesWaiting.length} — ждём, что выберет {others[0].name}
          </div>
        )}
      </main>

      {match && (
        <div className="match-overlay" onClick={() => setMatch(null)}>
          <div className="match-box" onClick={(e) => e.stopPropagation()}>
            <div className="match-title">Это мэтч! 💞</div>
            <div className="match-sub">Вы оба хотите</div>
            <div className="match-pic">
              <RecipePic recipe={match.recipe} />
            </div>
            <div className="match-name">{match.recipe.name}</div>
            <div className="match-kcal">
              {profiles.map((p) => (
                <span key={p.id}>
                  {p.name}: {fmtKcal(portionFor(match.calc, p).kcal)} ккал
                </span>
              ))}
            </div>
            <div className="stack">
              <button className="btn primary big" onClick={() => addForAll(match)}>
                Записать нам обоим в дневник
              </button>
              <button className="btn match-ghost" onClick={() => navigate(`/recipe/${match.recipe.id}?meal=${meal}`)}>
                Открыть рецепт
              </button>
              <button className="btn match-ghost" onClick={() => setMatch(null)}>
                Свайпать дальше
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeCard({
  card,
  profiles,
  swiper,
  remaining,
}: {
  card: Card;
  profiles: Profile[];
  swiper: Profile;
  remaining: (p: Profile) => number;
}) {
  const { recipe, calc } = card;
  const mine = portionFor(calc, swiper);
  return (
    <div className="rcard">
      <div className={`rcard-pic g${hash(recipe.id) % 3}`}>
        <RecipePic recipe={recipe} />
      </div>
      <div className="rcard-body">
        <div className="rcard-name">{recipe.name}</div>
        <div className="rcard-kcal">
          <b>{fmtKcal(mine.kcal)}</b> ккал · Б {Math.round(mine.p)} · Ж {Math.round(mine.f)} · У {Math.round(mine.c)}
        </div>
        <div className="muted small">
          {recipe.timeMin ? `⏱ ${recipe.timeMin} мин · ` : ''}
          после него останется: {profiles.map((p) => `${p.name} ${fmtKcal(remaining(p) - portionFor(calc, p).kcal)}`).join(', ')}
        </div>
      </div>
    </div>
  );
}
