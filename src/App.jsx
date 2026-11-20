import { useState } from "react";

export default function App() {
  const [language, setLanguage] = useState("");

  if (language === "") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1>Choose Language</h1>
        <div className="flex gap-4">
          <button onClick={() => setLanguage("sanskrit")} className="border px-4 py-2">
            Sanskrit
          </button>
          <button onClick={() => setLanguage("latin")} className="border px-4 py-2">
            Latin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p>You picked: {language}</p>
      <button onClick={() => setLanguage("")} className="border px-3 py-1">
        Back
      </button>
    </div>
  );
}