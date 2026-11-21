import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ManuscriptBox({
  currentItem,
  lineKey,
  typedCount,
  isJumpscare,
  shouldUnmuteAudio,
}) {
  const paperVideoRef = useRef(null);

  useEffect(() => {
    if (!shouldUnmuteAudio || !paperVideoRef.current) return;

    const timer = setTimeout(() => {
      paperVideoRef.current.muted = false;
      paperVideoRef.current.volume = 0.5;
      paperVideoRef.current.play().catch(() => {});
    }, 50);

    return () => clearTimeout(timer);
  }, [shouldUnmuteAudio]);

  const words = currentItem ? currentItem.line.split(" ") : [];
  const wordEntries = words.map((word, wordIdx) => {
    const prevChars = words
      .slice(0, wordIdx)
      .reduce((sum, prevWord) => sum + prevWord.length + 1, 0);
    return { word, wordIdx, startIdx: prevChars };
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "700px",
        minHeight: "270px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        textAlign: "center",
      }}
    >
      <video
        ref={paperVideoRef}
        src="/paper.webm"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.85,
          filter: "contrast(1.15)",
        }}
      />

      <motion.div
        animate={isJumpscare ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: "relative", zIndex: 10, width: "100%" }}
      >
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={lineKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
            >
              {currentItem.native && (
                <p
                    style={{
                    fontFamily: "'Tiro Devanagari Sanskrit', serif",
                    fontSize: "24px",
                    color: "#6b0f0f",
                    fontWeight: "700",
                    marginBottom: "10px",
                    letterSpacing: "1px",
                    }}
                >
                    {currentItem.native}
                </p>
                )}

              <p
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "30px",
                  letterSpacing: "2px",
                  fontWeight: "800",
                  textShadow: "0 2px 10px #000",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                {wordEntries.map(({ word, wordIdx, startIdx }) => {
                  const spaceIndex = startIdx + word.length;
                  const hasSpaceAfter = wordIdx < wordEntries.length - 1;

                  return (
                    <motion.span
                      key={wordIdx}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: wordIdx * 0.14,
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                      style={{ display: "inline-flex", alignItems: "baseline" }}
                    >
                      {word.split("").map((letter, letterIdx) => {
                        const globalIndex = startIdx + letterIdx;
                        const isTyped = globalIndex < typedCount;
                        const isCurrent = globalIndex === typedCount;

                        return (
                          <motion.span
                            key={globalIndex}
                            initial={false}
                            animate={
                              isTyped
                                ? { scale: [1.2, 1], color: "#ef4444" }
                                : isCurrent
                                ? { scale: [1, 1.08, 1], color: "#facc15" }
                                : { scale: 1, color: "#ffffff" }
                            }
                            transition={
                              isCurrent
                                ? { repeat: Infinity, duration: 1.1, ease: "easeInOut" }
                                : { duration: 0.15, ease: "easeOut" }
                            }
                            style={{
                              display: "inline-block",
                              backgroundColor: isCurrent ? "rgba(69, 10, 10, 0.85)" : "transparent",
                              borderBottom: isCurrent ? "3px solid #ef4444" : "none",
                              padding: "0 1px",
                            }}
                          >
                            {letter}
                          </motion.span>
                        );
                      })}

                      {hasSpaceAfter && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            backgroundColor: typedCount === spaceIndex ? "rgba(250, 204, 21, 0.25)" : "transparent",
                          }}
                        >
                          {"\u00A0"}
                        </span>
                      )}
                    </motion.span>
                  );
                })}
              </p>

                <p
                style={{
                    fontFamily: "'Special Elite', monospace",
                    fontSize: "15px",
                    color: "#292524",
                    fontWeight: "600",
                    marginTop: "14px",
                }}
                >
                {currentItem.meaning}
                </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}