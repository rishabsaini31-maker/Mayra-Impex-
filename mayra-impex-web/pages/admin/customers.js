import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    api
      .get("/customers", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setCustomers(res.data.customers || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch customers");
        setLoading(false);
      });
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
        Customers Management
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0001", padding: 16 }}>
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
              <th style={{ border: "1px solid #e5e7eb", padding: 12, background: "#f3f4f6" }}>ID</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 12, background: "#f3f4f6" }}>Name</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 12, background: "#f3f4f6" }}>Email</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 12, background: "#f3f4f6" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", color: "#888", padding: 24, border: "1px solid #e5e7eb" }}
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer, idx) => (
                <tr key={customer.id} style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff" }}>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>{customer.id}</td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>{customer.name}</td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>{customer.email}</td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>{customer.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
