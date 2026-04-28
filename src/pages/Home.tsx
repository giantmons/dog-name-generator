import { useEffect, useMemo } from "react";
import { usePetStore } from "../store/petStore";
import GenderToggle from "../components/GenderToggle";
import CategoryFilters from "../components/CategoryFilters";
import LetterFilters from "../components/LetterFilters";
import NamesShowcase from "../components/NamesShowcase";

function Home() {
  const status = usePetStore((s) => s.status);
  const error = usePetStore((s) => s.error);
  const pets = usePetStore((s) => s.pets);
  const genderFilter = usePetStore((s) => s.genderFilter);
  const selected = usePetStore((s) => s.selectedCategoryIds);
  const selectedLetter = usePetStore((s) => s.selectedLetter);

  useEffect(() => {
    void usePetStore.getState().loadAll();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((p) => {
      const genderOk = genderFilter === "B" || p.gender.includes(genderFilter);
      if (!genderOk) return false;
      if (selected.length > 0 && !p.categories.some((c) => selected.includes(c))) return false;
      if (selectedLetter && p.title[0]?.toUpperCase() !== selectedLetter) return false;
      return true;
    });
  }, [pets, genderFilter, selected, selectedLetter]);

  if (status === "loading" || status === "idle") {
    return <p>Loading…</p>;
  }

  if (status === "error") {
    return <p role="alert">Error: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="p-6 pb-2">
        <GenderToggle />
      </div>
      <CategoryFilters />
      <LetterFilters count={filteredPets.length} />
      <NamesShowcase names={filteredPets} />
    </div>
  );
}

export default Home;
