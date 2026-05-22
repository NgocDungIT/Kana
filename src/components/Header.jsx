import { Smartphone } from "lucide-react";
import Pill from "./Pill";

export default function Header({ script, onScriptChange }) {
  return (
    <header className="hero">
      <div className="brand">
        <div className="logo">あ</div>
        <div>
          <h1>Kana Study</h1>
          <p><Smartphone size={14} /> Học Hiragana & Katakana trên điện thoại</p>
        </div>
      </div>

      <div className="pills">
        <Pill active={script === "hiragana"} onClick={() => onScriptChange("hiragana")}>Hiragana</Pill>
        <Pill active={script === "katakana"} onClick={() => onScriptChange("katakana")}>Katakana</Pill>
      </div>
    </header>
  );
}
