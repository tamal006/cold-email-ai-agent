import api from "./api";
export const contactService = {
  discoverContacts: async (jobId) => {
    const response = await api.post(`/contacts/discover/${jobId}`);
    return response.data;
  },
  getContactsForJob: async (jobId) => {
    const response = await api.get(`/contacts/job/${jobId}`);
    return response.data;
  },
  toggleSaveContact: async (id) => {
    const response = await api.post(`/contacts/${id}/save`);
    return response.data.contact;
  },
  deleteContact: async (id) => {
    await api.delete(`/contacts/${id}`);
  }
};
