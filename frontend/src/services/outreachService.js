import api from "./api";
export const outreachService = {
  generateOutreach: async (params) => {
    const response = await api.post("/outreach/generate", params);
    return response.data;
  },
  scoreOutreach: async (params) => {
    const response = await api.post("/outreach/score", params);
    return response.data.scores;
  },
  sendOutreachEmail: async (emailId) => {
    await api.post("/outreach/send", { emailId });
  }
};
