// src/components/Login.jsx
import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🩺</div>
        <h2 style={styles.title}>Healthcare Translator</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #d1e7ff, #b8f3dc)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  icon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
    color: "#2d3e50",
  },
  subtitle: {
    color: "#666",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border 0.2s ease",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    background: "#1c8f6f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease",
  }
};
