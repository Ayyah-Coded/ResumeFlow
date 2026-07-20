import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import GlobalApi from '@/services/GlobalApi';
import { useAxiosClient } from '@/hooks/useAxiosClient';

import { useAiUsage } from '@/hooks/useAiUsage';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

function EditResume() {
  const axiosClient = useAxiosClient();
  const api = useMemo(() => GlobalApi(axiosClient), [axiosClient]);

   const { aiUsage, setAiUsage, getAiUsage } = useAiUsage();

  const { resumeId } = useParams();

  const [loading, setLoading] = useState(false);
  const [resumeInfo, setResumeInfo] = useState();

  const getResumeInfo = useCallback(async () => {
    if (!resumeId) return;

    try {
      setLoading(true);

      const response = await api.getResumeById(resumeId);

      setResumeInfo(response.data);
    } catch (error) {
      console.error("GET_RESUME_ERROR:", error);

      toast.error("Failed to load resume");
    } finally {
      setLoading(false);
    }
  }, [api, resumeId]);

  useEffect(() => {
  getResumeInfo();
  }, [getResumeInfo]);

  useEffect(() => {
    getAiUsage();
  }, [getAiUsage]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen"> 
        <LoaderCircle className="animate-spin" /> 
      </div>
    );
  };
  return (
    <ResumeInfoContext.Provider 
      value={{ 
        resumeInfo, setResumeInfo,
        aiUsage, setAiUsage
      }}> 
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
