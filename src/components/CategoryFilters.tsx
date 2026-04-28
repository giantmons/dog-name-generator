import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePetStore } from "../store/petStore";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-primary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CategoryFilters() {
  const groups = usePetStore((s) => s.filterGroups);
  const categories = usePetStore((s) => s.categories);
  const selected = usePetStore((s) => s.selectedCategoryIds);
  const toggle = usePetStore((s) => s.toggleCategory);

  const [openId, setOpenId] = useState<string | null>(null);

  const byId = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );

  const openGroup = openId
    ? (groups.find((g) => g.id === openId) ?? null)
    : null;

  return (
    <section
      aria-label="Filters"
      className="w-full border-y border-[#c9c5b9] bg-white"
    >
      <div className="flex items-center gap-2 px-4 sm:gap-0 sm:px-6">
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:thin]">
          <div className="flex w-full min-w-max items-stretch justify-start sm:justify-center">
            <div className="flex shrink-0 items-center py-2 pr-3 text-sm font-semibold text-[#3a3533]">
              Filters:
            </div>
            <div className="flex shrink-0 items-center gap-4 border-x border-[#c9c5b9] sm:px-10 px-8 py-2 font-sans">
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
                    className={[
                      "flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 py-2 text-sm whitespace-nowrap transition-colors",
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-700 hover:text-gray-900",
                    ].join(" ")}
                  >
                    <span className={["inline-flex h-[13px] min-w-[11px] shrink-0 items-center justify-center rounded-[2px] bg-primary p-1 text-[10px] tabular-nums leading-none text-white", selectionCount === 0 ? "invisible" : ""].join(" ")}>
                      {selectionCount || 0}
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
            className="overflow-hidden border-t border-[#c9c5b9]"
          >
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-3 px-6 py-4">
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
