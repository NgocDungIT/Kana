import SoundButton from "../components/SoundButton";
import { speakKana } from "../utils/audio";

export default function LearnPage({ deck, filter, setFilter }) {
  return (
    <div className="screen">
      <input
        className="search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Tìm chữ hoặc romaji"
      />

      <div className="grid">
        {deck.map((item) => (
          <div
            key={item.id}
            className="kana"
            onClick={() => speakKana(item.kana)}
          >
            <SoundButton kana={item.kana} />
            <div>{item.kana}</div>
            <span>{item.romaji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
