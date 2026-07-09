import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import GlobalApi from '@/services/GlobalApi';
import { AIChatSession } from '@/services/AIModel';

import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const prompt="Job Title: {jobTitle} , Depends on job title give me list of  summary for 3 experience level, Mid Level and Entry level in 5-7 lines in array format, With summary and experience_level Field in JSON Format"

function Summary ({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [ summary, setSummary ] = useState("");
  const [ loading, setLoading ] = useState(false);
  
  const { resumeId } = useParams();
  
  const [ aiGeneratedSummaryList, setAiGenerateSummaryList ] = useState([]);
  
  useEffect(() => {
    setResumeInfo(prev => ({
      ...prev,
      summary,
    }));
  }, [summary, setResumeInfo]);

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error("Please enter a job title first.");
      return;
    };

    setLoading(true);

    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
    

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      setAiGenerateSummaryList(JSON.parse(result.response.text()));
    } catch (e) {
      toast.error('Failed to generate summary, please try again');
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();    
    setLoading(true)

    const data={
      data:{ summary }
    };

    try {
      await GlobalApi.UpdateResumeDetail( resumeId, data);
      enabledNext(true);
      toast.success("Details updated")
    } catch (error) {
      toast.error("Failed to update details");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add Summary for your job title</p>

        <form className='mt-7' onSubmit = {onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>
            <Button 
              variant ="outline" 
              onClick = { () => GenerateSummaryFromAI() }
              type ="button" size="sm" 
              className ="border-primary text-primary flex gap-2"
            > 
              <Brain className='h-4 w-4' />
              Generate from AI
            </Button>
          </div>
          <Textarea 
            className="mt-5" required value = {summary}
            onChange = { (e) => setSummary(e.target.value)}
          />
          <div className='mt-2 flex justify-end'>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className='animate-spin'/> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummaryList.length > 0 && 
        <div className='my-5'>
          <h2 className='font-bold text-lg'>
            Suggestions
          </h2>
          {aiGeneratedSummaryList.map( (item,index) => (
            <div key={index} onClick = {() => setSummary(item?.summary)} className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
              <h2 className='font-bold my-1 text-primary'>
                Level: {item.experience_level}
              </h2>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default Summary;