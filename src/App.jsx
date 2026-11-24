import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { sanskritLines, latinLines } from "./words";
import ManuscriptBox from "./components/ManuscriptBox";
import Ghost from "./components/Ghost";
import DifficultyTimer from "./components/DifficultyTimer";
import { DIFFICULTY_CONFIG } from "./difficultyConfig";
import DisclaimerModal from "./components/DisclaimerModal";

export default function App() {
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [outcome, setOutcome] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const [currentItem, setCurrentItem] = useState(null);
  const [lineKey, setLineKey] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [isJumpscare, setIsJumpscare] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const ambientRef = useRef(null);
  const scareRef = useRef(null);
  const deadTimeoutRef = useRef(null);

  const isGameActive = language !== "" && difficulty !== "" && outcome === "";

  useEffect(() => {
    const ambient = new Audio("/ambient.mp3");
    ambient.loop = true;
    ambient.preload = "auto";
    ambientRef.current = ambient;

    const scare = new Audio("/scare.mp3");
    scare.volume = 0.85;
    scare.preload = "auto";
    scareRef.current = scare;

    return () => {
      ambient.pause();
      scare.pause();
      if (deadTimeoutRef.current) clearTimeout(deadTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const ambient = ambientRef.current;
    if (!ambient) return;
    ambient.volume = DIFFICULTY_CONFIG[difficulty]?.ambientVolume ?? 0.35;

    if (soundOn && isGameActive) ambient.play().catch(() => {});
    else ambient.pause();
  }, [soundOn, difficulty, isGameActive]);

  const triggerScareSound = useCallback(() => {
    if (!soundOn || !scareRef.current) return;
    scareRef.current.currentTime = 0;
    scareRef.current.play().catch(() => {});
  }, [soundOn]);

  const handleGhostTouch = useCallback(() => triggerScareSound(), [triggerScareSound]);

  const loadNewLine = useCallback((lang) => {
    const list = lang === "sanskrit" ? sanskritLines : latinLines;
    setCurrentItem(list[Math.floor(Math.random() * list.length)]);
    setTypedCount(0);
    setLineKey((prev) => prev + 1);
  }, []);

  function startRun(diffKey) {
    if (deadTimeoutRef.current) clearTimeout(deadTimeoutRef.current);
    setDifficulty(diffKey);
    setTimeLeft(DIFFICULTY_CONFIG[diffKey].seconds);
    setCompletedCount(0);
    setOutcome("");
    setIsJumpscare(false);
    loadNewLine(language);
  }

  const triggerDeathSequence = useCallback(() => {
    setOutcome("dead");
    setIsJumpscare(true);
    triggerScareSound();

    if (deadTimeoutRef.current) clearTimeout(deadTimeoutRef.current);
    deadTimeoutRef.current = setTimeout(() => {
      setIsJumpscare(false);
      setOutcome("");
      setDifficulty("");
    }, 1800);
  }, [triggerScareSound]);

  useEffect(() => {
    if (!isGameActive || !currentItem || typedCount >= currentItem.line.length) return;
    const targetChants = DIFFICULTY_CONFIG[difficulty].targetChants;

    function handleKey(e) {
      if (e.key.length !== 1 || isJumpscare) return;

      if (e.key === currentItem.line[typedCount]) {
        const nextCount = typedCount + 1;
        setTypedCount(nextCount);

        if (nextCount === currentItem.line.length) {
          const nextCompleted = completedCount + 1;
          setCompletedCount(nextCompleted);
          if (nextCompleted >= targetChants) setOutcome("won");
          else setTimeout(() => loadNewLine(language), 220);
        }
      } else {
        triggerScareSound();
        setIsJumpscare(true);
        setTimeout(() => setIsJumpscare(false), 500);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isGameActive, difficulty, currentItem, typedCount, completedCount, isJumpscare, language, triggerScareSound, loadNewLine]);

  function handleBackClick() {
    if (deadTimeoutRef.current) clearTimeout(deadTimeoutRef.current);
    setIsJumpscare(false);
    setOutcome("");
    if (difficulty !== "") setDifficulty("");
    else setLanguage("");
  }

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

  return (
    <div style={pageStyle}>
      {language !== "" && (
        <button
          onClick={handleBackClick}
          style={{ ...buttonStyle, position: "fixed", top: "20px", left: "24px", zIndex: 40, padding: "8px 16px", fontSize: "12px" }}
        >
          Back
        </button>
      )}

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

      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        buttonStyle={buttonStyle}
      />

      {language === "" ? (
        <>
          <h1 style={{ letterSpacing: "4px", textTransform: "uppercase", margin: 0 }}>
            Choose Language
          </h1>
          <div style={{ display: "flex", gap: "16px" }}>
            <button onClick={() => { setLanguage("sanskrit"); setDifficulty(""); setOutcome(""); }} style={buttonStyle}>
              Sanskrit
            </button>
            <button onClick={() => { setLanguage("latin"); setDifficulty(""); setOutcome(""); }} style={buttonStyle}>
              Latin
            </button>
          </div>

          <div
            style={{
              position: "fixed",
              bottom: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                letterSpacing: "1px",
                color: "#888888",
                textAlign: "center",
              }}
            >
              Fictional game only • We respect all religions & languages
            </p>
            <button
              onClick={() => setShowDisclaimer(true)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #666666",
                color: "#bbbbbb",
                cursor: "pointer",
                fontFamily: "'Cinzel', serif",
                fontSize: "11px",
                letterSpacing: "2px",
                padding: "2px 4px",
              }}
            >
              Disclaimer
            </button>
          </div>
        </>
      ) : difficulty === "" ? (
        <DifficultyTimer
          difficulty={difficulty}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          completedCount={completedCount}
          isRunning={false}
          onSelectDifficulty={startRun}
          onTimeExpired={triggerDeathSequence}
          buttonStyle={buttonStyle}
        />
      ) : outcome === "won" ? (
        <>
          <h2 style={{ margin: 0, letterSpacing: "3px", textTransform: "uppercase" }}>Ritual Complete</h2>
          <p style={{ margin: 0, fontSize: "18px", letterSpacing: "1.5px", maxWidth: "600px", textAlign: "center", lineHeight: "1.6" }}>
            The ghost is exorcised and has freed the human body.
          </p>
          <div style={{ display: "flex", gap: "14px", marginTop: "8px" }}>
            <button onClick={() => startRun(difficulty)} style={buttonStyle}>Play Again</button>
            <button onClick={() => { setOutcome(""); setDifficulty(""); }} style={buttonStyle}>Change Difficulty</button>
          </div>
        </>
      ) : (
        <>
          <DifficultyTimer
            difficulty={difficulty}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            completedCount={completedCount}
            isRunning={isGameActive}
            onSelectDifficulty={startRun}
            onTimeExpired={triggerDeathSequence}
            buttonStyle={buttonStyle}
          />

          {isJumpscare && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(55, 5, 5, 0.94)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
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
                style={{ width: "min(85vw, 680px)", height: "min(72vh, 560px)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <img
                  src="/jump.webp"
                  alt="Jumpscare"
                  style={{ width: "100%", height: "100%", objectFit: "contain", filter: "contrast(1.35) saturate(1.2) drop-shadow(0 0 36px rgba(239, 68, 68, 0.85))" }}
                />
              </motion.div>

              {outcome === "dead" && (
                <p style={{ margin: 0, fontSize: "28px", letterSpacing: "4px", textTransform: "uppercase", color: "#ffffff", textShadow: "0 0 20px rgba(0, 0, 0, 0.95)" }}>
                  You are dead now
                </p>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "36px", width: "100%", maxWidth: "1180px" }}>
            <ManuscriptBox currentItem={currentItem} lineKey={lineKey} typedCount={typedCount} isJumpscare={isJumpscare} />
            <Ghost isJumpscare={isJumpscare} onGhostTouch={handleGhostTouch} />
          </div>
        </>
      )}
    </div>
  );
}