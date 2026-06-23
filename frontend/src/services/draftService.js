import api from "./api";

export const draftService = {
  save: (data) => api.post("/drafts", data),
  list: () => api.get("/drafts"),
  get: (id) => api.get(`/drafts/${id}`),
  update: (id, data) => api.put(`/drafts/${id}`, data),
  delete: (id) => api.delete(`/drafts/${id}`),
};
