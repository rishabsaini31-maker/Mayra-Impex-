// Edit and Delete handlers
const handleEditCategory = (category) => {
  setShowAddModal(true);
  setAddForm({ name: category.name, id: category.id });
};

const handleDeleteCategory = async (id) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;
  setLoading(true);
  try {
    await api.delete(`/categories/${id}`);
    setCategories(categories.filter((c) => c.id !== id));
    setLoading(false);
  } catch {
    setError("Failed to delete category");
    setLoading(false);
  }
};
import React, { useEffect, useState, useRef } from "react";
import api from "../../lib/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        setCategories(res.data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch categories");
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
        Categories Management
      </h2>
      <div
        style={{
          margin: "0 0 24px 0",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <button
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            background: "#059669",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => setShowAddModal(true)}
        >
          Add Category
        </button>
        <input
          type="text"
          placeholder="Search by name"
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            minWidth: 180,
          }}
          onChange={(e) => {
            const val = e.target.value.toLowerCase();
            setCategories((prev) =>
              prev.map((cat) => ({
                ...cat,
                _hidden: cat.name.toLowerCase().indexOf(val) === -1,
              })),
            );
          }}
        />
      </div>
      {/* Add Category Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0008",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 32,
              minWidth: 320,
              maxWidth: 400,
              boxShadow: "0 4px 24px #0002",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h3
              style={{
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              {addForm.id ? "Edit Category" : "Add Category"}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAddLoading(true);
                setAddError("");
                try {
                  await api.post("/categories", addForm);
                  setShowAddModal(false);
                  setAddForm({ name: "", description: "" });
                  setAddLoading(false);
                  // Refresh categories
                  setLoading(true);
                  const res = await api.get("/categories");
                  setCategories(res.data.categories || []);
                  setLoading(false);
                } catch (err) {
                  setAddError("Failed to add category");
                  setAddLoading(false);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <input
                type="text"
                placeholder="Category Name"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                style={{
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                }}
              />
              {/* Description removed as requested */}
              {addError && (
                <div style={{ color: "red", textAlign: "center" }}>
                  {addError}
                </div>
              )}
              <button
                type="submit"
                disabled={addLoading}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  cursor: addLoading ? "not-allowed" : "pointer",
                }}
              >
                {addLoading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}
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
                Name
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    color: "#888",
                    padding: 24,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              categories
                .filter((cat) => !cat._hidden)
                .map((category, idx) => (
                  <tr
                    key={category.id}
                    style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff" }}
                  >
                    <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                      {category.id}
                    </td>
                    <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                      {category.name}
                    </td>
                    <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                      <button
                        style={{
                          marginRight: 8,
                          padding: "4px 12px",
                          borderRadius: 4,
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          padding: "4px 12px",
                          borderRadius: 4,
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </button>
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
