import React, { useEffect, useState } from "react";
import { listAlerts, resolveAlert, listStudents } from "../services/api";

export default function FacultyDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const loadAlerts = () => {
    listAlerts()
      .then((res) => setAlerts(res.data))
      .catch(() => setError("Could not load alerts."));
  };

  useEffect(() => {
    loadAlerts();
    listStudents()
      .then((res) => setStudents(res.data))
      .catch(() => {});
  }, []);

  const handleResolve = async (id) => {
    await resolveAlert(id);
    loadAlerts();
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Faculty Dashboard</h2>

      <div style={styles.card}>
        <h3>⚠️ At-Risk Student Alerts</h3>
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        {alerts.length === 0 ? (
          <p style={{ color: "#64748b" }}>No open alerts — everyone is on track. 🎉</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>Risk</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td style={styles.td}>{alert.User?.name || alert.studentId}</td>
                  <td style={styles.td}>
                    <span style={badgeStyle(alert.riskLevel)}>{alert.riskLevel.toUpperCase()}</span>
                  </td>
                  <td style={styles.td}>{alert.message}</td>
                  <td style={styles.td}>
                    <button style={styles.resolveBtn} onClick={() => handleResolve(alert.id)}>
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={styles.card}>
        <h3>Enrolled Students</h3>
        <ul>
          {students.map((s) => (
            <li key={s.id} style={{ fontSize: 14, marginBottom: 4 }}>
              {s.name} — {s.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function badgeStyle(level) {
  const colors = { high: "#dc2626", medium: "#d97706", low: "#059669" };
  return {
    background: colors[level] || "#64748b",
    color: "white",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  };
}

const styles = {
  card: { padding: 20, border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 20 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "8px 6px", borderBottom: "2px solid #e2e8f0", fontSize: 13 },
  td: { padding: "8px 6px", borderBottom: "1px solid #f1f5f9", fontSize: 14 },
  resolveBtn: {
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
  },
};
