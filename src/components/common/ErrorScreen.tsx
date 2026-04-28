import { AlertTriangle } from "lucide-react";
import { usePetStore } from "@/store/petStore";

function ErrorScreen() {
  const error = usePetStore((s) => s.error);
  const loadAll = usePetStore((s) => s.loadAll);

  return (
    <div
      role="alert"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg px-6 text-center"
    >
      <AlertTriangle size={48} className="text-primary" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-2xl font-bold text-ink">
          Something went wrong
        </h1>
        {error && (
          <p className="text-sm text-ink/60 font-sans max-w-sm">{error}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => void loadAll()}
        className="rounded-sm border border-primary bg-primary px-5 py-2.5 text-sm text-white font-sans transition-colors hover:bg-primary/90 cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorScreen;
