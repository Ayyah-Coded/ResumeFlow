'use strict';

import axios from 'axios';

// Read-only public client that does not include privileged API keys.
// This should be used only for publicly accessible reads (e.g., public resume display).
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const GetResumeByIdPublic = (id) => axiosPublic.get(`/user-resumes/${id}?populate=*`);

export default {
  GetResumeByIdPublic
};
