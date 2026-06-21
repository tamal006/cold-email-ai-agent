import api from "./api";
export const authService = {
  register: async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data;
  },
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  getProfile: async () => {
    const { data } = await api.get("/auth/profile");
    return data;
  },
  updateProfile: async (profile) => {
    const { data } = await api.put("/auth/profile", profile);
    return data;
  },
  matchResume: async (jobId) => {
    const { data } = await api.post("/auth/resume-match", { jobId });
    return data.match;
  }
};
