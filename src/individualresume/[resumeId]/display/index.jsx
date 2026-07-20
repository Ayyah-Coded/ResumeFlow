import { useCallback, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RWebShare } from 'react-web-share';

import GlobalApi from '@/services/GlobalApi';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import Header from '@/components/custom/Header';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAxiosClient } from '@/hooks/useAxiosClient';

function DisplayResume() {
  const { resumeId } = useParams();

  const axiosClient = useAxiosClient();
  const api = useMemo(() => GlobalApi(axiosClient), [axiosClient]);

  const [loading, setLoading] = useState(true);
  const [resumeInfo, setResumeInfo] = useState(null);

  const getResumeInfo = useCallback(async () => {
    if (!resumeId) return;

    try {
      setLoading(true);

      const response = await api.getResumeById(resumeId);

      setResumeInfo(response.data.data);
    } catch (error) {
      console.error('GET_RESUME_ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load resume'
      );
    } finally {
      setLoading(false);
    }
  }, [api, resumeId]);

  useEffect(() => {
    getResumeInfo();
  }, [getResumeInfo]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading resume...</p>
      </div>
    );
  }

  if (!resumeInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Resume not found.</p>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider
      value={{
        resumeInfo,
        setResumeInfo,
      }}
    >
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Professional, Neatly-Tailored, and ATS-friendly Resume is ready 🏆!
          </h2>

          <p className="text-center text-gray-400">
            Now you are ready to download your Resume and share the unique Resume URL with your friends and family 😀.
          </p>

          <div className="my-10 flex justify-center gap-5">
            <Button onClick={handleDownload}>
              Download
            </Button>

            <RWebShare
              data={{
                text: 'Hello Everyone, this is my resume. Please open the URL to view it.',
                url: `${import.meta.env.VITE_BASE_URL}/individualresume/${resumeId}/display`,
                title: `${resumeInfo.firstName ?? ''} ${resumeInfo.lastName ?? ''} resume`,
              }}
              onClick={() =>
                console.log('Resume shared successfully!')
              }
            >
              <Button>
                Share
              </Button>
            </RWebShare>
          </div>
        </div>

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <div id="print-area">
            <ResumePreview />
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default DisplayResume;