import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '@/services/GlobalApi';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner'


function Skills () {
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);


  const [skillsList, setSkillsList] = useState(
    resumeInfo?.skills?.length
      ? resumeInfo.skills
      : [{ name: "", rating: 0 }]
  );

  useEffect(() => {
    setResumeInfo(prev => ({
      ...prev,
      skills: skillsList,
    }));
  }, [skillsList, setResumeInfo]);
  
  const handleChange = (index, name, value) => {
    setSkillsList((prev) => {
      const nextSkills = [...prev];

      nextSkills[index] = {
        ...nextSkills[index],
        [name]: value,
      };

      return nextSkills;
    });
  }

  const addNewSkills = () => {
    setSkillsList(prev => [
      ...prev,
      {
        name: "",
        rating: 0,
      },
    ]);
  };

  const removeSkills = () => {
    setSkillsList(prev =>
      prev.length > 1 ? prev.slice(0, -1) : prev
    );
  };

  const onSave = async () => {
    setLoading(true);

    try {
      const skills = skillsList
        .filter((skill) => skill.name.trim())
        .map(({ id, resumeId, ...skill }) => skill);

      await GlobalApi.updateSkills(
        resumeId,
        skills
      );

      toast.success("Skills updated");
    } catch (error) {
      console.error(
        "UPDATE_SKILLS_ERROR:",
        error
      );

      toast.error(
        "Failed to update skills"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p>Add Your Top Professional Skills</p>

      <div>
        {skillsList.map( (item,index) => (
          <div key={index} className='flex justify-between mb-2 border rounded-lg p-3 '>
            <div>
              <label className='text-xs'>Name</label>
              <Input className="w-full" value={item.name ?? ""} 
                onChange={(e)=>handleChange(index, 'name', e.target.value)}
              />
            </div>
            <Rating style={{ maxWidth: 120 }} value={item.rating} onChange={(v)=>handleChange(index,'rating',v)} />
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={addNewSkills} className="text-primary"> + Add More Skill</Button>
          <Button variant="outline" onClick={removeSkills}
            disabled={skillsList.length === 1} className="text-primary"
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick = {() => onSave()}>
          {loading
            ? <LoaderCircle className='animate-spin'/>
            : 'Save'
          }
        </Button>
      </div>
    </div>
  );
};

export default Skills;