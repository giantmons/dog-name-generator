import { useMemo } from "react";
import { usePetStore } from "../store/petStore";

interface Props {
  count: number;
}

function LetterFilters({ count }: Props) {
  const letters = usePetStore((s) => s.letters);
  const selectedLetter = usePetStore((s) => s.selectedLetter);
  const setSelectedLetter = usePetStore((s) => s.setSelectedLetter);
  const categories = usePetStore((s) => s.categories);
  const selected = usePetStore((s) => s.selectedCategoryIds);
  const toggleCategory = usePetStore((s) => s.toggleCategory);

  const byId = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );

  const selectedCategories = selected.map((id) => byId[id]).filter(Boolean);

  return (
    <section
      aria-label="Filter by letter"
      className="px-6 py-4 flex flex-col gap-2 items-center"
    >
      <div className="w-full flex flex-wrap items-center gap-2 mb-3 lg:pl-36">
        {selectedCategories.length === 0 ? (
          <p className="text-base text-[#3a3533]">
            All pets names <span className="text-base text-gray-400 font-normal">({count})</span>
          </p>
        ) : (
          <>
            <span className="text-base text-[#3a3533]">
              Showing results for <span className="text-gray-400 font-normal">({count})</span>:
            </span>
            {selectedCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs hover:bg-primary/20 transition-colors cursor-pointer"
                aria-label={`Remove filter ${cat.name}`}
              >
                {cat.name}
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </>
        )}
      </div>
      <div className="flex items-center gap-0 bg-white shadow-sm rounded-full px-4 py-2 overflow-x-auto scrollbar-hide w-full md:w-fit">
        {letters.map((letter) => {
          const active = letter === selectedLetter;
          return (
            <button
              key={letter}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedLetter(active ? null : letter)}
              className={[
                "flex items-center justify-center w-8 h-8 shrink-0 rounded-full text-md transition-colors cursor-pointer",
                active
                  ? "bg-primary text-white"
                  : "text-[#3a3533] hover:text-primary",
              ].join(" ")}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default LetterFilters;
