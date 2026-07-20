const GlobalApi = (axiosClient) => ({
  createResume: (data) =>
    axiosClient.post(
      "/api/resumes",
      data
    ),

  getUserResumes: () =>
    axiosClient.get(
      "/api/resumes"
    ),

  getResumeById: (resumeId) =>
    axiosClient.get(
      `/api/resumes/${resumeId}`
    ),

  generateSummary: (jobTitle) =>
    axiosClient.post(
      "/api/ai/summary", { jobTitle }
    ),

  updateResume: (resumeId, data) =>
    axiosClient.patch(
      `/api/resumes/${resumeId}`,
      data
    ),

  updateExperiences: (resumeId, experiences) =>
    axiosClient.put(
      `/api/resumes/${resumeId}/experiences`,
      { experiences }
    ),

  updateEducation: (resumeId, education) =>
    axiosClient.put(
      `/api/resumes/${resumeId}/education`,
      { education }
    ),

  updateSkills: (resumeId, skills) =>
    axiosClient.put(
      `/api/resumes/${resumeId}/skills`,
      { skills }
    ),

  deleteResume: (resumeId) =>
    axiosClient.delete(
      `/api/resumes/${resumeId}`
    ),
});

export default GlobalApi;