import api from "./api";

export const generateService = {
  runFullPipeline: (data) => api.post("/generate/full-pipeline", data),
  editEmail: (data) => api.post("/generate/edit", data),
  changeTone: (data) => api.post("/generate/tone", data),
  regenerateSubjects: (emailId) => api.post("/generate/subjects", { emailId }),
  scoreEmail: (emailId) => api.post("/generate/score", { emailId }),
  updateSubject: (emailId, subject) => api.post("/generate/update-subject", { emailId, subject }),
};
