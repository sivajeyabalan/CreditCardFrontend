import api from "./axiosConfig";

export const applyCard = async (data) => {
  const response = await api.post("/applications", data);
  return response.data;
};

export const trackApplication = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const getApplicationDetail = async (id) => {
  const response = await api.get(`/applications/${id}/detail`);
  return response.data;
};

export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};
