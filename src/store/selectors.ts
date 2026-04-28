import { useMemo } from "react";
import { usePetStore } from "./petStore";
import type { Category } from "@/types/pet";

/** Memoised id→Category map, rebuilt only when the categories list changes. */
export function useCategoryMap(): Record<string, Category> {
  const categories = usePetStore((s) => s.categories);
  return useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );
}

/** Returns the filtered + sorted pet list based on current store state. */
export function useFilteredPets() {
  const pets = usePetStore((s) => s.pets);
  const genderFilter = usePetStore((s) => s.genderFilter);
  const selectedCategoryIds = usePetStore((s) => s.selectedCategoryIds);
  const selectedLetter = usePetStore((s) => s.selectedLetter);

  return useMemo(() => {
    return pets.filter((p) => {
      if (genderFilter !== "B" && !p.gender.includes(genderFilter)) return false;
      if (
        selectedCategoryIds.length > 0 &&
        !p.categories.some((c) => selectedCategoryIds.includes(c))
      )
        return false;
      if (selectedLetter && p.title[0]?.toUpperCase() !== selectedLetter)
        return false;
      return true;
    });
  }, [pets, genderFilter, selectedCategoryIds, selectedLetter]);
}
