import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import Pill from "../components/Pill";
import SoundButton from "../components/SoundButton";
import { speakKana } from "../utils/audio";

export default function TestPage({
  questions,
  answers,
  finished,
  mode,
  setMode,
  onStart,
  onAnswer,
  onRestart,
  onSubmit,
}) {
  if (!questions.length) {
    return (
      <div className="panel center">
        <h2>Đề thi thử</h2>
        <p>Chọn bộ đề.</p>

        <div className="mode">
          <Pill active={mode === "20"} onClick={() => setMode("20")}>20 câu</Pill>
          <Pill active={mode === "all"} onClick={() => setMode("all")}>Tất cả</Pill>
        </div>

        <button className="primary" onClick={onStart}>Tạo đề thi</button>
      </div>
    );
  }

  const score = questions.reduce((total, question, index) => {
    return total + (answers[index] === question.romaji ? 1 : 0);
  }, 0);

  return (
    <div className="screen">
      <div className="test">
        <div className="sticky">
          <b>Đề thi</b>
          <span>{Object.keys(answers).length}/{questions.length}</span>
          {finished && <h2>Kết quả: {score}/{questions.length}</h2>}
        </div>

        {questions.map((question, index) => (
          <div className="test-card" key={question.id + index}>
            <div className="meta">
              <span>Câu {index + 1}</span>
              {finished && (
                answers[index] === question.romaji
                  ? <CheckCircle2 />
                  : <XCircle />
              )}
            </div>

            <div className="test-kana">
              <SoundButton kana={question.kana} />
              {question.kana}
            </div>

            <div className="options">
              {question.options.map((option) => (
                <button
                  key={option}
                  disabled={finished}
                  onClick={() => {
                    onAnswer(index, option);
                    speakKana(question.kana);
                  }}
                  className={answers[index] === option ? "dark" : "muted"}
                >
                  {option}
                </button>
              ))}
            </div>

            {finished && answers[index] !== question.romaji && (
              <p className="wrong">Đáp án đúng: {question.romaji}</p>
            )}
          </div>
        ))}

        <div className="actions">
          <button onClick={onRestart}><RotateCcw /></button>
          <button className="primary" onClick={onSubmit}>Nộp bài</button>
        </div>
      </div>
    </div>
  );
}
