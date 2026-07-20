import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '@/services/GlobalApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';



function Education() {
  const {resumeId} = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [ loading, setLoading ] = useState(false);
  
  const [educationList, setEducationList] = useState(
    resumeInfo?.education?.length
      ? resumeInfo.education
      : [
          {
            universityName: "",
            degree: "",
            major: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ]
  );

  useEffect(() => {
    if (resumeInfo?.education?.length) {
      setEducationList(resumeInfo.education);
    }
  }, [resumeInfo?.education]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      education: educationList,
    }));
  }, [educationList, setResumeInfo]);


  const handleChange = (index, name, value) => {
    setEducationList((prev) => {
      const nextEducation = [...prev];

      nextEducation[index] = {
        ...nextEducation[index],
        [name]: value,
      };

      return nextEducation;
    });
  };

  const addNewEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        universityName: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeEducation = () => {
    setEducationList((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.slice(0, -1);
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const education = educationList.map(
        ({ id, resumeId, ...item }) => item
      );

      await GlobalApi.updateEducation(
        resumeId,
        education
      );

      enabledNext(true);

      toast.success("Education updated");
    } catch (error) {
      console.error(
        "UPDATE_EDUCATION_ERROR:",
        error
      );

      toast.error("Failed to update education");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
    <h2 className='font-bold text-lg'>Education</h2>
    <p>Add Your Educational Qualifications</p>

    <div>
      {educationList.map((item,index)=>(
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
            <Button variant="outline" onClick={addNewEducation} className="text-primary"> + Add More Education</Button>
            <Button variant="outline" onClick={removeEducation} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
    </div>
  );
};

export default Education;