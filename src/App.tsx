import Home from "./pages/Home";
import LoadingScreen from "./components/LoadingScreen";
import { usePetStore } from "./store/petStore";

function App() {
  const status = usePetStore((s) => s.status);
  const isLoading = status === "idle" || status === "loading";

  return (
    <>
      <LoadingScreen visible={isLoading} />
      <Home />
    </>
  );
}

export default App;
