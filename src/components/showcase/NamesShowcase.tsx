import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Pet } from "@/types/pet";
import { usePetStore } from "@/store/petStore";
import { CONTAINER_HEIGHT } from "@/constants/showcase";
import WheelPicker from "./WheelPicker";
import NameDetails from "./NameDetails";
import Placeholder from "./Placeholder";

interface Props {
  names: Pet[];
}

/**
 * Inner picker; given a stable `key` from the parent, React remounts this
 * component whenever the filtered name list changes — cleanly resetting
 * activeIndex and detailsOpen without useEffect + setState.
 */
function ShowcaseContent({ names }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const activePet = names[activeIndex] ?? null;

  return (
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
        {/* Left column — dog image when closed, picker when open */}
        <div className="hidden md:flex items-center justify-center md:justify-end md:pr-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!detailsOpen ? (
              <motion.div
                key="dog-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-end justify-center bg-bg pt-6 w-full"
              >
                <img
                  src="/images/dogPapillion-420w.webp"
                  srcSet="/images/dogPapillion-420w.webp 420w, /images/dogPapillion-840w.webp 840w"
                  sizes="(max-width: 640px) 420px, 840px"
                  loading="lazy"
                  alt="Papillion dog"
                  className="max-h-[420px] w-auto object-contain drop-shadow-md"
                />
              </motion.div>
            ) : (
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

        {/* Right column — picker when closed, details when open */}
        <div className="flex items-center justify-center md:justify-start md:pl-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!detailsOpen ? (
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
  );
}

function NamesShowcase({ names }: Props) {
  const selectedLetter = usePetStore((s) => s.selectedLetter);
  const selectedCategoryIds = usePetStore((s) => s.selectedCategoryIds);
  const noCategoryFilters = selectedCategoryIds.length === 0;

  // Track whether the user has opted to browse without a letter filter.
  // Uses the "setState-during-render" pattern to avoid useEffect + setState.
  const [exploreAllWithoutLetter, setExploreAllWithoutLetter] = useState(false);
  const [prevSelectedLetter, setPrevSelectedLetter] = useState<string | null>(
    selectedLetter,
  );

  if (prevSelectedLetter !== selectedLetter) {
    setPrevSelectedLetter(selectedLetter);
    if (selectedLetter) {
      setExploreAllWithoutLetter(false);
    } else if (prevSelectedLetter !== null) {
      // Letter was just cleared — stay on the names list
      setExploreAllWithoutLetter(true);
    }
  }

  // A stable key derived from the name list forces ShowcaseContent to remount
  // when filters change, naturally resetting activeIndex and detailsOpen.
  const wheelKey = names.map((p) => p.id).join("|");

  const showPlaceholder = !selectedLetter && !exploreAllWithoutLetter;

  return (
    <AnimatePresence mode="wait">
      {showPlaceholder ? (
        <Placeholder
          key="placeholder"
          onBrowseAll={() => setExploreAllWithoutLetter(true)}
          showBrowseChevron={noCategoryFilters}
        />
      ) : (
        <ShowcaseContent key={wheelKey} names={names} />
      )}
    </AnimatePresence>
  );
}

export default NamesShowcase;
