export const ROW_HEIGHT = 54;
export const ROW_GAP = 8;
export const STRIDE = ROW_HEIGHT + ROW_GAP;
export const VISIBLE_COUNT = 7;
export const HALF = Math.floor(VISIBLE_COUNT / 2);
export const CONTAINER_HEIGHT =
  VISIBLE_COUNT * ROW_HEIGHT + (VISIBLE_COUNT - 1) * ROW_GAP;
export const OVERSCAN = 6;

export const DISTANCE_STYLES: Record<
  number,
  { size: string; color: string; opacity: string; weight: string }
> = {
  0: {
    size: "text-5xl",
    color: "text-primary",
    opacity: "opacity-100",
    weight: "font-normal",
  },
  1: {
    size: "text-4xl",
    color: "text-ink",
    opacity: "opacity-60",
    weight: "font-light",
  },
  2: {
    size: "text-4xl",
    color: "text-ink",
    opacity: "opacity-50",
    weight: "font-light",
  },
  3: {
    size: "text-4xl",
    color: "text-ink",
    opacity: "opacity-40",
    weight: "font-light",
  },
};

export function getRowStyle(distance: number) {
  return DISTANCE_STYLES[Math.min(distance, 3)];
}
