import { useState } from "react";
import { sanskritLines, latinLines } from "./words";

export default function App() {
  const [language, setLanguage] = useState("");
  const [currentItem, setCurrentItem] = useState(null);

  function pickLanguage(lang) {
    setLanguage(lang);
    const list = lang === "sanskrit" ? sanskritLines : latinLines;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentItem(list[randomIndex]);
  }

  if (language === "") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1>Choose Language</h1>
        <div className="flex gap-4">
          <button onClick={() => pickLanguage("sanskrit")} className="border px-4 py-2">
            Sanskrit
          </button>
          <button onClick={() => pickLanguage("latin")} className="border px-4 py-2">
            Latin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">{currentItem.line}</p>
      <p className="text-sm text-gray-400">{currentItem.meaning}</p>

      <div className="flex gap-3">
        <button onClick={() => pickLanguage(language)} className="border px-3 py-1">
          Next
        </button>
        <button onClick={() => setLanguage("")} className="border px-3 py-1">
          Back
        </button>
      </div>
    </div>
  );
}