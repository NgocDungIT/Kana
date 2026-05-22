import { useEffect, useMemo, useState } from "react";
import { BookOpen, Layers, PencilLine, Trophy } from "lucide-react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import LearnPage from "./pages/LearnPage";
import FlashcardPage from "./pages/FlashcardPage";
import QuizPage from "./pages/QuizPage";
import TestPage from "./pages/TestPage";
import { makeDeck } from "./data/kana";
import { loadState, saveState } from "./utils/storage";

const tabs = [
  ["learn", "Học", BookOpen],
  ["flash", "Flashcard", Layers],
  ["quiz", "Ôn tập", PencilLine],
  ["test", "Thi thử", Trophy],
];

function shuffle(array) { return [...array].sort(() => Math.random() - 0.5); }
function buildQuestions(deck, mode) {
  const amount = mode === "all" ? deck.length : 20;
  return shuffle(deck).slice(0, Math.min(amount, deck.length)).map((item) => ({
    ...item,
    options: shuffle([item.romaji, ...shuffle(deck.filter((x) => x.romaji !== item.romaji)).slice(0, 3).map((x) => x.romaji)]),
  }));
}

export default function App() {
  const saved = loadState();
  const [tab, setTab] = useState(saved.tab || "learn");
  const [script, setScript] = useState(saved.script || "hiragana");
  const [filter, setFilter] = useState(saved.filter || "");
  const [flashIndex, setFlashIndex] = useState(saved.flashIndex || 0);
  const [flipped, setFlipped] = useState(false);
  const [quizMode, setQuizMode] = useState(saved.quizMode || "20");
  const [testMode, setTestMode] = useState(saved.testMode || "20");
  const [quizQuestions, setQuizQuestions] = useState(saved.quizQuestions || []);
  const [quizIndex, setQuizIndex] = useState(saved.quizIndex || 0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(saved.score || 0);
  const [testQuestions, setTestQuestions] = useState(saved.testQuestions || []);
  const [testIndex, setTestIndex] = useState(saved.testIndex || 0);
  const [testAnswers, setTestAnswers] = useState(saved.testAnswers || {});
  const [finished, setFinished] = useState(saved.finished || false);

  const isStudyMode = tab !== "learn";
  const deck = useMemo(() => makeDeck(script), [script]);
  const filteredDeck = useMemo(() => deck.filter((item) => `${item.kana} ${item.romaji}`.toLowerCase().includes(filter.toLowerCase())), [deck, filter]);

  useEffect(() => {
    saveState({ tab, script, filter, flashIndex, quizMode, testMode, quizQuestions, quizIndex, score, testQuestions, testIndex, testAnswers, finished });
  }, [tab, script, filter, flashIndex, quizMode, testMode, quizQuestions, quizIndex, score, testQuestions, testIndex, testAnswers, finished]);

  function resetScript(next) {
    setScript(next); setFlashIndex(0); setFlipped(false); setQuizQuestions([]); setTestQuestions([]); setTestAnswers({}); setTestIndex(0); setFinished(false);
  }
  function exitStudy() { setTab("learn"); setSelected(null); }
  function startQuiz() { setQuizQuestions(buildQuestions(deck, quizMode)); setQuizIndex(0); setSelected(null); setScore(0); }
  function answerQuiz(answer) { if (selected) return; setSelected(answer); if (answer === quizQuestions[quizIndex].romaji) setScore(score + 1); }
  function nextQuiz() { if (quizIndex + 1 === quizQuestions.length) { setQuizQuestions([]); setSelected(null); return; } setQuizIndex(quizIndex + 1); setSelected(null); }
  function startTest() { setTestQuestions(buildQuestions(deck, testMode)); setTestAnswers({}); setTestIndex(0); setFinished(false); }

  return (
    <main className={"app " + (isStudyMode ? "study-app" : "")}> 
      <section className={"wrap " + (isStudyMode ? "study-wrap" : "")}> 
        {!isStudyMode && <Header script={script} onScriptChange={resetScript} />}
        {tab === "learn" && <LearnPage deck={filteredDeck} filter={filter} setFilter={setFilter} />}
        {tab === "flash" && <FlashcardPage deck={filteredDeck} index={flashIndex} setIndex={setFlashIndex} flipped={flipped} setFlipped={setFlipped} onExit={exitStudy} />}
        {tab === "quiz" && <QuizPage questions={quizQuestions} questionIndex={quizIndex} selected={selected} score={score} mode={quizMode} setMode={setQuizMode} onStart={startQuiz} onAnswer={answerQuiz} onNext={nextQuiz} onExit={exitStudy} />}
        {tab === "test" && <TestPage questions={testQuestions} currentIndex={testIndex} setCurrentIndex={setTestIndex} answers={testAnswers} finished={finished} mode={testMode} setMode={setTestMode} onStart={startTest} onAnswer={(index, answer) => setTestAnswers({ ...testAnswers, [index]: answer })} onRestart={startTest} onSubmit={() => setFinished(true)} onExit={exitStudy} />}
      </section>
      {!isStudyMode && <BottomNav tabs={tabs} current={tab} onChange={setTab} />}
      {isStudyMode && <button className="study-menu" onClick={exitStudy}>Thoát</button>}
    </main>
  );
}
