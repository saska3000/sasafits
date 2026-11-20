import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

function Svg(props: P) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export const IconBook = (p: P) => (
  <Svg {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" />
    <path d="M4 19a2 2 0 0 1 2-2h13" />
    <path d="M9 7h6M9 11h4" />
  </Svg>
);
export const IconApple = (p: P) => (
  <Svg {...p}>
    <path d="M12 7c-1.5-1-5-1.5-6.5 1.5S5 16 7 18.5 10.5 21 12 20c1.5 1 3 1 5-1.5s2-7.5.5-10.5S13.5 6 12 7z" />
    <path d="M12 7c0-2 1-3.5 3-4" />
  </Svg>
);
export const IconPot = (p: P) => (
  <Svg {...p}>
    <path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6z" />
    <path d="M2 10h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2" />
  </Svg>
);
export const IconChart = (p: P) => (
  <Svg {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 3 3 5-6" />
  </Svg>
);
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const IconChevronLeft = (p: P) => (
  <Svg {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);
export const IconChevronRight = (p: P) => (
  <Svg {...p}>
    <path d="M9 18l6-6-6-6" />
  </Svg>
);
export const IconSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);
export const IconStar = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3z" />
  </Svg>
);
export const IconX = (p: P) => (
  <Svg {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);
export const IconTrash = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </Svg>
);
export const IconBarcode = (p: P) => (
  <Svg {...p}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 8v8M10 8v8M13 8v8M17 8v8" />
  </Svg>
);
export const IconWarn = (p: P) => (
  <Svg {...p}>
    <path d="M12 3l10 18H2L12 3z" />
    <path d="M12 10v5M12 18h.01" />
  </Svg>
);
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12l5 5L20 7" />
  </Svg>
);
export const IconHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.5-4.6-9.3-9.4C1.6 7.5 3.6 4.5 6.8 4.5c2 0 3.4 1.1 5.2 3 1.8-1.9 3.2-3 5.2-3 3.2 0 5.2 3 4.1 6.1C19.5 15.4 12 20 12 20z" />
  </Svg>
);

/* ---------- Тонкие иконки вместо смайликов ---------- */
export const IconSun = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Svg>
);
export const IconMoon = (p: P) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Svg>
);
export const IconBowl = (p: P) => (
  <Svg {...p}>
    <path d="M3 11h18a9 9 0 0 1-18 0z" />
    <path d="M8.5 7c0-1.2 1.2-1.2 1.2-2.4M13.5 7c0-1.2 1.2-1.2 1.2-2.4" />
  </Svg>
);
export const IconLeaf = (p: P) => (
  <Svg {...p}>
    <path d="M5 19c0-8.5 5.5-14 15-14 0 9.5-5.5 15-14 15" />
    <path d="M5 19l8.5-8.5" />
  </Svg>
);
export const IconDrumstick = (p: P) => (
  <Svg {...p}>
    <path d="M5.5 17.5C2.5 14 3.5 7.5 9 5.5s11.5 0 11.5 5-4 8-9 8.5c-2.5.2-4.5-.2-6-1.5z" />
    <circle cx="9.5" cy="12" r="2" />
    <path d="M14 9.5c1.8.3 3.2 1.4 3.6 3" />
  </Svg>
);
export const IconCake = (p: P) => (
  <Svg {...p}>
    <path d="M4 20h16v-8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v8z" />
    <path d="M4 15c1.3 1 2.7 1 4 0s2.7-1 4 0 2.7 1 4 0 2.7-1 4 0" />
    <path d="M12 11V7.5" />
    <path d="M12 3.5c.8.8 1 1.6.5 2.3a.7.7 0 0 1-1 0c-.5-.7-.3-1.5.5-2.3z" />
  </Svg>
);
export const IconSparkle = (p: P) => (
  <Svg {...p}>
    <path d="M11 3.5l1.8 5.2L18 10.5l-5.2 1.8L11 17.5l-1.8-5.2L4 10.5l5.2-1.8z" />
    <path d="M18.5 15.5v4M16.5 17.5h4" />
  </Svg>
);
export const IconClock = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const IconCamera = (p: P) => (
  <Svg {...p}>
    <path d="M4 8h3l1.8-2.5h6.4L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
);
export const IconScale = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M8.5 10a3.5 3.5 0 0 1 7 0" />
    <path d="M12 10l1.6-1.6" />
  </Svg>
);
export const IconFlower = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="2" />
    <path d="M12 6c0-2.5 3-3 3-.5S12.8 8 14 8s3 .5 1.5 2.5S12 10 12 10s-2.2 3-3.5.5S10 8 10 8s-3-.5-3-2.5S12 3.5 12 6" />
    <path d="M12 10v11" />
    <path d="M12 17c-2.5 0-4-1.5-4.5-3.5 2.5 0 4 1.5 4.5 3.5z" />
  </Svg>
);
export const IconPlate = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4.5" />
  </Svg>
);

/** Иконка приёма пищи */
export function MealIcon({ meal, ...p }: P & { meal: string }) {
  if (meal === 'breakfast') return <IconSun {...p} />;
  if (meal === 'lunch') return <IconBowl {...p} />;
  if (meal === 'dinner') return <IconMoon {...p} />;
  return <IconApple {...p} />;
}

/** Иконка «настроения» в свайпах */
export function MoodIcon({ mood, ...p }: P & { mood: string }) {
  if (mood === 'light') return <IconLeaf {...p} />;
  if (mood === 'hearty') return <IconBowl {...p} />;
  if (mood === 'meat') return <IconDrumstick {...p} />;
  if (mood === 'sweet') return <IconCake {...p} />;
  return <IconSparkle {...p} />;
}
