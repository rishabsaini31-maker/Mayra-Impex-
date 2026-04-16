import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => {
        setProfile(res.data.profile || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
        Admin Profile
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {profile && (
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #0001",
            padding: 32,
            maxWidth: 480,
            margin: "32px auto",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {profile.name || profile.username || "-"}
          </div>
          <div style={{ color: "#888", marginBottom: 8 }}>
            Email: {profile.email || "-"}
          </div>
          <div style={{ color: "#888", marginBottom: 8 }}>
            Role: {profile.role || "Admin"}
          </div>
          <div style={{ color: "#888", marginBottom: 8 }}>
            ID: {profile.id || "-"}
          </div>
        </div>
      )}
    </div>
  );
}
