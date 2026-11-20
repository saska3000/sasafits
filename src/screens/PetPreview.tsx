import { Monster } from '../components/Monster';
import type { PetMood } from '../lib/pet';

/** Страница для проверки рисунка (открывается только при разработке): все настроения крупно */
export function PetPreview() {
  const moods: [PetMood, string][] = [
    ['eating', 'обычная'],
    ['hungry', 'голодная'],
    ['joy', 'довольная'],
    ['full', 'объелась'],
    ['sleep', 'спит'],
  ];
  return (
    <main className="content" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {moods.map(([m, label]) => (
          <div key={m} className="card" style={{ textAlign: 'center', padding: 10 }}>
            <Monster mood={m} />
            <span className="muted">{label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
