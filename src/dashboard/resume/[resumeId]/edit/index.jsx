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

    const GetResumeInfo = () => {
      GlobalApi.GetResumeById(resumeId).then( resp => {
        setResumeInfo(resp.data.data);
      }, () => {
        toast('Unable to load resume');
      });
    };

    useEffect( () => {       
      GetResumeInfo();
    },[resumeId]);



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