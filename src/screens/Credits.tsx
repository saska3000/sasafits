import { TopBar } from '../components/ui';
import { MENU_RECIPES } from '../data/menuRecipes';
import { PHOTO_CREDITS } from '../data/photoCredits';

export function CreditsScreen() {
  return (
    <div className="screen">
      <TopBar back="/profile" title="Откуда фото" right={<span className="topbar-spacer" />} />
      <main className="content">
        <p className="muted small">
          Фотографии блюд взяты с Pinterest для личного пользования. Права на них принадлежат авторам. Нажмите на блюдо, чтобы открыть
          исходный пин.
        </p>
        <ul className="credits">
          {MENU_RECIPES.filter((r) => PHOTO_CREDITS[r.id]).map((r) => (
            <li key={r.id}>
              <img src={r.image} alt="" />
              <a className="credits-dish" href={PHOTO_CREDITS[r.id].source} target="_blank" rel="noreferrer">
                {r.name}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
