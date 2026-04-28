interface LoadingScreenProps {
  visible: boolean;
}

function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <div
      aria-live="polite"
      aria-busy={visible}
      className={[
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg transition-opacity duration-500",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {/* Pulsing logo mark */}
      <div className="flex flex-col items-center gap-3 select-none">
        <span
          className="font-serif font-black text-primary leading-none animate-pulse text-[4rem]"
          aria-hidden="true"
        >
          🐾
        </span>
        <span className="text-ink/60 text-sm font-sans tracking-widest uppercase">
          Loading names…
        </span>
      </div>

      {/* Spinner ring */}
      <svg
        className="w-10 h-10 animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}

export default LoadingScreen;
