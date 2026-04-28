import { useEffect, useMemo } from "react";
import { usePetStore } from "../store/petStore";
import GenderToggle from "../components/GenderToggle";

function Home() {
    const status = usePetStore((s) => s.status);
    const error = usePetStore((s) => s.error);
    const pets = usePetStore((s) => s.pets);
    const genderFilter = usePetStore((s) => s.genderFilter);
    const categoriesCount = usePetStore((s) => s.categories.length);

    useEffect(() => {
        void usePetStore.getState().loadAll();
    }, []);

    const filteredPets = useMemo(() => {
        if (genderFilter === "B") return pets;
        return pets.filter((p) => p.gender.includes(genderFilter));
    }, [pets, genderFilter]);

    if (status === "loading" || status === "idle") {
        return <p>Loading…</p>;
    }

    if (status === "error") {
        return <p role="alert">Error: {error}</p>;
    }

    return (
        <div className="p-6 space-y-4">
            <GenderToggle />
            <p className="text-2xl font-bold text-center">
                Showing {filteredPets.length} of {pets.length} names across {categoriesCount} categories.
            </p>
        </div>
    );
}

export default Home;
