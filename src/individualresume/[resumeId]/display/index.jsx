import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RWebShare } from 'react-web-share';

import GlobalApi from '@/services/GlobalApi'
import PublicApi from '@/services/PublicApi'
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import Header from '@/components/custom/Header';

import { Button } from '@/components/ui/button';

function DisplayResume () {
  const [ resumeInfo, setResumeInfo ] = useState();
  const { resumeId } = useParams();

  const GetResumeInfo = async () => {
    try {
      const resp = await PublicApi.GetResumeByIdPublic(resumeId);
      setResumeInfo(resp.data.data);
    } catch (err) {
      console.warn("Public fetch failed, attempting authenticated fetch", err);

      try {
        const resp = await GlobalApi.GetResumeById(resumeId);
        setResumeInfo(resp.data.data);
      } catch (error) {
        console.error("Authenticated fetch failed", error);
      }
    }
  };
  
  useEffect(() => {
    GetResumeInfo();
  }, [resumeId]);

  const HandleDownload = () => {
    window.print();
  };
  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header/>
        <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
          <h2 className='text-center text-2xl font-medium'>
            Congrats! Your Professional, Neatly-Tailored, and ATS-friendly Resume is ready 🏆!
          </h2>
          <p className='text-center text-gray-400'>
            Now you are ready to download your Resume and share the unique Resume url with your friends and family 😀.
          </p>
          <div className='flex justify-between px-44 my-10'>
            <Button onClick={HandleDownload}>Download</Button>              
            <RWebShare
              data = {{
                text: "Hello Everyone, This is my resume please open url to see it",
                url: `${import.meta.env.VITE_BASE_URL}/individualresume/${resumeId}/display`,
                title: `${resumeInfo?.firstName} ${resumeInfo?.lastName} resume`
              }}
              onClick={() => console.log("shared successfully!")}
            > 
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>        
        <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
          <div id="print-area" >
            <ResumePreview/>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default DisplayResume;