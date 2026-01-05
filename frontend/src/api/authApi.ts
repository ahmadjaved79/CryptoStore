import api from "./axios"; // shared axios instance with interceptor

// LOGIN
export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { user, token }
};

// SIGNUP (first admin only)
export const signupApi = async (email: string, password: string) => {
  const res = await api.post("/auth/signup", { email, password });
  return res.data;
};
