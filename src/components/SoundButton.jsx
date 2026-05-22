import { Volume2 } from "lucide-react";
import { speakKana } from "../utils/audio";

export default function SoundButton({ kana }) {
  return (
    <button
      className="sound"
      onClick={(event) => {
        event.stopPropagation();
        speakKana(kana);
      }}
    >
      <Volume2 size={18} />
    </button>
  );
}
