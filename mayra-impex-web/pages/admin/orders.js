import api from "../../lib/api";
import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    api
      .get("/orders/all")
      .then((res) => {
        setOrders(res.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await api.get("/orders/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export CSV");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      search === "" ||
      order.id?.toString().includes(search) ||
      order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "pending" &&
        order.status?.toLowerCase() === "pending") ||
      (statusFilter === "approved" &&
        order.status?.toLowerCase() === "approved") ||
      (statusFilter === "rejected" &&
        order.status?.toLowerCase() === "rejected");
    return matchesSearch && matchesStatus;
  });

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
        Orders Management
      </h2>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            minWidth: 180,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={handleExportCSV}
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Export CSV
        </button>
      </div>
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
                Customer
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                Status
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                Total
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    color: "#888",
                    padding: 24,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff" }}
                >
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {order.id}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {order.customerName || order.customer?.name}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {order.status}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {order.total}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ""}
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
