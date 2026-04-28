import { useEffect, useRef } from "react";

interface Options {
  listLength: number;
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
  throttleMs?: number;
}

/**
 * Attaches a throttled wheel listener to the given element ref that advances
 * the active index within [0, listLength - 1].
 */
export function useWheelScroll({
  listLength,
  activeIndex,
  setActiveIndex,
  throttleMs = 120,
}: Options) {
  const ref = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);

  useEffect(() => {
    if (listLength === 0) return;
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastWheelTime.current < throttleMs) return;
      lastWheelTime.current = now;
      const delta = e.deltaY > 0 ? 1 : -1;
      setActiveIndex(Math.max(0, Math.min(listLength - 1, activeIndex + delta)));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [listLength, activeIndex, setActiveIndex, throttleMs]);

  return ref;
}
