import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import GlobalApi from '@/services/GlobalApi';
import { useAxiosClient } from '@/hooks/useAxiosClient';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Brain, LoaderCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';


function Summary({ enabledNext }) {
  const { resumeId } = useParams();

  const { resumeInfo, setResumeInfo } =
    useContext(ResumeInfoContext);

  const axiosClient = useAxiosClient();
  const api = GlobalApi(axiosClient);

  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] =
    useState([]);

  useEffect(() => {
    setSummary(resumeInfo?.summary ?? '');
  }, [resumeInfo?.summary]);

  const handleSummaryChange = (e) => {
    const value = e.target.value;

    setSummary(value);

    setResumeInfo((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  const generatedSummaryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error(
        'Please enter a job title first.'
      );

      return;
    }

    setLoading(true);

    try {
      const response = await api.generateSummary(
        resumeInfo.jobTitle
      );

      setAiGeneratedSummaryList(
        response.data.data
      );
    } catch (error) {
      console.error(
        'GENERATE_SUMMARY_ERROR:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to generate summary'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = (selectedSummary) => {
    setSummary(selectedSummary);

    setResumeInfo((prev) => ({
      ...prev,
      summary: selectedSummary,
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.updateResume(resumeId, {
        summary,
      });

      enabledNext(true);

      toast.success(
        'Summary updated'
      );
    } catch (error) {
      console.error(
        'UPDATE_SUMMARY_ERROR:',
        error
      );

      toast.error(
        'Failed to update summary'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">
          Summary
        </h2>

        <p>
          Add Summary for your job title
        </p>

        <form
          className="mt-7"
          onSubmit={onSave}
        >
          <div className="flex justify-between items-end">
            <label>
              Add Summary
            </label>

            <Button
              variant="outline"
              onClick={generatedSummaryFromAI}
              type="button"
              size="sm"
              disabled={loading}
              className="border-primary text-primary flex gap-2"
            >
              {loading ? (
               <LoaderCircle className="h-4 w-4 animate-spin" />
                 ) : (
                   <Brain className="h-4 w-4" />
                 )}
                 Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5"
            required
            value={summary}
            onChange={handleSummaryChange}
          />

          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">
            Suggestions
          </h2>

          {aiGeneratedSummaryList.map(
            (item, index) => (
              <div
                key={index}
                onClick={() =>
                  handleSuggestionSelect(item.summary)
                }
                className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
              >
                <h2 className="font-bold my-1 text-primary">
                  Level: {item.experience_level}
                </h2>

                <p>
                  {item.summary}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Summary;