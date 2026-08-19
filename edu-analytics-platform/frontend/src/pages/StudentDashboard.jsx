import React, { useEffect, useState } from "react";
import { getStudentPerformance } from "../services/api";
import PerformanceChart from "../components/PerformanceChart";

export default function StudentDashboard({ user }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getStudentPerformance(user.id)
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load your performance data."));
  }, [user]);

  if (error) return <p style={{ padding: 24, color: "#dc2626" }}>{error}</p>;
  if (!data) return <p style={{ padding: 24 }}>Loading your dashboard...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Welcome back, {user.name.split(" ")[0]} 👋</h2>

      <div style={styles.statRow}>
        <StatCard label="Average Score" value={`${data.avgScore}%`} />
        <StatCard label="Attendance Rate" value={`${data.attendanceRate}%`} />
        <StatCard label="Engagement (min)" value={data.engagementScore} />
      </div>

      <div style={styles.card}>
        <h3>Assessment Performance</h3>
        <PerformanceChart assessments={data.assessments} />
      </div>

      <div style={styles.card}>
        <h3>Recent Activity</h3>
        {data.engagementLogs.length === 0 ? (
          <p style={{ color: "#64748b" }}>No activity logged yet.</p>
        ) : (
          <ul>
            {data.engagementLogs.map((log) => (
              <li key={log.id} style={{ fontSize: 14, marginBottom: 4 }}>
                {log.activityType.replace("_", " ")} — {log.durationMinutes} min
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#1e3a8a" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
    </div>
  );
}

const styles = {
  statRow: { display: "flex", gap: 16, marginBottom: 20 },
  stat: {
    flex: 1,
    padding: 16,
    background: "#f1f5f9",
    borderRadius: 10,
    textAlign: "center",
  },
  card: {
    padding: 20,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    marginBottom: 20,
  },
};
