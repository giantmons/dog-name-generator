import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { Pet } from "@/types/pet";
import { useWheelScroll } from "@/hooks/useWheelScroll";
import {
  CONTAINER_HEIGHT,
  HALF,
  OVERSCAN,
  STRIDE,
  ROW_HEIGHT,
  getRowStyle,
} from "@/constants/showcase";
import { cn } from "@/utils/cn";

let hintShownThisSession = false;

/** Arrow pointer: white fill + black stroke. */
function TapHintPointer({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
        fill="#fff"
        stroke="#000"
        strokeWidth={1.15}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface Props {
  names: Pet[];
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
  onActiveClick: () => void;
  chevronsPosition?: "left" | "right";
}

function WheelPicker({
  names,
  activeIndex,
  setActiveIndex,
  onActiveClick,
  chevronsPosition = "right",
}: Props) {
  const reduceMotion = useReducedMotion();

  const [showHint] = useState(() => {
    if (hintShownThisSession) return false;
    hintShownThisSession = true;
    return true;
  });

  const scrollAreaRef = useWheelScroll({
    listLength: names.length,
    activeIndex,
    setActiveIndex,
  });

  const listRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const move = (delta: number) => {
    setActiveIndex(
      Math.max(0, Math.min(names.length - 1, activeIndex + delta)),
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el || names.length === 0) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActiveClick();
      }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  });

  // Touch / swipe support
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el || names.length === 0) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const dy = (e.changedTouches[0]?.clientY ?? 0) - touchStartY.current;
      touchStartY.current = null;
      if (Math.abs(dy) < 10) return;
      move(dy < 0 ? 1 : -1);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  });

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

  const translateY = -(activeIndex * STRIDE);
  const start = Math.max(0, activeIndex - HALF - OVERSCAN);
  const end = Math.min(names.length - 1, activeIndex + HALF + OVERSCAN);

  const chevrons = (
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
        <ChevronUp size={28} />
      </button>
      <button
        type="button"
        aria-label="Next name"
        onClick={() => move(1)}
        disabled={activeIndex === names.length - 1}
        className="flex items-center justify-center text-primary disabled:opacity-30 cursor-pointer disabled:cursor-default transition-opacity hover:opacity-70"
      >
        <ChevronDown size={28} />
      </button>
    </div>
  );

  return (
    <div
      ref={scrollAreaRef}
      role="listbox"
      aria-label="Pet names"
      aria-activedescendant={`pet-name-${names[activeIndex]?.id}`}
      tabIndex={0}
      className="flex gap-4 justify-center w-full touch-none overscroll-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
      style={{ height: CONTAINER_HEIGHT }}
    >
      {chevronsPosition === "left" && chevrons}

      <div
        ref={listRef}
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
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 36,
            mass: 0.8,
          }}
          style={{
            position: "relative",
            height: HALF * STRIDE + names.length * STRIDE,
          }}
          className="select-none"
        >
          {names.slice(start, end + 1).map((pet, sliceIdx) => {
            const idx = start + sliceIdx;
            const distance = Math.abs(idx - activeIndex);
            const { size, color, opacity, weight } = getRowStyle(distance);
            const isActive = distance === 0;
            return (
              <div
                key={pet.id}
                id={`pet-name-${pet.id}`}
                role="option"
                aria-selected={isActive}
                style={{
                  position: "absolute",
                  top: HALF * STRIDE + idx * STRIDE,
                  height: ROW_HEIGHT,
                  left: 0,
                  right: 0,
                }}
                onClick={isActive ? onActiveClick : undefined}
                className={cn(
                  "flex items-center justify-center text-center font-serif leading-none tracking-tight transition-colors duration-200",
                  weight,
                  size,
                  color,
                  opacity,
                  isActive && "cursor-pointer",
                )}
              >
                {pet.title}
              </div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative isolate translate-x-10 translate-y-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                animate={
                  reduceMotion
                    ? { opacity: [0.65, 1, 0.65] }
                    : { y: [0, 5, 0, 5, 0] }
                }
                transition={
                  reduceMotion
                    ? {
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : {
                        duration: 1.4,
                        times: [0, 0.2, 0.4, 0.6, 0.8],
                        delay: 0.3,
                        repeat: Infinity,
                        repeatDelay: 0.35,
                        ease: "easeInOut",
                      }
                }
              >
                {!reduceMotion && (
                  <motion.span
                    className="absolute inset-0 z-0 rounded-full border-2 border-primary/30"
                    initial={{ scale: 0.55, opacity: 0.4 }}
                    animate={{
                      scale: [0.55, 1.75, 0.55, 1.75],
                      opacity: [0.35, 0, 0.35, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      delay: 0.3,
                      repeat: Infinity,
                      repeatDelay: 0.35,
                      ease: "easeOut",
                    }}
                  />
                )}
                <TapHintPointer className="relative z-10" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {chevronsPosition === "right" && chevrons}
    </div>
  );
}

export default WheelPicker;
