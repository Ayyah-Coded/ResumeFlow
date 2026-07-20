import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import GlobalApi from '@/services/GlobalApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';


function Experience ({ enabledNext }) {
  const {resumeId} = useParams();
  const [ loading, setLoading ] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  
  const [ experienceList, setExperienceList ] = useState(
    resumeInfo?.experiences?.length
    ? resumeInfo.experiences 
    : [
          {
            title: "",
            companyName: "",
            city: "",
            state: "",
            startDate: "",
            endDate: "",
            workSummary: "",
          },
        ]
  );

  useEffect(() => {
    if (resumeInfo?.experiences?.length) {
      setExperienceList(resumeInfo.experiences);
    }
  }, [resumeInfo?.experiences]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      experiences: experienceList,
    }));
  }, [experienceList, setResumeInfo]);
  
  const handleChange = (index, name, value) => {
    setExperienceList((prev) => {
      const nextExperience = [...prev];

      nextExperience[index] = {
        ...nextExperience[index],
        [name]: value,
      };

      return nextExperience;
    });
  };

  const addNewExperience = () => {
    setExperienceList((prev) => [
      ...prev,
      {
        title: "",
        companyName: "",
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        workSummary: "",
      },
    ]);
  };

  const removeExperience = () => {
    setExperienceList((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.slice(0, -1);
    });
  };

  const handleRichTextEditor = (e,name,index) => {
    const newEntries = experienceList.slice();
    newEntries[index][name] = e.target.value;
    
    setExperienceList(newEntries);
  };

  const onSave = async () => {
    setLoading(true)
    try {
      const experiences = experienceList.map(
        ({ id, resumeId, ...experience }) => experience
      );

      await GlobalApi.updateExperiences(
        resumeId,
        experiences
      );

      enabledNext(true);

      toast.success("Experience updated");
    } catch (error) {
      console.error(
        "UPDATE_EXPERIENCE_ERROR:",
        error
      );

      toast.error("Failed to update experience");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add Your Previous Job Experience</p>
      <div>

      {experienceList.map( (item,index) => (
        <div key={index}>
          <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div>
              <label className='text-xs'>Position Title</label>
              <Input name ="title" onChange = {(e) => handleChange(index, e.target.name, e.target.value)} defaultValue={item?.title} />
            </div>
            <div>
                <label className='text-xs'>Company Name</label>
                <Input name="companyName" onChange={(e) => handleChange(index, e.target.name, e.target.value)} defaultValue={item?.companyName} />
            </div>
            <div>
                <label className='text-xs'>City</label>
                <Input name ="city" onChange = {(e) => handleChange(index, e.target.name, e.target.value)} defaultValue={item?.city} />
            </div>
            <div>
                <label className='text-xs'>State</label>
                <Input name="state" onChange={(e)=>handleChange(index, e.target.name, e.target.value)} defaultValue={item?.state} />
            </div>
            <div>
                <label className='text-xs'>Start Date</label>
                <Input type="date" name="startDate" onChange={(e)=>handleChange(index, e.target.name, e.target.value)} defaultValue={item?.startDate} />
            </div>
            <div>
                <label className='text-xs'>End Date</label>
                <Input type="date" name="endDate" onChange={(e)=>handleChange(index, e.target.name, e.target.value)} defaultValue={item?.endDate} />
            </div>

            <div className='col-span-2'>
                {/* Work Summary  */}
                <RichTextEditor index={index} defaultValue={item?.workSummary}
                  onRichTextEditorChange={(event)=>handleRichTextEditor(event,'workSummary',index)}
                />
            </div>
          </div>
        </div>
      ))}

      </div>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Button variant="outline" onClick={addNewExperience} className="text-primary"> + Add More Experience</Button>
            <Button variant="outline" onClick={removeExperience} className="text-primary"> - Remove</Button>
          </div>
          <Button disabled={loading} onClick = {() => onSave()}>
            {loading
              ? <LoaderCircle className='animate-spin'/>
              : 'Save'
            }    
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Experience;