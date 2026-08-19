import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      navigate(user.role === "faculty" ? "/faculty" : "/student");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={{ marginTop: 0, color: "#1e3a8a" }}>EduAnalytics Login</h2>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: -8 }}>
          Try: faculty@edu.test or sneha@edu.test — password: Password123!
        </p>

        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}

        <button style={styles.button} type="submit">
          Log in
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", justifyContent: "center", marginTop: 60 },
  card: {
    width: 340,
    padding: 28,
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  label: { display: "block", fontSize: 13, fontWeight: 600, marginTop: 12, marginBottom: 4 },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
  },
  button: {
    marginTop: 20,
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },
};
