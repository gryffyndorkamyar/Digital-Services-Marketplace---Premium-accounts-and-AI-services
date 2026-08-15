/** Percentage layout mapped to ovyracarts1.png (2084×755) */
export type HeroCardLayout = {
  id: number;
  left: number;
  bottom: number;
  width: number;
  height: number;
  rotate: number;
  stack: number;
};

export const HERO_CARD_LAYOUT: HeroCardLayout[] = [
  { id: 1, left: 6.2, bottom: 6, width: 10.8, height: 78, rotate: -24, stack: 2 },
  { id: 2, left: 14.8, bottom: 4, width: 10.8, height: 84, rotate: -18, stack: 4 },
  { id: 3, left: 23.4, bottom: 3, width: 10.8, height: 90, rotate: -12, stack: 6 },
  { id: 4, left: 31.8, bottom: 1.5, width: 10.8, height: 97, rotate: -6, stack: 8 },
  { id: 5, left: 40.4, bottom: 2, width: 10.8, height: 96, rotate: -2, stack: 9 },
  { id: 6, left: 49, bottom: 1.2, width: 10.8, height: 97, rotate: 2, stack: 10 },
  { id: 7, left: 57.6, bottom: 1.2, width: 10.8, height: 97, rotate: 6, stack: 9 },
  { id: 8, left: 66.2, bottom: 2, width: 10.8, height: 91, rotate: 12, stack: 7 },
  { id: 9, left: 74.8, bottom: 4, width: 10.8, height: 84, rotate: 18, stack: 5 },
  { id: 10, left: 83.2, bottom: 4, width: 10.8, height: 78, rotate: 24, stack: 3 },
];

export function layoutToStyle(card: HeroCardLayout): Record<string, string | number> {
  return {
    left: `${card.left}%`,
    bottom: `${card.bottom}%`,
    width: `${card.width}%`,
    height: `${card.height}%`,
    ['--card-rotate' as string]: `${card.rotate}deg`,
    ['--card-stack' as string]: String(card.stack),
    zIndex: card.stack,
  };
}

export function pickHeroCardAtPoint(
  xPct: number,
  yPct: number,
  layouts: HeroCardLayout[] = HERO_CARD_LAYOUT
): HeroCardLayout | null {
  const hits = layouts.filter((card) => pointInRotatedCard(xPct, yPct, card));
  if (hits.length === 0) return null;
  if (hits.length === 1) return hits[0];

  return hits.reduce((best, card) => {
    const bestCx = best.left + best.width / 2;
    const cardCx = card.left + card.width / 2;
    const bestDist = Math.abs(xPct - bestCx);
    const cardDist = Math.abs(xPct - cardCx);
    if (cardDist !== bestDist) return cardDist < bestDist ? card : best;
    return card.stack > best.stack ? card : best;
  });
}

function pointInRotatedCard(xPct: number, yPct: number, card: HeroCardLayout): boolean {
  const cx = card.left + card.width / 2;
  const cy = 100 - card.bottom - card.height / 2;
  const rad = (-card.rotate * Math.PI) / 180;
  const dx = xPct - cx;
  const dy = yPct - cy;
  const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
  const localY = dx * Math.sin(rad) + dy * Math.cos(rad);
  const halfW = card.width / 2;
  const halfH = card.height / 2;
  return Math.abs(localX) <= halfW && Math.abs(localY) <= halfH;
}
