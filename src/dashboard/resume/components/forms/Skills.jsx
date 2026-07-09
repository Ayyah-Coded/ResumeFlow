import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '@/service/GlobalApi';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner'


function Skills () {

  const [ loading, setLoading ] = useState(false);
  const [ skillsList, setSkillsList ] = useState([{
    name:'',
    rating:0
  }]);

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const skillsLists = resumeInfo?.skills ?? [{ name: '', rating: 0 }];
  
  const handleChange = (index, name, value) => {
    const nextSkills = [...skillsLists];
    nextSkills[index] = {
      ...nextSkills[index],
      [name]: value,
    };

    setResumeInfo((prev) => ({
      ...prev,
      skills: nextSkills,
    }));
  }

  const AddNewSkills = () => {
    setSkillsList( [...skillsList,
      {
        name:'',
        rating:0 
      }])
  };

  const RemoveSkills = () => {
    setSkillsList( (skillsList) => skillsList.slice(0,-1))
  };

  const onSave = () => {
    setLoading(true);

    const data = {
      data: {skills: skillsList.map( ({ id, ...rest }) => rest)}
    };

    GlobalApi.UpdateResumeDetail( resumeId, data )
      .then( () => {
        setLoading(false);
        toast('Details updated!')
      },() => {
        setLoading(false);
        toast('Server Error, Try again!')
    });
  };

  useEffect(()=>{
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList
    })},
    [skillsList]);

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p>Add Your Top Professional Skills</p>

      <div>
        {skillsList.map( (item,index) => (
          <div className='flex justify-between mb-2 border rounded-lg p-3 '>
            <div>
              <label className='text-xs'>Name</label>
              <Input className="w-full" defaultValue={item.name} onChange={(e)=>handleChange(index,'name',e.target.value)} />
            </div>
            <Rating style={{ maxWidth: 120 }} value={item.rating} onChange={(v)=>handleChange(index,'rating',v)} />
          </div>
        ))};
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewSkills} className="text-primary"> + Add More Skill</Button>
          <Button variant="outline" onClick={RemoveSkills} className="text-primary"> - Remove</Button>
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