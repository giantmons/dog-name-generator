import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Link2, Share2, MessageCircle } from "lucide-react";
import type { Pet } from "@/types/pet";
import { useCategoryMap } from "@/store/selectors";
import { CONTAINER_HEIGHT } from "@/constants/showcase";
import GenderIcon from "./GenderIcon";

interface Props {
  pet: Pet;
  onClose: () => void;
}

function NameDetails({ pet, onClose }: Props) {
  const byId = useCategoryMap();

  const categoryNames = useMemo(
    () =>
      pet.categories
        .map((id) => byId[id]?.name)
        .filter(Boolean)
        .join(" - "),
    [pet.categories, byId],
  );

  const handleCopyLink = () => {
    const url = `${window.location.origin}?name=${encodeURIComponent(pet.title)}`;
    void navigator.clipboard.writeText(url);
  };

  const handleShareTwitter = () => {
    const text = `What do you think of the name "${pet.title}" for a dog?`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareMessenger = () => {
    const url = `${window.location.origin}?name=${encodeURIComponent(pet.title)}`;
    window.open(
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID`,
      "_blank",
      "noopener,noreferrer",
    );
  };

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
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 rounded-full text-ink hover:text-primary transition-colors cursor-pointer"
      >
        <X size={18} aria-hidden="true" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={pet.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <GenderIcon gender={pet.gender} />
            {categoryNames && (
              <span className="text-lg font-sans text-ink">{categoryNames}</span>
            )}
          </div>

          <hr className="border-border" />

          {/*
           * pet.definition contains static HTML sourced from our own JSON files.
           * If this data ever comes from an untrusted source, sanitize it first
           * with DOMPurify before rendering.
           */}
          <div
            className="py-1 text-ink text-base font-sans font-light leading-relaxed max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: pet.definition }}
          />

          <hr className="border-border" />

          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              aria-label="Copy link to this name"
              onClick={handleCopyLink}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-bg hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Link2 className="w-3 h-3" strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Share on Twitter / X"
              onClick={handleShareTwitter}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-bg hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Share2 className="w-3 h-3" strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Share via Messenger"
              onClick={handleShareMessenger}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-bg hover:opacity-80 transition-opacity cursor-pointer"
            >
              <MessageCircle className="w-3 h-3" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default NameDetails;
