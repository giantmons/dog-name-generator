import { usePetStore } from "@/store/petStore";
import type { GenderFilter } from "@/store/petStore";
import { cn } from "@/utils/cn";

const OPTIONS: ReadonlyArray<{ value: GenderFilter; label: string }> = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "B", label: "Both" },
];

function GenderToggle() {
  const value = usePetStore((s) => s.genderFilter);
  const setValue = usePetStore((s) => s.setGenderFilter);

  return (
    <div className="flex flex-col gap-2 items-center">
      <span className="text-ink text-lg">Choose your pet's gender</span>
      <div
        role="group"
        aria-label="Filter by gender"
        className="inline-flex flex-wrap gap-3 mt-1.5"
      >
        {OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => setValue(opt.value)}
              className={cn(
                "rounded-sm cursor-pointer border px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-primary bg-white text-primary hover:bg-gray-50",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GenderToggle;
