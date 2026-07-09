import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '@/services/GlobalApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const createEducationEntry = () => ({
  universityName: '',
  degree: '',
  major: '',
  startDate: '',
  endDate: '',
  description: '',
});

function Education () {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  const [ loading, setLoading ] = useState(false);
  const educationalList = Array.isArray(resumeInfo?.education) && resumeInfo.education.length > 0
    ? resumeInfo.education
    : [createEducationEntry()];

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const newEntries = educationalList.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [name]: value } : item
    );

    setResumeInfo((prev) => ({
      ...(prev ?? {}),
      education: newEntries,
    }));
  };

  const AddNewEducation = () => {
    setResumeInfo((prev) => ({
      ...(prev ?? {}),
      education: [...educationalList, createEducationEntry()],
    }));
  };

  const RemoveEducation = () => {
    if (educationalList.length <= 1) return;

    setResumeInfo((prev) => ({
      ...(prev ?? {}),
      education: educationalList.slice(0, -1),
    }));
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        education: educationalList.map((item) => {
          const rest = { ...item };
          delete rest.id;
          return rest;
        }),
      },
    };

    GlobalApi.UpdateResumeDetail(params.resumeId, data).then(() => {
      setLoading(false);
      toast('Details updated !');
    }, () => {
      setLoading(false);
      toast('Server Error, Please try again!');
    });
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
    <h2 className='font-bold text-lg'>Education</h2>
    <p>Add Your Educational Qualifications</p>

    <div>
      {educationalList.map((item,index)=>(
        <div key={index}>
          <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div className='col-span-2'>
              <label>University Name</label>
              <Input name="universityName" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.universityName}
              />
            </div>
            <div>
              <label>Degree</label>
              <Input name="degree" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.degree} />
            </div>
            <div>
              <label>Major</label>
              <Input name="major" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.major} />
            </div>
            <div>
              <label>Start Date</label>
              <Input type="date" name="startDate" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.startDate} />
            </div>
            <div>
              <label>End Date</label>
              <Input type="date" name="endDate" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.endDate} />
            </div>
            <div className='col-span-2'>
              <label>Description</label>
              <Textarea name="description" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.description} />
            </div>

          </div>
       
        </div>
      ))}
    </div>
    <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewEducation} className="text-primary"> + Add More Education</Button>
            <Button variant="outline" onClick={RemoveEducation} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
    </div>
  );
};

export default Education;