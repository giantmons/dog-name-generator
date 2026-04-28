import { create } from "zustand";
import type { Category, FilterGroup, Pet } from "@/types/pet";
import { getCategories, getLetters, getPets } from "@/services/petService";

type Status = "idle" | "loading" | "ready" | "error";

export type GenderFilter = "M" | "F" | "B";

interface PetState {
  pets: Pet[];
  categories: Category[];
  filterGroups: FilterGroup[];
  letters: string[];
  status: Status;
  error: string | null;
  genderFilter: GenderFilter;
  setGenderFilter: (g: GenderFilter) => void;
  selectedCategoryIds: string[];
  toggleCategory: (id: string) => void;
  clearCategories: () => void;
  selectedLetter: string | null;
  setSelectedLetter: (letter: string | null) => void;
  loadAll: () => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  categories: [],
  filterGroups: [],
  letters: [],
  status: "idle",
  error: null,
  genderFilter: "B",
  setGenderFilter: (genderFilter) => set({ genderFilter }),
  selectedCategoryIds: [],
  toggleCategory: (id) =>
    set((s) => ({
      selectedCategoryIds: s.selectedCategoryIds.includes(id)
        ? s.selectedCategoryIds.filter((x) => x !== id)
        : [...s.selectedCategoryIds, id],
    })),
  clearCategories: () => set({ selectedCategoryIds: [] }),
  selectedLetter: null,
  setSelectedLetter: (letter) => set({ selectedLetter: letter }),
  loadAll: async () => {
    const { status } = get();
    if (status === "loading" || status === "ready") return;

    set({ status: "loading", error: null });

    try {
      const [petsRes, categoriesRes, lettersRes] = await Promise.all([
        getPets(),
        getCategories(),
        getLetters(),
      ]);

      set({
        pets: petsRes.data,
        categories: categoriesRes.data,
        filterGroups: categoriesRes.filterGroups,
        letters: lettersRes.data,
        status: "ready",
      });
    } catch (e) {
      set({
        status: "error",
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },
}));
