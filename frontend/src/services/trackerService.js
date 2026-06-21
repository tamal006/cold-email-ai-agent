import api from "./api";
export const trackerService = {
  getTrackedJobs: async () => {
    const response = await api.get("/tracker");
    return response.data.trackedJobs;
  },
  addTrackedJob: async (params) => {
    const response = await api.post("/tracker", params);
    return response.data.tracker;
  },
  updateTrackerStatus: async (id, status, note) => {
    const response = await api.patch(`/tracker/${id}/status`, {
      status,
      note
    });
    return response.data.tracker;
  },
  getAnalytics: async () => {
    const response = await api.get("/tracker/analytics");
    return response.data;
  },
  deleteTrackerEntry: async (id) => {
    await api.delete(`/tracker/${id}`);
  }
};
