import { Mars, Venus } from "lucide-react";
import type { Gender } from "@/types/pet";

interface Props {
  gender: Gender[];
}

function GenderIcon({ gender }: Props) {
  const isMale = gender.includes("M");
  const isFemale = gender.includes("F");
  return (
    <span className="flex items-center gap-1 text-ink">
      {isMale && <Mars size={36} aria-label="Male" />}
      {isFemale && <Venus size={36} aria-label="Female" />}
    </span>
  );
}

export default GenderIcon;
