import { TopBar } from '../components/ui';
import { MENU_RECIPES } from '../data/menuRecipes';
import { PHOTO_CREDITS } from '../data/photoCredits';

export function CreditsScreen() {
  return (
    <div className="screen">
      <TopBar back="/profile" title="Авторы фото" right={<span className="topbar-spacer" />} />
      <main className="content">
        <p className="muted small">
          Фотографии блюд — со свободными лицензиями (Flickr, Wikimedia и другие, через Openverse). Спасибо авторам! У всех фото удалён
          фон.
        </p>
        <ul className="credits">
          {MENU_RECIPES.filter((r) => PHOTO_CREDITS[r.id]).map((r) => {
            const c = PHOTO_CREDITS[r.id];
            return (
              <li key={r.id}>
                <img src={r.image} alt="" />
                <div>
                  <div className="credits-dish">{r.name}</div>
                  <div className="muted small">
                    «
                    <a href={c.source} target="_blank" rel="noreferrer">
                      {c.title || 'фото'}
                    </a>
                    », автор{' '}
                    {c.creatorUrl ? (
                      <a href={c.creatorUrl} target="_blank" rel="noreferrer">
                        {c.creator}
                      </a>
                    ) : (
                      c.creator
                    )}
                    ,{' '}
                    {c.licenseUrl ? (
                      <a href={c.licenseUrl} target="_blank" rel="noreferrer">
                        {c.license}
                      </a>
                    ) : (
                      c.license
                    )}
                    , изменено
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
