import Home from "@/pages/Home";
import LoadingScreen from "@/components/common/LoadingScreen";
import ErrorScreen from "@/components/common/ErrorScreen";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { usePetStore } from "@/store/petStore";
import { Analytics } from "@vercel/analytics/next"

function App() {
  const status = usePetStore((s) => s.status);
  const isLoading = status === "idle" || status === "loading";
  const isError = status === "error";

  return (
    <ErrorBoundary>
      <LoadingScreen visible={isLoading} />
      {isError ? <ErrorScreen /> : <Home />}
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
