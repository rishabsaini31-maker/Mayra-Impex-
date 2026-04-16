import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/activity")
      .then((res) => {
        setLogs(res.data.logs || []);
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
        Activity Log
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          overflowX: "auto",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #0001",
          padding: 16,
        }}
      >
        <table
          style={{
            width: "100%",
            marginTop: 0,
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                ID
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                User
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                Action
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    color: "#888",
                    padding: 24,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  No activity logs found.
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr
                  key={log.id || idx}
                  style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff" }}
                >
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {log.id}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {log.userName || log.user || "-"}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {log.action || log.event || log.message}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
