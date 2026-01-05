import api from "./axios";

export const getUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const updateUserRole = async (userId: string, role: string) => {
  const res = await api.post("/admin/role", { userId, role });
  return res.data;
};

export const getAuditLogs = async () => {
  const res = await api.get("/admin/audit-logs");
  return res.data;
};
