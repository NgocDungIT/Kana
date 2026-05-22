import Pill from "../components/Pill";
import ProgressBar from "../components/ProgressBar";
import SoundButton from "../components/SoundButton";
import { speakKana } from "../utils/audio";

export default function QuizPage({
  questions,
  questionIndex,
  selected,
  score,
  mode,
  setMode,
  onStart,
  onAnswer,
  onNext,
}) {
  if (!questions.length) {
    return (
      <div className="panel center">
        <h2>Câu hỏi ôn tập</h2>
        <p>Chọn bộ câu hỏi.</p>

        <div className="mode">
          <Pill active={mode === "20"} onClick={() => setMode("20")}>20 câu</Pill>
          <Pill active={mode === "all"} onClick={() => setMode("all")}>Tất cả</Pill>
        </div>

        <button className="primary" onClick={onStart}>Bắt đầu</button>
      </div>
    );
  }

  const current = questions[questionIndex];
  const progress = Math.round(((questionIndex + 1) / questions.length) * 100);

  return (
    <div className="panel">
      <div className="meta">
        <span>Câu {questionIndex + 1}/{questions.length}</span>
        <span>Điểm {score}</span>
      </div>

      <ProgressBar value={progress} />

      <div className="question">
        <SoundButton kana={current.kana} />
        {current.kana}
      </div>

      <div className="options">
        {current.options.map((option) => {
          const correct = option === current.romaji;
          const picked = selected === option;

          return (
            <button
              key={option}
              onClick={() => {
                onAnswer(option);
                speakKana(current.kana);
              }}
              className={selected ? (correct ? "ok" : picked ? "bad" : "muted") : "dark"}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="primary" onClick={onNext}>
          {questionIndex + 1 === questions.length ? "Chọn bộ khác" : "Câu tiếp"}
        </button>
      )}
    </div>
  );
}
