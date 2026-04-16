import React, { useEffect, useState, useRef } from "react";
import api from "../../lib/api";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ image: null, id: undefined });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    api
      .get("/banners")
      .then((res) => {
        setBanners(res.data.banners || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const formData = new FormData(); // No title field for banners
      if (addForm.image) formData.append("image", addForm.image);
      await api.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowAddModal(false);
      setAddForm({ image: null, id: undefined });
      setAddLoading(false);
      setLoading(true);
      const res = await api.get("/banners");
      setBanners(res.data.banners || []);
      setLoading(false);
    } catch {
      setAddError("Failed to add banner");
      setAddLoading(false);
    }
  };

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
        Banners Management
      </h2>
      <div style={{ margin: "0 0 24px 0" }}>
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
          Add Banner
        </button>
      </div>
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
              Add Banner
            </h3>
            <form
              onSubmit={handleAddBanner}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {/* Title input removed as requested */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, image: e.target.files[0] }))
                }
                style={{ marginBottom: 8 }}
              />
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
                {addLoading ? "Adding..." : "Add Banner"}
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
              {/* Title column removed as requested */}
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f3f4f6",
                }}
              >
                Image
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
            {banners.length === 0 ? (
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
                  No banners found.
                </td>
              </tr>
            ) : (
              banners.map((banner, idx) => (
                <tr
                  key={banner.id}
                  style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff" }}
                >
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {banner.id}
                  </td>
                  {/* Title cell removed as requested */}
                  <td style={{ border: "1px solid #e5e7eb", padding: 10 }}>
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt="banner"
                        style={{ maxWidth: 80, maxHeight: 40, borderRadius: 4 }}
                      />
                    ) : (
                      "-"
                    )}
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
                      onClick={() => handleEditBanner(banner)}
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
                      onClick={() => handleDeleteBanner(banner.id)}
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

// Edit and Delete handlers
const handleEditBanner = (banner) => {
  setShowAddModal(true);
  setAddForm({ image: null, id: banner.id });
};

const handleDeleteBanner = async (id) => {
  if (!window.confirm("Are you sure you want to delete this banner?")) return;
  setLoading(true);
  try {
    await api.delete(`/banners/${id}`);
    setBanners(banners.filter((b) => b.id !== id));
    setLoading(false);
  } catch {
    setError("Failed to delete banner");
    setLoading(false);
  }
};
