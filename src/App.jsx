import { useState, useEffect } from "react";
import { sanskritLines, latinLines } from "./words";
import ManuscriptBox from "./components/ManuscriptBox";

export default function App() {
  const [language, setLanguage] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [lineKey, setLineKey] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [isJumpscare, setIsJumpscare] = useState(false);

  function loadNewLine(lang) {
    const list = lang === "sanskrit" ? sanskritLines : latinLines;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentItem(list[randomIndex]);
    setTypedCount(0);
    setLineKey((prev) => prev + 1);
  }

  function pickLanguage(lang) {
    setLanguage(lang);
    setIsJumpscare(false);
    loadNewLine(lang);
  }

  useEffect(() => {
    if (!currentItem) return;
    if (typedCount >= currentItem.line.length) return;

    function handleKey(e) {
      if (e.key.length !== 1) return;
      if (isJumpscare) return;

      const nextLetter = currentItem.line[typedCount];
      if (e.key === nextLetter) {
        const newCount = typedCount + 1;
        setTypedCount(newCount);

        if (newCount === currentItem.line.length) {
          setTimeout(() => {
            loadNewLine(language);
          }, 220);
        }
      } else {
        setIsJumpscare(true);
        setTimeout(() => {
          setIsJumpscare(false);
        }, 500);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentItem, typedCount, language, isJumpscare]);

  const pageStyle = {
    backgroundColor: "#050505",
    color: "#ffffff",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "16px",
    fontFamily: "'Cinzel', Georgia, serif",
  };

  if (language === "") {
    return (
      <div style={pageStyle}>
        <h1 style={{ letterSpacing: "4px", textTransform: "uppercase" }}>Choose Language</h1>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => pickLanguage("sanskrit")}
            style={{
              border: "1px solid #666",
              padding: "10px 20px",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "2px",
            }}
          >
            Sanskrit
          </button>
          <button
            onClick={() => pickLanguage("latin")}
            style={{
              border: "1px solid #666",
              padding: "10px 20px",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "2px",
            }}
          >
            Latin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {isJumpscare && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(69, 10, 10, 0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div style={{ border: "3px solid #ef4444", backgroundColor: "#000", padding: "40px", textAlign: "center" }}>
            <p style={{ color: "#ef4444", fontSize: "24px", fontWeight: "bold" }}>[ JUMPSCARE FACE HERE ]</p>
          </div>
        </div>
      )}

      <ManuscriptBox
        currentItem={currentItem}
        lineKey={lineKey}
        typedCount={typedCount}
        isJumpscare={isJumpscare}
        shouldUnmuteAudio={Boolean(language)}
      />

      <button
        onClick={() => setLanguage("")}
        style={{
          border: "1px solid #555",
          padding: "6px 14px",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
          fontFamily: "'Cinzel', serif",
        }}
      >
        Back
      </button>
    </div>
  );
}