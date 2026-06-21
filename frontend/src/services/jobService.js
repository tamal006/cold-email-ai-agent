import api from "./api";
export const jobService = {
  analyzeJob: async (url) => {
    const response = await api.post("/jobs/analyze", { url });
    return response.data.job;
  },
  getJobs: async () => {
    const response = await api.get("/jobs");
    return response.data.jobs;
  },
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.job;
  },
  deleteJob: async (id) => {
    await api.delete(`/jobs/${id}`);
  }
};
