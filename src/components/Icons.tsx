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
      strokeWidth="2"
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
