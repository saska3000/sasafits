import type { PetMood } from '../lib/pet';
import { Monster } from './Monster';

/** Питомица с лёгкими значками настроения поверх: цветочек, «z-z», искорки */
export function PetPhoto({ mood, celebrate, name }: { mood: PetMood; celebrate: boolean; name: string }) {
  return (
    <div className={`pet-figure pet-photo mood-${mood}${celebrate ? ' celebrate' : ''}`}>
      <Monster mood={mood} celebrate={celebrate} />
      <span className="sr-only">{name}</span>
      {mood === 'joy' && (
        <svg className="pet-badge pet-flower" viewBox="-12 -12 24 24" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx={0} cy={-5} rx={3.8} ry={5.6} transform={`rotate(${r})`} fill="#ffffff" stroke="#efb8c8" strokeWidth={0.7} />
          ))}
          <circle r={3} fill="#f2d36b" />
        </svg>
      )}
      {mood === 'full' && (
        <span className="pet-badge pet-zzz" aria-hidden="true">
          z<small>z</small>
        </span>
      )}
      {celebrate && (
        <svg className="pet-sparkles" viewBox="0 0 100 100" aria-hidden="true">
          <g stroke="#f0b75a" strokeWidth={2.2} strokeLinecap="round">
            <path d="M12 30 v10 M7 35 h10" />
            <path d="M86 18 v10 M81 23 h10" />
            <path d="M90 62 v8 M86 66 h8" />
            <path d="M8 70 v7 M4.5 73.5 h7" />
          </g>
        </svg>
      )}
    </div>
  );
}
