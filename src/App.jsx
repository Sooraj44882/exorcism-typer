import { useState, useEffect, useRef } from "react";
import { sanskritLines, latinLines } from "./words";
import ManuscriptBox from "./components/ManuscriptBox";
import Ghost from "./components/Ghost";

export default function App() {
  const [language, setLanguage] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [lineKey, setLineKey] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [isJumpscare, setIsJumpscare] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const ambientRef = useRef(null);
  const scareRef = useRef(null);

  useEffect(() => {
    const ambient = new Audio("/ambient.mp3");
    ambient.loop = true;
    ambient.volume = 0.35;
    ambientRef.current = ambient;

    const scare = new Audio("/scare.mp3");
    scare.volume = 0.85;
    scareRef.current = scare;

    return () => {
      ambient.pause();
      scare.pause();
    };
  }, []);

  useEffect(() => {
    const ambient = ambientRef.current;
    if (!ambient) return;

    if (soundOn && language !== "") {
      ambient.play().catch(() => {});
    } else {
      ambient.pause();
    }
  }, [soundOn, language]);

  function triggerScareSound() {
    if (!soundOn || !scareRef.current) return;
    scareRef.current.currentTime = 0;
    scareRef.current.play().catch(() => {});
  }

  function handleGhostTouch() {
    triggerScareSound();
  }

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
        triggerScareSound();
        setIsJumpscare(true);
        setTimeout(() => {
          setIsJumpscare(false);
        }, 500);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentItem, typedCount, language, isJumpscare, soundOn]);

  const pageStyle = {
    backgroundColor: "#050505",
    backgroundImage:
      "radial-gradient(circle at 50% 48%, rgba(88, 12, 12, 0.24) 0%, rgba(18, 6, 6, 0.65) 48%, #030303 92%)",
    boxShadow: "inset 0 0 140px rgba(0, 0, 0, 0.95)",
    color: "#ffffff",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "24px",
    fontFamily: "'Cinzel', Georgia, serif",
    position: "relative",
  };

  const soundButton = (
    <button
      onClick={() => setSoundOn((prev) => !prev)}
      style={{
        position: "fixed",
        top: "20px",
        right: "24px",
        zIndex: 40,
        border: soundOn ? "1px solid #991b1b" : "1px solid #444",
        padding: "8px 16px",
        background: soundOn ? "rgba(69, 10, 10, 0.75)" : "rgba(18, 18, 18, 0.8)",
        color: soundOn ? "#fecaca" : "#a3a3a3",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        fontSize: "13px",
        letterSpacing: "2px",
        boxShadow: soundOn ? "0 0 14px rgba(220, 38, 38, 0.35)" : "none",
      }}
    >
      {soundOn ? "SOUND: ON" : "SOUND: OFF"}
    </button>
  );

  if (language === "") {
    return (
      <div style={pageStyle}>
        {soundButton}
        <h1
          style={{
            letterSpacing: "6px",
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(220, 38, 38, 0.45)",
          }}
        >
          Choose Language
        </h1>
        <div style={{ display: "flex", gap: "18px" }}>
          <button
            onClick={() => pickLanguage("sanskrit")}
            style={{
              border: "1px solid #7f1d1d",
              padding: "12px 26px",
              background: "rgba(20, 8, 8, 0.85)",
              color: "#fecaca",
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "3px",
              boxShadow: "0 0 16px rgba(127, 29, 29, 0.3)",
            }}
          >
            Sanskrit
          </button>
          <button
            onClick={() => pickLanguage("latin")}
            style={{
              border: "1px solid #7f1d1d",
              padding: "12px 26px",
              background: "rgba(20, 8, 8, 0.85)",
              color: "#fecaca",
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "3px",
              boxShadow: "0 0 16px rgba(127, 29, 29, 0.3)",
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
      {soundButton}

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

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "36px",
          width: "100%",
          maxWidth: "1180px",
        }}
      >
        <ManuscriptBox
          currentItem={currentItem}
          lineKey={lineKey}
          typedCount={typedCount}
          isJumpscare={isJumpscare}
        />

        <Ghost isJumpscare={isJumpscare} onGhostTouch={handleGhostTouch} />
      </div>

      <button
        onClick={() => setLanguage("")}
        style={{
          border: "1px solid #571818",
          padding: "8px 20px",
          background: "rgba(18, 8, 8, 0.8)",
          color: "#fca5a5",
          cursor: "pointer",
          fontFamily: "'Cinzel', serif",
          letterSpacing: "2px",
          boxShadow: "0 0 14px rgba(127, 29, 29, 0.25)",
        }}
      >
        Back
      </button>
    </div>
  );
}