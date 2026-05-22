
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Layers, PencilLine, Trophy, RotateCcw, CheckCircle2, XCircle, Shuffle, Smartphone } from "lucide-react";

const HIRAGANA = [
  ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
  ["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],
  ["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],
  ["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],
  ["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],
  ["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],
  ["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],
  ["や","ya"],["ゆ","yu"],["よ","yo"],
  ["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"],
  ["わ","wa"],["を","wo"],["ん","n"]
];

const KATAKANA = [
  ["ア","a"],["イ","i"],["ウ","u"],["エ","e"],["オ","o"],
  ["カ","ka"],["キ","ki"],["ク","ku"],["ケ","ke"],["コ","ko"],
  ["サ","sa"],["シ","shi"],["ス","su"],["セ","se"],["ソ","so"],
  ["タ","ta"],["チ","chi"],["ツ","tsu"],["テ","te"],["ト","to"],
  ["ナ","na"],["ニ","ni"],["ヌ","nu"],["ネ","ne"],["ノ","no"],
  ["ハ","ha"],["ヒ","hi"],["フ","fu"],["ヘ","he"],["ホ","ho"],
  ["マ","ma"],["ミ","mi"],["ム","mu"],["メ","me"],["モ" ,"mo"],
  ["ヤ","ya"],["ユ","yu"],["ヨ","yo"],
  ["ラ","ra"],["リ","ri"],["ル","ru"],["レ","re"],["ロ","ro"],
  ["ワ","wa"],["ヲ","wo"],["ン","n"]
];

const tabs = [
  { id: "learn", label: "Học", icon: BookOpen },
  { id: "flash", label: "Flashcard", icon: Layers },
  { id: "quiz", label: "Ôn tập", icon: PencilLine },
  { id: "test", label: "Thi thử", icon: Trophy }
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(deck, amount = 10) {
  const picked = shuffle(deck).slice(0, Math.min(amount, deck.length));
  return picked.map((item) => {
    const wrong = shuffle(deck.filter((x) => x.romaji !== item.romaji)).slice(0, 3).map((x) => x.romaji);
    return { ...item, options: shuffle([item.romaji, ...wrong]) };
  });
}

function Pill({ active, children, onClick }) {
  return <button onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-slate-950 text-white shadow-lg" : "bg-white text-slate-600 shadow-sm"}`}>{children}</button>;
}

function App() {
  const [tab, setTab] = useState("learn");
  const [script, setScript] = useState("hiragana");
  const [filter, setFilter] = useState("");
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizQs, setQuizQs] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [testQs, setTestQs] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const deck = useMemo(() => {
    const base = script === "hiragana" ? HIRAGANA : KATAKANA;
    return base.map(([kana, romaji], i) => ({ id: `${script}-${i}`, kana, romaji, script }));
  }, [script]);

  const visibleDeck = useMemo(() => deck.filter(x => `${x.kana} ${x.romaji}`.toLowerCase().includes(filter.toLowerCase())), [deck, filter]);
  const currentCard = visibleDeck[flashIndex % Math.max(visibleDeck.length, 1)];

  function startQuiz() {
    setQuizQs(buildQuestions(deck, 12));
    setQuizIndex(0);
    setSelected(null);
    setScore(0);
  }

  function startTest() {
    setTestQs(buildQuestions(deck, 20));
    setTestAnswers({});
    setFinished(false);
  }

  function chooseQuiz(answer) {
    if (selected) return;
    setSelected(answer);
    if (answer === quizQs[quizIndex].romaji) setScore(score + 1);
  }

  function nextQuiz() {
    if (quizIndex + 1 >= quizQs.length) return;
    setQuizIndex(quizIndex + 1);
    setSelected(null);
  }

  const testScore = testQs.reduce((total, q, i) => total + (testAnswers[i] === q.romaji ? 1 : 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-pink-50 text-slate-900">
      <section className="mx-auto max-w-md px-4 pb-28 pt-6 sm:max-w-3xl">
        <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white/80 p-5 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-2xl text-white">あ</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Kana Study</h1>
              <p className="flex items-center gap-1 text-sm text-slate-500"><Smartphone size={14}/> Học Hiragana & Katakana trên điện thoại</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            <Pill active={script === "hiragana"} onClick={() => {setScript("hiragana"); setFlashIndex(0)}}>Hiragana</Pill>
            <Pill active={script === "katakana"} onClick={() => {setScript("katakana"); setFlashIndex(0)}}>Katakana</Pill>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {tab === "learn" && <motion.div key="learn" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} className="mt-5">
            <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Tìm chữ hoặc romaji: ka, し, ア..." className="mb-4 w-full rounded-2xl border-0 bg-white px-4 py-4 text-base shadow-lg outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-slate-900" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {visibleDeck.map(item => <motion.div whileTap={{scale:.95}} key={item.id} className="rounded-3xl bg-white p-4 text-center shadow-md">
                <div className="text-4xl font-black">{item.kana}</div>
                <div className="mt-2 rounded-full bg-slate-100 py-1 text-sm font-bold text-slate-600">{item.romaji}</div>
              </motion.div>)}
            </div>
          </motion.div>}

          {tab === "flash" && <motion.div key="flash" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} className="mt-5">
            <button onClick={()=>setFlipped(!flipped)} className="h-80 w-full rounded-[2rem] bg-white p-6 shadow-2xl">
              <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{duration:.35}} className="grid h-full place-items-center rounded-[1.5rem] border-2 border-dashed border-slate-200">
                <div className={flipped ? "[transform:rotateY(180deg)]" : ""}>
                  <div className="text-8xl font-black">{flipped ? currentCard?.romaji : currentCard?.kana}</div>
                  <p className="mt-4 text-sm font-semibold text-slate-400">Chạm để lật thẻ</p>
                </div>
              </motion.div>
            </button>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button className="rounded-2xl bg-white py-4 font-bold shadow" onClick={()=>{setFlashIndex(Math.max(0, flashIndex-1)); setFlipped(false)}}>Trước</button>
              <button className="rounded-2xl bg-white py-4 font-bold shadow" onClick={()=>{setFlashIndex(Math.floor(Math.random()*visibleDeck.length)); setFlipped(false)}}><Shuffle className="mx-auto"/></button>
              <button className="rounded-2xl bg-slate-950 py-4 font-bold text-white shadow" onClick={()=>{setFlashIndex(flashIndex+1); setFlipped(false)}}>Tiếp</button>
            </div>
          </motion.div>}

          {tab === "quiz" && <motion.div key="quiz" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} className="mt-5 rounded-[2rem] bg-white p-5 shadow-xl">
            {!quizQs.length ? <div className="text-center"><h2 className="text-xl font-black">Câu hỏi ôn tập nhanh</h2><p className="mt-2 text-slate-500">Chọn romaji đúng cho mỗi ký tự.</p><button onClick={startQuiz} className="mt-6 w-full rounded-2xl bg-slate-950 py-4 font-bold text-white">Bắt đầu ôn tập</button></div> : <>
              <div className="mb-4 flex justify-between text-sm font-bold text-slate-500"><span>Câu {quizIndex+1}/{quizQs.length}</span><span>Điểm {score}</span></div>
              <div className="text-center text-8xl font-black">{quizQs[quizIndex].kana}</div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {quizQs[quizIndex].options.map(opt => {
                  const isRight = opt === quizQs[quizIndex].romaji;
                  const picked = selected === opt;
                  return <button key={opt} onClick={()=>chooseQuiz(opt)} className={`rounded-2xl py-4 text-lg font-black shadow ${selected ? isRight ? "bg-emerald-100 text-emerald-700" : picked ? "bg-rose-100 text-rose-700" : "bg-slate-50 text-slate-400" : "bg-slate-950 text-white"}`}>{opt}</button>
                })}
              </div>
              {selected && <button onClick={quizIndex + 1 === quizQs.length ? startQuiz : nextQuiz} className="mt-5 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white">{quizIndex + 1 === quizQs.length ? "Làm lại" : "Câu tiếp"}</button>}
            </>}
          </motion.div>}

          {tab === "test" && <motion.div key="test" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} className="mt-5">
            {!testQs.length ? <div className="rounded-[2rem] bg-white p-5 text-center shadow-xl"><h2 className="text-xl font-black">Đề thi thử 20 câu</h2><p className="mt-2 text-slate-500">Làm một lượt rồi xem kết quả cuối bài.</p><button onClick={startTest} className="mt-6 w-full rounded-2xl bg-slate-950 py-4 font-bold text-white">Tạo đề thi</button></div> : <div className="space-y-4">
              <div className="sticky top-3 z-10 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur"><div className="flex items-center justify-between"><b>Đề thi</b><span className="text-sm text-slate-500">{Object.keys(testAnswers).length}/{testQs.length}</span></div>{finished && <div className="mt-2 text-2xl font-black">Kết quả: {testScore}/{testQs.length}</div>}</div>
              {testQs.map((q,i)=><div key={q.id+i} className="rounded-3xl bg-white p-4 shadow-md">
                <div className="mb-3 flex items-center justify-between"><span className="font-bold text-slate-400">Câu {i+1}</span>{finished && (testAnswers[i]===q.romaji ? <CheckCircle2 className="text-emerald-600"/> : <XCircle className="text-rose-600"/>)}</div>
                <div className="text-center text-6xl font-black">{q.kana}</div>
                <div className="mt-4 grid grid-cols-2 gap-2">{q.options.map(opt=><button disabled={finished} onClick={()=>setTestAnswers({...testAnswers,[i]:opt})} className={`rounded-2xl py-3 font-black ${testAnswers[i]===opt ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`} key={opt}>{opt}</button>)}</div>
                {finished && testAnswers[i] !== q.romaji && <p className="mt-3 text-center text-sm font-semibold text-rose-600">Đáp án đúng: {q.romaji}</p>}
              </div>)}
              <div className="grid grid-cols-2 gap-3"><button onClick={startTest} className="rounded-2xl bg-white py-4 font-bold shadow"><RotateCcw className="mx-auto"/></button><button onClick={()=>setFinished(true)} className="rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow">Nộp bài</button></div>
            </div>}
          </motion.div>}
        </AnimatePresence>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md rounded-t-[2rem] bg-white/95 px-3 py-3 shadow-2xl backdrop-blur sm:max-w-3xl">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map(({id,label,icon:Icon}) => <button key={id} onClick={()=>setTab(id)} className={`rounded-2xl px-2 py-3 text-xs font-bold transition ${tab===id ? "bg-slate-950 text-white" : "text-slate-500"}`}><Icon className="mx-auto mb-1" size={20}/>{label}</button>)}
        </div>
      </nav>
    </main>
  );
}

export default App;
