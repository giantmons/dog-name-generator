import { useEffect, useMemo } from "react";
import { usePetStore } from "../store/petStore";
import GenderToggle from "../components/GenderToggle";
import CategoryFilters from "../components/CategoryFilters";

function Home() {
  const status = usePetStore((s) => s.status);
  const error = usePetStore((s) => s.error);
  const pets = usePetStore((s) => s.pets);
  const genderFilter = usePetStore((s) => s.genderFilter);
  const selected = usePetStore((s) => s.selectedCategoryIds);
  const categoriesCount = usePetStore((s) => s.categories.length);

  useEffect(() => {
    void usePetStore.getState().loadAll();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((p) => {
      const genderOk = genderFilter === "B" || p.gender.includes(genderFilter);
      if (!genderOk) return false;
      if (selected.length === 0) return true;
      return p.categories.some((c) => selected.includes(c));
    });
  }, [pets, genderFilter, selected]);

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
      <p className="text-2xl font-bold text-center px-6">
        Showing {filteredPets.length} of {pets.length} names across{" "}
        {categoriesCount} categories.
      </p>
    </div>
  );
}

export default Home;
