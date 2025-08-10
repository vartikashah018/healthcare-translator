import React from "react";
import { parseJwt } from "../utils/auth";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const user = parseJwt(token);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.email}</h1>
      <p>Role: <strong>{user?.role}</strong></p>

      {user?.role === "admin" ? (
        <div>
          <h3>🛠 Admin Controls</h3>
          <p>Access to user data, logs, and settings.</p>
        </div>
      ) : (
        <div>
          <h3>👤 User Dashboard</h3>
          <p>Access to translation and voice features.</p>
        </div>
      )}
    </div>
  );
}
