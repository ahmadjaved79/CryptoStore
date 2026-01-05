import api from "./axios";

export const listFiles = async () => {
  const res = await api.get("/files");
  return res.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/files/upload", formData);
  return res.data;
};

export const downloadFile = async (id: string) => {
  const res = await api.get(`/files/${id}/download`, {
    responseType: "blob",
  });
  return res.data;
};
