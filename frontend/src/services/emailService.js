import api from "./api";
export const emailService = {
  getEmails: async (params) => {
    const { data } = await api.get("/emails", { params });
    return data;
  },
  getEmailById: async (id) => {
    const { data } = await api.get(`/emails/${id}`);
    return data;
  },
  deleteEmail: async (id) => {
    const { data } = await api.delete(`/emails/${id}`);
    return data;
  },
  getStats: async () => {
    const { data } = await api.get("/emails/stats");
    return data;
  },
  getTemplates: async () => {
    const { data } = await api.get("/emails/templates");
    return data;
  }
};
