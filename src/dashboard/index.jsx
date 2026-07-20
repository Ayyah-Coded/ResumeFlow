import { useCallback, useEffect, useState } from "react";

import AddResume from "./components/AddResume";
import ResumeCardItem from "./components/ResumeCardItem";

import GlobalApi from "@/services/GlobalApi";

function Dashboard() {
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getResumesList = useCallback(async () => {
    try {
      const response = await GlobalApi.getUserResumes();

      setResumeList(response.data.data);
    } catch (error) {
      console.error("GET_RESUMES_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getResumesList();
  }, [getResumesList]);

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>

      <p>
        Start creating professional and compelling resumes for your next dream
        role.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <AddResume />

        {loading ? (
          [1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            />
          ))
        ) : resumeList.length > 0 ? (
          resumeList.map((resume) => (
            <ResumeCardItem
              key={resume.resumeId}
              resume={resume}
              refreshData={getResumesList}
            />
          ))
        ) : null}
      </div>
    </div>
  );
}

export default Dashboard;