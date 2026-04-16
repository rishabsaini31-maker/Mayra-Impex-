import React from "react";

export default function Settings() {
  return (
    <div
      style={{
        marginLeft: 0,
        padding: 32,
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: 28,
          marginBottom: 24,
        }}
      >
        Settings
      </h2>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #0001",
          padding: 32,
          maxWidth: 480,
          margin: "32px auto",
          color: "#888",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 18, marginBottom: 12 }}>
          No settings available yet.
        </div>
        <div style={{ fontSize: 14 }}>
          Settings management will be added when backend support is available.
        </div>
      </div>
    </div>
  );
}
