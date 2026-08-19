import React from "react";

// A dependency-free horizontal bar chart for assessment scores.
export default function PerformanceChart({ assessments }) {
  if (!assessments || assessments.length === 0) {
    return <p style={{ color: "#64748b" }}>No assessment data yet.</p>;
  }

  return (
    <div>
      {assessments.map((a) => {
        const pct = Math.round((a.score / a.maxScore) * 100);
        const color = pct >= 70 ? "#059669" : pct >= 50 ? "#d97706" : "#dc2626";
        return (
          <div key={a.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span>{a.title}</span>
              <span style={{ fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 6, height: 10, width: "100%" }}>
              <div
                style={{
                  width: `${pct}%`,
                  background: color,
                  height: "100%",
                  borderRadius: 6,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
