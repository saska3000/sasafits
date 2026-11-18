import { fmtKcal, fmtNum } from '../lib/format';
import { useCurrentProfile } from '../lib/profiles';
import { conflicts } from '../lib/restrictions';
import type { Food } from '../lib/types';
import { IconStar, IconWarn } from './Icons';

export function FoodList({ foods, onPick, favorites }: { foods: Food[]; onPick: (f: Food) => void; favorites?: Set<string> }) {
  const profile = useCurrentProfile();
  return (
    <ul className="food-list">
      {foods.map((f) => {
        const bad = conflicts(f.tags, profile.restrictions).length > 0;
        const serving = f.servings?.[0];
        return (
          <li key={f.id}>
            <button className="food-row" onClick={() => onPick(f)}>
              <div className="food-main">
                <div className="food-name">
                  {bad && <IconWarn className="warn-icon" width={16} height={16} />}
                  {f.name}
                  {favorites?.has(f.id) && <IconStar filled className="fav-mini" width={14} height={14} />}
                </div>
                <div className="muted small">
                  {f.brand ? `${f.brand} · ` : ''}
                  {serving ? `${serving.label} = ${fmtNum(serving.grams, 0)} г · ` : ''}
                  {f.source === 'user' ? 'мой продукт' : f.source === 'off' ? 'из магазина' : (f.cat ?? '')}
                </div>
              </div>
              <div className="food-kcal">
                <b>{fmtKcal(f.kcal)}</b>
                <span className="muted small">ккал/100 г</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
