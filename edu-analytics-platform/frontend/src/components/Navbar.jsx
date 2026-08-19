import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>📊 EduAnalytics</span>
      {user && (
        <div style={styles.right}>
          <span style={styles.user}>
            {user.name} · <em>{user.role}</em>
          </span>
          <button style={styles.button} onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    background: "#1e3a8a",
    color: "white",
  },
  brand: { fontWeight: 700, fontSize: 18 },
  right: { display: "flex", alignItems: "center", gap: 12 },
  user: { fontSize: 14 },
  button: {
    background: "white",
    color: "#1e3a8a",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
