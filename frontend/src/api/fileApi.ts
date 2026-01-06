import api from "./axios";

// List my files
export const listFiles = async () => {
  const res = await api.get("/files");
  return res.data;
};

// Upload
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/files/upload", formData);
  return res.data;
};

// Download
export const downloadFile = async (id: string) => {
  const res = await api.get(`/files/${id}/download`, {
    responseType: "blob",
  });
  return res.data;
};

// Share
export const shareFile = async (fileId: string, userId: string) => {
  const res = await api.post("/files/share", { fileId, userId });
  return res.data.data;
};

// Shared with me
export const getSharedFiles = async () => {
  const res = await api.get("/files/shared");
  return res.data.data;
};
