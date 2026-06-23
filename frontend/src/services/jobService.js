import api from "./api";

export const jobService = {
  analyze: (url) => api.post("/jobs/analyze", { url }),
  list: () => api.get("/jobs/list"),
  get: (id) => api.get(`/jobs/${id}`),
  delete: (id) => api.delete(`/jobs/${id}`),
};
