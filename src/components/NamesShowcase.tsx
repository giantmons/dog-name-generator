import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronUp,
  ChevronDown,
  Link2,
  Mars,
  Venus,
  X,
} from "lucide-react";
import type { Pet } from "../types/pet";
import type { Gender } from "../types/pet";
import { usePetStore } from "../store/petStore";
import dogImg from "../assets/dogs/dogPapillion.png";
import shepherdImg from "../assets/dogs/dogShepherd.png";

interface Props {
  names: Pet[];
}

const ROW_HEIGHT = 54;
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

function GenderIcon({ gender }: { gender: Gender[] }) {
  const isMale = gender.includes("M");
  const isFemale = gender.includes("F");
  return (
    <span className="flex items-center gap-1 text-[#3a3533]">
      {isMale && <Mars size={36} aria-label="Male" />}
      {isFemale && <Venus size={36} aria-label="Female" />}
    </span>
  );
}

interface WheelPickerProps {
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
}: WheelPickerProps) {
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
      setActiveIndex(Math.max(0, Math.min(names.length - 1, activeIndex + delta)));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [names, activeIndex, setActiveIndex]);

  const move = (delta: number) => {
    setActiveIndex(Math.max(0, Math.min(names.length - 1, activeIndex + delta)));
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

  const translateY = -(activeIndex * STRIDE);

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
      className="flex gap-4 justify-center w-full touch-none overscroll-contain"
      style={{ height: CONTAINER_HEIGHT }}
    >
      {chevronsPosition === "left" && chevrons}

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
            const isActive = distance === 0;
            return (
              <div
                key={pet.id}
                style={{ height: ROW_HEIGHT }}
                onClick={isActive ? onActiveClick : undefined}
                className={[
                  "flex items-center justify-center text-center font-serif leading-none tracking-tight transition-colors duration-200",
                  weight,
                  size,
                  color,
                  opacity,
                  isActive ? "cursor-pointer" : "",
                ].join(" ")}
              >
                {pet.title}
              </div>
            );
          })}
        </motion.div>
      </div>

      {chevronsPosition === "right" && chevrons}
    </div>
  );
}

interface NameDetailsProps {
  pet: Pet;
  onClose: () => void;
}

function NameDetails({ pet, onClose }: NameDetailsProps) {
  const allCategories = usePetStore((s) => s.categories);

  const categoryMap = useMemo(
    () => Object.fromEntries(allCategories.map((c) => [c.id, c.name])),
    [allCategories],
  );

  const categoryNames = pet.categories
    .map((id) => categoryMap[id])
    .filter(Boolean)
    .join(" - ");

  return (
    <motion.div
      key="details-panel"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex flex-col justify-center h-full px-2 py-4"
      style={{ minHeight: CONTAINER_HEIGHT }}
    >
      {/* Close button */}
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 rounded-full text-[#3a3533] hover:text-primary transition-colors cursor-pointer"
      >
        <X size={18} aria-hidden="true" />
      </button>

      {/* Animated content — cross-fades when the active pet changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pet.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          {/* Gender + Category header */}
          <div className="flex items-center gap-2">
            <GenderIcon gender={pet.gender} />
            {categoryNames && (
              <span className="text-lg font-sans text-[#3a3533]">
                {categoryNames}
              </span>
            )}
          </div>

          <hr className="border-[#c9c5b9]" />

          {/* Definition */}
          <div
            className="py-1 text-[#3a3533] text-base font-sans font-light leading-relaxed max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: pet.definition }}
          />

          <hr className="border-[#c9c5b9]" />

          <div
            className="flex justify-end items-center gap-2"
            aria-hidden="true"
          >
            <span className="cursor-pointer flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3a3533]">
              <Link2
                className="w-3 h-3 text-[#f0ebe5]"
                strokeWidth={2.25}
              />
            </span>
            <span className="cursor-pointer flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3a3533]">
              <svg
                className="h-3 w-3 shrink-0 fill-[#f0ebe5]"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </span>
            <span className="cursor-pointer flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3a3533]">
              <svg
                className="h-3 w-3 shrink-0 fill-[#f0ebe5]"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.744 6.616 4.472 8.652V24l4.086-2.242a11.31 11.31 0 003.442.528c6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.191 14.963l-3.182-3.374-6.213 3.374 6.838-7.227 3.264 3.374 6.213-3.374-6.91 7.227z" />
              </svg>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
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
      className="mt-24 flex items-center justify-center py-8"
    >
      <div className="relative flex items-center justify-center w-full max-w-xl">
        <div
          className="absolute bottom-[58%] sm:bottom-[45%] inset-x-0 flex flex-col items-center justify-center text-center font-serif font-black text-primary select-none leading-none text-[6.75rem] sm:text-[8.25rem] md:text-[10rem] lg:text-[11rem] [&>span]:block [&>span]:text-nowrap [&>span]:leading-none"
          aria-hidden="true"
        >
          <span>I NEED</span>
          <span>A NAME</span>
        </div>
        <img
          src={shepherdImg}
          alt="A dog waiting for a name"
          className="relative z-10 w-full max-w-[420px] max-h-[420px] object-contain"
        />
      </div>
    </motion.div>
  );
}

function NamesShowcase({ names }: Props) {
  const selectedLetter = usePetStore((s) => s.selectedLetter);

  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const wheelKey = useMemo(
    () => names.map((p) => p.id).join("|"),
    [names],
  );

  // Reset state whenever the filtered name list changes
  useEffect(() => {
    setActiveIndex(0);
    setDetailsOpen(false);
  }, [wheelKey]);

  const activePet = names[activeIndex] ?? null;

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
            {/* Left column */}
            <div className="hidden md:flex items-center justify-center md:justify-end md:pr-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!detailsOpen ? (
                  /* Dog image — shown when details are closed */
                  <motion.div
                    key="dog-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-end justify-center bg-[#f9f8f5] pt-6 w-full"
                  >
                    <img
                      src={dogImg}
                      alt="Papillion dog"
                      className="max-h-[420px] w-auto object-contain drop-shadow-md"
                    />
                  </motion.div>
                ) : (
                  /* Slider — moves here when details are open */
                  <motion.div
                    key="slider-left"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center justify-center w-full py-4"
                  >
                    <WheelPicker
                      names={names}
                      activeIndex={activeIndex}
                      setActiveIndex={setActiveIndex}
                      onActiveClick={() => setDetailsOpen(false)}
                      chevronsPosition="left"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right column */}
            <div className="flex items-center justify-center md:justify-start md:pl-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!detailsOpen ? (
                  /* Slider — shown on the right when details are closed */
                  <motion.div
                    key="slider-right"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center justify-center w-full py-4"
                  >
                    <WheelPicker
                      names={names}
                      activeIndex={activeIndex}
                      setActiveIndex={setActiveIndex}
                      onActiveClick={() => setDetailsOpen(true)}
                      chevronsPosition="right"
                    />
                  </motion.div>
                ) : (
                  /* Details panel */
                  activePet && (
                    <div key="details" className="w-full">
                      <NameDetails
                        pet={activePet}
                        onClose={() => setDetailsOpen(false)}
                      />
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NamesShowcase;
