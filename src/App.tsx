import Home from "@/pages/Home";
import LoadingScreen from "@/components/common/LoadingScreen";
import ErrorScreen from "@/components/common/ErrorScreen";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { usePetStore } from "@/store/petStore";

function App() {
  const status = usePetStore((s) => s.status);
  const isLoading = status === "idle" || status === "loading";
  const isError = status === "error";

  return (
    <ErrorBoundary>
      <LoadingScreen visible={isLoading} />
      {isError ? <ErrorScreen /> : <Home />}
    </ErrorBoundary>
  );
}

export default App;
