import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
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

  const triggerScareSound = useCallback(() => {
    if (!soundOn || !scareRef.current) return;
    scareRef.current.currentTime = 0;
    scareRef.current.play().catch(() => {});
  }, [soundOn]);

  const handleGhostTouch = useCallback(() => {
    triggerScareSound();
  }, [triggerScareSound]);

  const loadNewLine = useCallback((lang) => {
    const list = lang === "sanskrit" ? sanskritLines : latinLines;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentItem(list[randomIndex]);
    setTypedCount(0);
    setLineKey((prev) => prev + 1);
  }, []);

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
  }, [currentItem, typedCount, language, isJumpscare, triggerScareSound, loadNewLine]);

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
    gap: "18px",
    padding: "24px",
    fontFamily: "'Cinzel', Georgia, serif",
    position: "relative",
  };

  const buttonStyle = {
    border: "1px solid #555555",
    padding: "10px 22px",
    backgroundColor: "#111111",
    color: "#ffffff",
    cursor: "pointer",
    fontFamily: "'Cinzel', serif",
    letterSpacing: "2px",
  };

  const soundButton = (
    <button
      onClick={() => setSoundOn((prev) => !prev)}
      style={{
        position: "fixed",
        top: "20px",
        right: "24px",
        zIndex: 40,
        border: "1px solid #555555",
        padding: "8px 14px",
        backgroundColor: "#111111",
        color: soundOn ? "#ffffff" : "#999999",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        fontSize: "12px",
        letterSpacing: "2px",
      }}
    >
      {soundOn ? "Sound: On" : "Sound: Off"}
    </button>
  );

  if (language === "") {
    return (
      <div style={pageStyle}>
        {soundButton}
        <h1 style={{ letterSpacing: "4px", textTransform: "uppercase", margin: 0 }}>
          Choose Language
        </h1>
        <div style={{ display: "flex", gap: "16px" }}>
          <button onClick={() => pickLanguage("sanskrit")} style={buttonStyle}>
            Sanskrit
          </button>
          <button onClick={() => pickLanguage("latin")} style={buttonStyle}>
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
            backgroundColor: "rgba(55, 5, 5, 0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ scale: 0.75, opacity: 0.4 }}
            animate={{
              scale: [0.85, 1.16, 0.98, 1.1, 1],
              x: [-18, 18, -14, 14, -8, 8, 0],
              y: [-10, 12, -12, 8, 0],
              opacity: 1,
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              width: "min(85vw, 680px)",
              height: "min(80vh, 620px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src="/jump.webp"
              alt="Jumpscare"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter:
                  "contrast(1.35) saturate(1.2) drop-shadow(0 0 36px rgba(239, 68, 68, 0.85))",
              }}
            />
          </motion.div>
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
          ...buttonStyle,
          padding: "7px 16px",
          fontSize: "13px",
        }}
      >
        Back
      </button>
    </div>
  );
}