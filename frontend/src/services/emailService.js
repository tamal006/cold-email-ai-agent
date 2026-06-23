import api from "./api";

export const emailService = {
  list: () => api.get("/emails"),
  get: (id) => api.get(`/emails/${id}`),
  delete: (id) => api.delete(`/emails/${id}`),
  send: (emailId, recipientEmail) => api.post("/emails/send", { emailId, recipientEmail }),
};
