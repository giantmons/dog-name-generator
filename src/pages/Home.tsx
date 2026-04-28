import { useEffect } from "react";
import { usePetStore } from "@/store/petStore";
import { useFilteredPets } from "@/store/selectors";
import GenderToggle from "@/components/filters/GenderToggle";
import CategoryFilters from "@/components/filters/CategoryFilters";
import LetterFilters from "@/components/filters/LetterFilters";
import NamesShowcase from "@/components/showcase/NamesShowcase";

function Home() {
  useEffect(() => {
    void usePetStore.getState().loadAll();
  }, []);

  const filteredPets = useFilteredPets();

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
