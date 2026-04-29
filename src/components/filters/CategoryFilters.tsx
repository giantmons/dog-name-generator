import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePetStore } from "@/store/petStore";
import { useCategoryMap } from "@/store/selectors";
import { cn } from "@/utils/cn";

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      size={22}
      strokeWidth={2.5}
      className={cn(
        "text-primary transition-transform duration-200",
        open && "rotate-180",
      )}
      aria-hidden
    />
  );
}

function CategoryFilters() {
  const groups = usePetStore((s) => s.filterGroups);
  const selected = usePetStore((s) => s.selectedCategoryIds);
  const toggle = usePetStore((s) => s.toggleCategory);
  const byId = useCategoryMap();

  const [openId, setOpenId] = useState<string | null>(null);
  const openGroup = openId
    ? (groups.find((g) => g.id === openId) ?? null)
    : null;

  return (
    <section
      aria-label="Filters"
      className="w-full border-y border-border bg-white"
    >
      <div className="flex items-center gap-2 px-4 sm:gap-0 sm:px-6">
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:thin]">
          <div className="flex w-full min-w-max items-stretch justify-start sm:justify-center">
            <div className="flex shrink-0 items-center py-2 pr-3 text-sm font-semibold text-ink">
              Filters:
            </div>
            <div className="flex shrink-0 items-center gap-4 border-x border-border sm:px-10 px-8 py-2 font-sans">
              {groups.map((g) => {
                const active = g.id === openId;
                const selectionCount = g.categoryIds.filter((id) =>
                  selected.includes(id),
                ).length;
                return (
                  <button
                    key={g.id}
                    type="button"
                    aria-expanded={active}
                    onClick={() => setOpenId(active ? null : g.id)}
                    className={cn(
                      "flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 py-2 text-sm whitespace-nowrap transition-colors",
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-700 hover:text-gray-900",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-[13px] min-w-[11px] shrink-0 items-center justify-center rounded-[2px] bg-primary p-1 text-[10px] tabular-nums leading-none text-white",
                        selectionCount === 0 && "invisible",
                      )}
                    >
                      {selectionCount}
                    </span>
                    {g.label}
                    <Chevron open={active} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {openGroup && (
          <motion.div
            key={openGroup.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border"
          >
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-3 px-12 sm:px-24 py-4">
              {openGroup.categoryIds.map((id) => {
                const cat = byId[id];
                if (!cat) return null;
                const checked = selected.includes(id);
                return (
                  <label
                    key={id}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(id)}
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                    {cat.name}
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CategoryFilters;
