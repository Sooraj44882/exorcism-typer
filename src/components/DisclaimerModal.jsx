export default function DisclaimerModal({ isOpen, onClose, buttonStyle }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 5, 5, 0.94)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 60,
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          border: "1px solid #444444",
          backgroundColor: "#0c0c0c",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          textAlign: "left",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          Disclaimer &amp; Respect Notice
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: "1.75",
            color: "#d4d4d4",
            fontFamily: "Georgia, serif",
          }}
        >
          This game is a work of fiction created purely for entertainment and
          typing clone inspired project . We deeply respect all religions, cultures, sacred
          traditions and languages Sanskrit and Latin.
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: "1.75",
            color: "#d4d4d4",
            fontFamily: "Georgia, serif",
          }}
        >
          No sacred names of deities ,chants and mantra are misused, and there is zero intention to
          hurt, disrespect or misrepresent any faith, belief system or
          linguistic heritage.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              padding: "8px 18px",
              fontSize: "12px",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}