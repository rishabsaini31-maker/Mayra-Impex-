import React, { useMemo, useState } from "react";
import { uploadImage } from "../lib/uploadApi";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const buildObjectUrl = (file) => (file ? URL.createObjectURL(file) : "");

export default function ImageUploader({
  token,
  folder = "products",
  onUploaded,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(null);
  const [error, setError] = useState("");

  const transformedUrls = useMemo(
    () => uploaded?.transformed || null,
    [uploaded],
  );

  const validateFile = (candidate) => {
    if (!candidate) return "Please select an image.";
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      return "Only JPG, PNG, and WEBP files are allowed.";
    }
    if (candidate.size > MAX_FILE_SIZE) {
      return "File is too large. Max size is 5MB.";
    }
    return "";
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    const validationError = validateFile(selected);

    setError(validationError);
    setUploaded(null);
    setProgress(0);

    if (validationError) {
      setFile(null);
      setPreviewUrl("");
      return;
    }

    setFile(selected);
    setPreviewUrl(buildObjectUrl(selected));
  };

  const handleUpload = async () => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const data = await uploadImage({
        file,
        token,
        folder,
        onProgress: setProgress,
      });

      setUploaded(data);
      onUploaded?.(data);
    } catch (uploadError) {
      setError(
        uploadError?.response?.data?.error ||
          uploadError.message ||
          "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 520,
        border: "1px solid #d1d5db",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 10 }}>Image Upload</h3>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div style={{ marginTop: 14 }}>
          <p style={{ marginBottom: 8 }}>Preview</p>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: 260,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !file}
        style={{
          marginTop: 14,
          padding: "10px 14px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploading ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 8, background: "#e5e7eb", borderRadius: 9999 }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 9999,
                background: "#2563eb",
                transition: "width 180ms ease",
              }}
            />
          </div>
          <small>{progress}%</small>
        </div>
      ) : null}

      {error ? (
        <p style={{ color: "#dc2626", marginTop: 10 }}>{error}</p>
      ) : null}

      {uploaded ? (
        <div style={{ marginTop: 14 }}>
          <p style={{ marginBottom: 8 }}>Uploaded Image</p>
          <img
            src={uploaded.url}
            alt="Uploaded"
            style={{
              width: "100%",
              maxHeight: 280,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
          <p style={{ marginTop: 8, fontSize: 13 }}>
            public_id: {uploaded.public_id}
          </p>

          {transformedUrls ? (
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <p style={{ margin: 0 }}>Transformation examples:</p>
              <p style={{ margin: "6px 0" }}>
                Thumbnail: {transformedUrls.thumbnail}
              </p>
              <p style={{ margin: "6px 0" }}>
                Product Card: {transformedUrls.productCard}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
