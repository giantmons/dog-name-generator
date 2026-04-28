import dogShepherd from "../assets/dogs/dogShepherd.png";

interface LoadingScreenProps {
  visible: boolean;
}

function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f9f8f5] transition-opacity duration-500 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
    </div>
  );
}

export default LoadingScreen;
