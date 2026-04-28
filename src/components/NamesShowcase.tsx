import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Pet } from "../types/pet";
import { usePetStore } from "../store/petStore";
import dogImg from "../assets/dogs/dogPapillion.png";
import shepherdImg from "../assets/dogs/dogShepherd.png";

interface Props {
  names: Pet[];
}

const ROW_HEIGHT = 54; // px — fixed per row so translateY math is stable
/** Equal vertical gap between each name row */
const ROW_GAP = 8;
const STRIDE = ROW_HEIGHT + ROW_GAP;
const VISIBLE_COUNT = 7;
const HALF = Math.floor(VISIBLE_COUNT / 2);
const CONTAINER_HEIGHT =
  VISIBLE_COUNT * ROW_HEIGHT + (VISIBLE_COUNT - 1) * ROW_GAP;

const DISTANCE_STYLES: Record<
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
    color: "text-[#3a3533]",
    opacity: "opacity-60",
    weight: "font-light",
  },
  2: {
    size: "text-4xl",
    color: "text-[#3a3533]",
    opacity: "opacity-50",
    weight: "font-light",
  },
  3: {
    size: "text-4xl",
    color: "text-[#3a3533]",
    opacity: "opacity-40",
    weight: "font-light",
  },
};

function getRowStyle(distance: number) {
  return DISTANCE_STYLES[Math.min(distance, 3)];
}

function ChevronUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function WheelPicker({ names }: { names: Pet[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastWheelTime = useRef(0);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (names.length === 0) return;
    const el = scrollAreaRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastWheelTime.current < 120) return;
      lastWheelTime.current = now;
      const delta = e.deltaY > 0 ? 1 : -1;
      setActiveIndex((prev) =>
        Math.max(0, Math.min(names.length - 1, prev + delta)),
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [names]);

  const move = (delta: number) => {
    setActiveIndex((prev) =>
      Math.max(0, Math.min(names.length - 1, prev + delta)),
    );
  };

  if (names.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-400 text-sm"
        style={{ height: CONTAINER_HEIGHT }}
      >
        No names match the current filters.
      </div>
    );
  }

  // Translate so the active row sits in the center of the visible window.
  // paddingTop = HALF * STRIDE ensures the first item can be centred.
  const translateY = -(activeIndex * STRIDE);

  return (
    <div
      ref={scrollAreaRef}
      className="flex gap-4 justify-center w-full touch-none overscroll-contain"
      style={{ height: CONTAINER_HEIGHT }}
    >
      {/* Scrolling names column */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{ y: translateY }}
          transition={{ type: "spring", stiffness: 300, damping: 36, mass: 0.8 }}
          style={{
            gap: ROW_GAP,
            paddingTop: HALF * STRIDE,
            paddingBottom: HALF * STRIDE,
          }}
          className="flex flex-col select-none"
        >
          {names.map((pet, idx) => {
            const distance = Math.abs(idx - activeIndex);
            const { size, color, opacity, weight } = getRowStyle(distance);
            return (
              <div
                key={pet.id}
                style={{ height: ROW_HEIGHT }}
                className={[
                  "flex items-center justify-center text-center font-serif leading-none tracking-tight transition-colors duration-200",
                  weight,
                  size,
                  color,
                  opacity,
                ].join(" ")}
              >
                {pet.title}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Chevrons — space-between over full picker height */}
      <div
        className="flex flex-col justify-between items-center shrink-0 py-2"
        style={{ height: CONTAINER_HEIGHT }}
      >
        <button
          type="button"
          aria-label="Previous name"
          onClick={() => move(-1)}
          disabled={activeIndex === 0}
          className="flex items-center justify-center text-primary disabled:opacity-30 cursor-pointer disabled:cursor-default transition-opacity hover:opacity-70"
        >
          <ChevronUp />
        </button>
        <button
          type="button"
          aria-label="Next name"
          onClick={() => move(1)}
          disabled={activeIndex === names.length - 1}
          className="flex items-center justify-center text-primary disabled:opacity-30 cursor-pointer disabled:cursor-default transition-opacity hover:opacity-70"
        >
          <ChevronDown />
        </button>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <motion.div
      key="placeholder"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mt-16 flex items-center justify-center py-8"
    >
      <div className="relative flex items-center justify-center w-full max-w-xl">
        {/* Background text — two explicit lines so "A NAME" stays together */}
        <div
          className="absolute bottom-[240px] inset-0 flex flex-col items-center justify-center text-center font-serif font-black text-primary select-none leading-none [&>span]:block [&>span]:text-nowrap [&>span]:leading-none"
          style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
          aria-hidden="true"
        >
          <span>I NEED</span>
          <span>A NAME</span>
        </div>
        {/* Dog image on top */}
        <img
          src={shepherdImg}
          alt="A dog waiting for a name"
          className="relative z-10 max-h-[420px] w-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

function NamesShowcase({ names }: Props) {
  const selectedLetter = usePetStore((s) => s.selectedLetter);

  const wheelKey = useMemo(
    () => names.map((p) => p.id).join("|"),
    [names],
  );

  return (
    <AnimatePresence mode="wait">
      {!selectedLetter ? (
        <Placeholder key="placeholder" />
      ) : (
        <motion.div
          key="showcase"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-2 px-4"
        >
          <div
            className="mx-auto grid max-w-3xl grid-cols-1 md:grid-cols-2 md:items-center gap-y-6 gap-x-2 md:gap-x-3"
            style={{ minHeight: CONTAINER_HEIGHT }}
          >
            <div className="hidden md:flex items-end justify-center bg-[#f9f8f5] pt-6 md:justify-end md:pr-1">
              <img
                src={dogImg}
                alt="Papillion dog"
                className="max-h-[420px] w-auto object-contain drop-shadow-md"
              />
            </div>

            <div className="flex items-center justify-center py-4 md:justify-start md:pl-1">
              <WheelPicker key={wheelKey} names={names} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NamesShowcase;
