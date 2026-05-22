import { Shuffle } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import SoundButton from "../components/SoundButton";
import { speakKana } from "../utils/audio";

export default function FlashcardPage({ deck, index, setIndex, flipped, setFlipped }) {
  const total = deck.length;
  const currentNumber = total ? (index % total) + 1 : 0;
  const progress = total ? Math.round((currentNumber / total) * 100) : 0;
  const card = deck[index % Math.max(total, 1)];

  return (
    <div className="screen">
      <div className="progress-card">
        <div className="meta">
          <span>Tiến trình flashcard</span>
          <span>{currentNumber}/{total} • {progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <button
        className="flash"
        onClick={() => {
          setFlipped(!flipped);
          speakKana(card?.kana);
        }}
      >
        <div className="flash-inner">
          <SoundButton kana={card?.kana} />
          <div className="big">{flipped ? card?.romaji : card?.kana}</div>
          <p>Chạm để lật thẻ</p>
        </div>
      </button>

      <div className="actions">
        <button onClick={() => { setIndex((index - 1 + total) % Math.max(total, 1)); setFlipped(false); }}>Trước</button>
        <button onClick={() => { setIndex(Math.floor(Math.random() * Math.max(total, 1))); setFlipped(false); }}><Shuffle /></button>
        <button className="dark" onClick={() => { setIndex(index + 1); setFlipped(false); }}>Tiếp</button>
      </div>
    </div>
  );
}
