export function speakKana(kana) {
  if (!kana) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = "ja-JP";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis is not available in every browser.
  }
}
