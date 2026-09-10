import React from "react";

export default function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: "16px",
      background: "var(--bg-primary, #0a1628)"
    }}>
      <img src="/karevia0.png" alt="Karevia" style={{ height: 48, opacity: 0.9 }} />
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#3a86ff",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
          }}/>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}