import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const createResume  = async (data) => {
  const response = await axiosClient.post("/api/resumes", data);

  return response.data;
};

const getUserResumes  = async (email) => {
  const response = await axiosClient.get(`/api/resumes/user/${email}`);

  return response.data;
};

const getResumeById  = async (resumeId) => {
  const response = await axiosClient.get(`/api/resumes/${resumeId}`);

  return response.data;
};

const updateExperiences = (resumeId, experiences) => {
  return axiosClient.put(
    `/api/resumes/${resumeId}/experiences`,
    { experiences }
  );
};

const updateEducation = (resumeId, education) => {
  return axiosClient.put(
    `/api/resumes/${resumeId}/education`,
    { education }
  );
};

const updateSkills = (resumeId, skills) => {
  return axiosClient.put(
    `/api/resumes/${resumeId}/skills`,
    { skills }
  );
};

const updateResume = async (resumeId, data) => {
  const response = await axiosClient.put(
    `/api/resumes/${resumeId}`,
    data
  );

  return response.data;
};

const deleteResume = async (resumeId) => {
  const response = await axiosClient.delete(`/api/resumes/${resumeId}`);
  return response.data;
}

export default {
  createResume,
  getUserResumes,
  getResumeById,
  updateSkills,
  updateResume,
  updateExperiences,
  updateEducation,
  deleteResume
};