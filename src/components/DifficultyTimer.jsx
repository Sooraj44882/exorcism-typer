import { useEffect } from "react";
import { DIFFICULTY_CONFIG } from "../difficultyConfig";

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function DifficultyTimer({
  difficulty,
  timeLeft,
  setTimeLeft,
  completedCount,
  isRunning,
  onSelectDifficulty,
  onTimeExpired,
  buttonStyle,
}) {
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, setTimeLeft, onTimeExpired]);

  if (difficulty === "") {
    return (
      <>
        <h1 style={{ letterSpacing: "4px", textTransform: "uppercase", margin: 0 }}>
          Select Difficulty
        </h1>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => onSelectDifficulty("easy")} style={buttonStyle}>
            Easy (2 min • 10 chants)
          </button>
          <button onClick={() => onSelectDifficulty("medium")} style={buttonStyle}>
            Medium (1 min • 6 chants)
          </button>
          <button onClick={() => onSelectDifficulty("hard")} style={buttonStyle}>
            Hard (1 min • 10 chants)
          </button>
        </div>
      </>
    );
  }

  const config = DIFFICULTY_CONFIG[difficulty];
  const chantsLeft = Math.max(0, config.targetChants - completedCount);

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "center",
        fontSize: "15px",
        letterSpacing: "2px",
        color: timeLeft <= 15 ? "#ef4444" : "#e5e5e5",
      }}
    >
      <span>{config.label}</span>
      <span>|</span>
      <span>Time: {formatTime(timeLeft)}</span>
      <span>|</span>
      <span>Chants Left: {chantsLeft}</span>
    </div>
  );
}