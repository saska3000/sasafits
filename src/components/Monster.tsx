import { useId } from 'react';
import type { PetMood } from '../lib/pet';

/*
 * Простая дудл-монстрика «Пухлик»: розовое тельце, кошачьи ушки, один большой глаз с ресничками,
 * два клычка, ручки и ножки-палочки.
 * Настроение: обычная — стоит, руки опущены; довольная — глаз-дужка, ручки вверх;
 * голодная — лежит без сил с открытым ротиком; объелась — стоит «грушей» с большими боками.
 */

const PINK = '#ff8cc4';
const INK = '#1f1c1d';

const BODY = 'M100 66 C141 64 166 86 164 118 C162 151 137 169 100 168 C62 168 36 150 36 118 C34 88 60 68 100 66 Z';
const EARS = ['M55 86 L60 48 L84 74 Z', 'M145 86 L140 48 L116 74 Z'];
// объелась — «груша»: сверху обычное туловище, книзу крупные круглые бока
const PEAR =
  'M100 66 C141 64 162 84 162 108 C162 122 184 134 184 156 C184 180 150 188 100 188 C50 188 16 180 16 156 C16 134 38 122 38 108 C38 84 59 68 100 66 Z';
const EX = 100;
const EY = 112;
const ER = 22;
const MOUTH_Y = 141;

export function Monster({ mood, celebrate, className = '' }: { mood: PetMood; celebrate?: boolean; className?: string }) {
  const id = 'd' + useId().replace(/[^a-zA-Z0-9]/g, '');
  // голодная лежит без сил; объевшаяся стоит «грушей»; глаз у обеих сонный
  const lying = mood === 'hungry';
  const sleepy = mood === 'hungry' || mood === 'full';
  const arms =
    mood === 'joy'
      ? ['M40 120 Q26 100 30 78', 'M160 120 Q174 100 170 78']
      : mood === 'full'
        ? ['M40 116 Q22 116 18 132', 'M160 116 Q178 116 182 132']
        : ['M40 120 Q30 136 30 150', 'M160 120 Q170 136 170 150'];

  return (
    <svg className={`doodle ${celebrate ? 'celebrate' : ''} ${className}`} viewBox="0 0 200 220" role="img" aria-label="Питомица">
      <defs>
        {/* чуть неровные, «нарисованные от руки» края */}
        <filter id={`${id}-hand`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <ellipse cx={100} cy={lying ? 207 : 201} rx={lying ? 72 : 40} ry={4} fill="rgba(40,30,30,0.08)" />
      {/* голодная лежит — поворачиваем на бок */}
      <g transform={lying ? 'translate(0 18) rotate(-90 100 120)' : undefined}>
        <g className="doodle-body" filter={`url(#${id}-hand)`}>
          {[84, 116].map((x, i) => {
            const dir = i ? 1 : -1;
            return (
              <g key={x}>
                <path d={`M${x} 165 L${x + dir * 2} 196`} stroke={PINK} strokeWidth={5} strokeLinecap="round" />
                <path
                  d={`M${x + dir * 2} 196 q${dir * 6} 3 ${dir * 9} 0`}
                  stroke={PINK}
                  strokeWidth={5}
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            );
          })}
          {arms.map((d) => (
            <path key={d} d={d} fill="none" stroke={PINK} strokeWidth={5} strokeLinecap="round" />
          ))}
          {mood === 'joy' && [30, 170].map((x) => <circle key={x} cx={x} cy={75} r={4.5} fill={PINK} />)}
          {EARS.map((d) => (
            <path key={d} d={d} fill={PINK} stroke={PINK} strokeWidth={6} strokeLinejoin="round" />
          ))}
          <path d={mood === 'full' ? PEAR : BODY} fill={PINK} />
          {/* круглое пузико с пупком */}
          {mood === 'full' && (
            <>
              <ellipse cx={100} cy={162} rx={54} ry={20} fill="#ffa8d2" />
              <path d="M97 166 q3 4 6 0" fill="none" stroke="#d9608f" strokeWidth={2.2} strokeLinecap="round" />
            </>
          )}
          {/* румянец */}
          {[-1, 1].map((k) => (
            <ellipse key={k} cx={EX + k * (ER + 14)} cy={EY + ER + 2} rx={8} ry={4.5} fill="#ff5fa2" opacity={0.35} />
          ))}
        </g>

        {/* лицо — без «дрожания», чтобы глаз был чётким */}
        <g className="doodle-face">
          <g className="doodle-eye">
            <circle cx={EX} cy={EY} r={ER} fill="#ffffff" stroke={INK} strokeWidth={3.4} />
            <ellipse cx={EX + 2} cy={EY + 3} rx={ER * 0.45} ry={ER * 0.55} fill={INK} />
            {/* блик в глазу — у довольной */}
            {mood === 'joy' && <circle cx={EX - 1} cy={EY - 2} r={3.2} fill="#ffffff" />}
            {sleepy && (
              <path
                d={`M${EX - ER} ${EY} a${ER} ${ER} 0 0 1 ${ER * 2} 0z`}
                fill={PINK}
                stroke={INK}
                strokeWidth={3.4}
                strokeLinejoin="round"
              />
            )}
          </g>
          {/* реснички */}
          {!sleepy && (
            <g stroke={INK} strokeWidth={2.4} strokeLinecap="round">
              {[-0.5, 0, 0.5].map((t) => {
                const a = -Math.PI / 2 + t;
                const x1 = EX + Math.cos(a) * (ER + 1.5);
                const y1 = EY + Math.sin(a) * (ER + 1.5);
                return <path key={t} d={`M${x1} ${y1} l${Math.cos(a) * 7 + t * 2} ${Math.sin(a) * 7}`} />;
              })}
            </g>
          )}
          {/* рот: голодная — открытый ротик без клычков, иначе улыбка с клычками */}
          {mood === 'hungry' ? (
            <ellipse cx={100} cy={MOUTH_Y + 2} rx={5} ry={6.5} fill={INK} />
          ) : mood === 'joy' ? (
            <>
              {/* милая улыбочка с маленькими клычками */}
              <path d={`M78 ${MOUTH_Y - 1} Q100 ${MOUTH_Y + 16} 122 ${MOUTH_Y - 1}`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
              {[-1, 1].map((k) => (
                <path
                  key={k}
                  d={`M${100 + k * 15 - 3} ${MOUTH_Y + 4} l${3 + k * 0.4} 6 l3 -6z`}
                  fill="#ffffff"
                  stroke={INK}
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                />
              ))}
            </>
          ) : (
            <>
              <path
                d={`M70 ${MOUTH_Y} Q100 ${MOUTH_Y + 7} 130 ${MOUTH_Y}`}
                fill="none"
                stroke={INK}
                strokeWidth={3.2}
                strokeLinecap="round"
              />
              {[-1, 1].map((k) => {
                const fx = 100 + k * 23;
                return (
                  <path
                    key={k}
                    d={`M${fx - 4} ${MOUTH_Y + 2} l${4 + k * 0.5} 9 l4 -9z`}
                    fill="#ffffff"
                    stroke={INK}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                );
              })}
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
