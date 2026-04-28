import { usePetStore } from "../store/petStore";
import type { GenderFilter } from "../store/petStore";

const OPTIONS: ReadonlyArray<{ value: GenderFilter; label: string }> = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "B", label: "Both" },
];

function GenderToggle() {
    const value = usePetStore((s) => s.genderFilter);
    const setValue = usePetStore((s) => s.setGenderFilter);

    return (
        <>
            <div className="flex flex-col gap-2 items-center">
                <span className="text-[#3a3533] text-lg">Choose your pet's gender</span>
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
                                className={[
                                    "rounded-sm cursor-pointer border-1 px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                                    active
                                        ? "border-primary bg-primary text-white"
                                        : "border-primary bg-white text-primary hover:bg-gray-50",
                                ].join(" ")}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

        </>
    );
}

export default GenderToggle;
