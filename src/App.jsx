import { useState, useEffect } from "react";
import { sanskritLines, latinLines } from "./words";

export default function App() {
  const [language, setLanguage] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [typedCount, setTypedCount] = useState(0);
  const [isJumpscare, setIsJumpscare] = useState(false);

  function pickLanguage(lang) {
    setLanguage(lang);
    const list = lang === "sanskrit" ? sanskritLines : latinLines;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentItem(list[randomIndex]);
    setTypedCount(0);
    setIsJumpscare(false);
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
            pickLanguage(language);
          }, 200);
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
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "16px",
  };

  if (language === "") {
    return (
      <div style={pageStyle}>
        <h1>Choose Language</h1>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => pickLanguage("sanskrit")}
            style={{ border: "1px solid #555", padding: "8px 16px", background: "#111", color: "#fff", cursor: "pointer" }}
          >
            Sanskrit
          </button>
          <button
            onClick={() => pickLanguage("latin")}
            style={{ border: "1px solid #555", padding: "8px 16px", background: "#111", color: "#fff", cursor: "pointer" }}
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
            <p style={{ color: "#ef4444", fontSize: "24px", fontWeight: "bold" }}>[ bhooo ]</p>
          </div>
        </div>
      )}

      <p style={{ fontSize: "28px", letterSpacing: "2px" }}>
        {currentItem.line.split("").map((letter, index) => {
          const isTyped = index < typedCount;
          const isCurrent = index === typedCount;

          return (
            <span
              key={index}
              style={{
                color: isTyped ? "#ef4444" : isCurrent ? "#facc15" : "#9ca3af",
                backgroundColor: isCurrent ? "#450a0a" : "transparent",
                borderBottom: isCurrent ? "3px solid #ef4444" : "none",
                padding: "0 2px",
              }}
            >
              {letter}
            </span>
          );
        })}
      </p>

      <p style={{ fontSize: "14px", color: "#9ca3af" }}>{currentItem.meaning}</p>

      <button
        onClick={() => setLanguage("")}
        style={{ border: "1px solid #555", padding: "6px 12px", background: "#111", color: "#fff", cursor: "pointer" }}
      >
        Back
      </button>
    </div>
  );
}