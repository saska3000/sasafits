import { useProfiles } from '../lib/profiles';

export function WelcomeScreen() {
  const { profiles, setCurrent } = useProfiles();
  return (
    <div className="welcome">
      <img className="welcome-logo" src="./favicon.svg" alt="" width="96" height="96" />
      <h1>SasaFits</h1>
      <p className="muted">Кто пользуется этим устройством?</p>
      <div className="stack">
        {profiles.map((p) => (
          <button key={p.id} className="btn primary big" onClick={() => setCurrent(p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      <p className="muted small">Переключиться и поменять имя, цели и норму можно потом в профиле.</p>
    </div>
  );
}
