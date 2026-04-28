import { useEffect } from "react";
import { usePetStore } from "../store/petStore";

function Home() {
    const status = usePetStore((s) => s.status);
    const error = usePetStore((s) => s.error);
    const petsCount = usePetStore((s) => s.pets.length);
    const categoriesCount = usePetStore((s) => s.categories.length);

    useEffect(() => {
        void usePetStore.getState().loadAll();
    }, []);

    if (status === "loading" || status === "idle") {
        return <p>Loading…</p>;
    }

    if (status === "error") {
        return <p role="alert">Error: {error}</p>;
    }

    return (
        <p className="text-red-500 text-2xl font-bold text-center">
            Loaded {petsCount} names across {categoriesCount} categories.
        </p>
    );
}

export default Home;
