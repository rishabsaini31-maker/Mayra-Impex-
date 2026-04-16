import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/dashboard-stats")
      .then((res) => {
        setStats(res.data || {});
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
        Analytics
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stats && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px #0001",
              padding: 24,
              minWidth: 220,
            }}
          >
            <h4 style={{ margin: 0, color: "#888" }}>Total Orders</h4>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {stats.totalOrders ?? "-"}
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px #0001",
              padding: 24,
              minWidth: 220,
            }}
          >
            <h4 style={{ margin: 0, color: "#888" }}>Total Revenue</h4>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {stats.totalRevenue ? `₹${stats.totalRevenue}` : "-"}
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px #0001",
              padding: 24,
              minWidth: 220,
            }}
          >
            <h4 style={{ margin: 0, color: "#888" }}>Total Customers</h4>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {stats.totalCustomers ?? "-"}
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px #0001",
              padding: 24,
              minWidth: 220,
            }}
          >
            <h4 style={{ margin: 0, color: "#888" }}>Total Products</h4>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {stats.totalProducts ?? "-"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
