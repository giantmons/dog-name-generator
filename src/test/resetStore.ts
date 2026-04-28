import { beforeEach } from "vitest";
import { usePetStore } from "@/store/petStore";

// Capture the pristine initial state once at module load time.
const initial = usePetStore.getInitialState();

/**
 * Call this at the top of any describe block that touches the Zustand store.
 * It resets all state (including actions) back to the defaults before each
 * test so tests never bleed into one another.
 */
export function resetStore() {
  beforeEach(() => {
    usePetStore.setState(initial, true);
  });
}
