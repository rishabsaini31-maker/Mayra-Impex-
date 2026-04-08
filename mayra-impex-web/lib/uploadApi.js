import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5001/api";

export const uploadImage = async ({
  file,
  token,
  folder = "products",
  onProgress,
}) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    onUploadProgress: (event) => {
      if (!event.total) return;
      const percent = Math.round((event.loaded * 100) / event.total);
      onProgress?.(percent);
    },
  });

  return response.data;
};

export const deleteImage = async ({ publicId, token }) => {
  const response = await axios.delete(`${API_BASE_URL}/delete-image`, {
    data: { public_id: publicId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return response.data;
};
