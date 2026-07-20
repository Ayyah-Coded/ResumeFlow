import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import GlobalApi from '@/services/GlobalApi';

import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { toast } from 'sonner';


function EditResume() {
  const { resumeId } = useParams();
  const [ resumeInfo, setResumeInfo] = useState();
  
  useEffect( () => {       
    getResumeInfo();
  },[resumeId]);

  const getResumeInfo = async () => {
  try {
    setLoading(true);

    const response = await GlobalApi.getResumeById(resumeId);

    setResumeInfo(response.data);
  } catch (error) {
    console.error("GET_RESUME_ERROR:", error);

    toast.error("Failed to load resume");
  } finally {
    setLoading(false);
  }
  };

  if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoaderCircle className="animate-spin" />
    </div>
  );
  }
  
  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
    <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
        {/* Form Section  */}
          <FormSection/>
        {/* Preview Section  */}
         <ResumePreview/>
    </div>
    </ResumeInfoContext.Provider>
  )
};

export default EditResume;