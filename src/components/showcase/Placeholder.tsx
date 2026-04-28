import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface Props {
  onBrowseAll: () => void;
  showBrowseChevron: boolean;
}

function Placeholder({ onBrowseAll, showBrowseChevron }: Props) {
  return (
    <motion.div
      key="placeholder"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative mt-24 flex items-center justify-center py-8 w-full"
    >
      <div className="relative flex items-center justify-center w-full max-w-xl mx-auto">
        <div
          className="absolute bottom-[58%] sm:bottom-[45%] inset-x-0 flex flex-col items-center justify-center text-center font-serif font-black text-primary select-none leading-none text-[6.75rem] sm:text-[8.25rem] md:text-[10rem] lg:text-[11rem] [&>span]:block [&>span]:text-nowrap [&>span]:leading-none"
          aria-hidden="true"
        >
          <span>I NEED</span>
          <span>A NAME</span>
        </div>
        <img
          src="/images/dogShepherd-420w.webp"
          srcSet="/images/dogShepherd-420w.webp 420w, /images/dogShepherd-840w.webp 840w"
          sizes="(max-width: 640px) 420px, 840px"
          loading="lazy"
          alt="A dog waiting for a name"
          className="relative z-10 w-full max-w-[420px] max-h-[420px] object-contain"
        />
      </div>
      {showBrowseChevron && (
        <div className="absolute right-[10%] sm:right-[12%] md:right-[14%] top-[calc(50%-12px)] -translate-y-1/2 z-20">
          <motion.button
            type="button"
            aria-label="Browse all names without choosing a letter first"
            onClick={onBrowseAll}
            animate={{ x: [-6, 12] }}
            transition={{
              x: {
                duration: 1.35,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
            className="flex items-center justify-center rounded-full border border-border bg-bg p-2.5 shadow-sm text-primary hover:bg-surface hover:border-border/70 transition-colors cursor-pointer touch-manipulation"
          >
            <ChevronRight size={36} strokeWidth={2.25} aria-hidden="true" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default Placeholder;
