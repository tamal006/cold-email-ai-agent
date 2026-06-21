import api from "./api";
export const agentService = {
  generateEmail: async (data) => {
    const response = await api.post("/agent/generate", data);
    return response.data;
  },
  sendEmail: async (emailId) => {
    const { data } = await api.post("/agent/send", { emailId });
    return data;
  },
  saveDraft: async (emailData) => {
    const { data } = await api.post("/agent/draft", emailData);
    return data;
  },
  getVariations: async (input) => {
    const { data } = await api.post("/agent/variations", input);
    return data;
  },
  optimizeSubject: async (subject, content, purpose) => {
    const { data } = await api.post("/agent/optimize-subject", { subject, content, purpose });
    return data;
  }
};
