import { usePetStore } from "@/store/petStore";
import { useCategoryMap } from "@/store/selectors";
import { cn } from "@/utils/cn";

interface Props {
  count: number;
}

function LetterFilters({ count }: Props) {
  const letters = usePetStore((s) => s.letters);
  const selectedLetter = usePetStore((s) => s.selectedLetter);
  const setSelectedLetter = usePetStore((s) => s.setSelectedLetter);
  const selected = usePetStore((s) => s.selectedCategoryIds);
  const toggleCategory = usePetStore((s) => s.toggleCategory);
  const byId = useCategoryMap();

  const selectedCategories = selected.map((id) => byId[id]).filter(Boolean);

  return (
    <section
      aria-label="Filter by letter"
      className="px-6 py-4 flex flex-col gap-2 items-center"
    >
      <div className="w-full flex flex-wrap items-center gap-2 mb-3 max-w-4xl">
        {selectedCategories.length === 0 && !selectedLetter ? (
          <p className="text-base text-ink">
            All pet names{" "}
            <span className="text-base text-gray-400 font-normal">
              ({count})
            </span>
          </p>
        ) : (
          <>
            <span className="text-base text-ink">
              Showing results for{" "}
              <span className="text-gray-400 font-normal">({count})</span>:
            </span>
            {selectedLetter && (
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-white px-3 py-1 text-xs hover:bg-primary/80 transition-all duration-200 cursor-pointer shadow-sm"
                aria-label={`Remove letter filter ${selectedLetter}`}
              >
                Starts with &ldquo;{selectedLetter}&rdquo;
                <span aria-hidden="true">×</span>
              </button>
            )}
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

      <div className="flex items-center gap-0 bg-white shadow-sm rounded-full px-4 py-2 overflow-x-auto scrollbar-hide w-full lg:w-fit">
        {letters.map((letter) => {
          const active = letter === selectedLetter;
          return (
            <button
              key={letter}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedLetter(active ? null : letter)}
              className={cn(
                "flex items-center justify-center w-8 h-8 shrink-0 rounded-full text-md cursor-pointer",
                "transition-all duration-200 ease-in-out",
                "hover:scale-110 active:scale-90",
                active
                  ? "bg-primary text-white scale-110 shadow-md font-semibold"
                  : "text-ink hover:text-primary hover:bg-primary/10",
              )}
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
