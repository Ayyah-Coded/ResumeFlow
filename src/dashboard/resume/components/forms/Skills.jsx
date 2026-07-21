import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import GlobalApi from '@/services/GlobalApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import { toast } from 'sonner';
import '@smastrom/react-rating/style.css';
import { LoaderCircle } from 'lucide-react';
import { Rating } from '@smastrom/react-rating';
import { useAxiosClient } from '@/hooks/useAxiosClient';



const EMPTY_SKILL = { name: '', rating: 0 };

function Skills({ enabledNext }) {
  const axiosClient = useAxiosClient();
  const api = GlobalApi(axiosClient);

  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);

  const { resumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState(
    resumeInfo?.skills?.length
      ? resumeInfo.skills
      : [
          { ...EMPTY_SKILL },
        ]
  );


  const handleChange = ( index, name, value ) => {
    setSkillsList((prev) => {
      const nextSkills = [...prev];

      nextSkills[index] = {
        ...nextSkills[index],
        [name]: value,
      };
      return nextSkills;
    });
  };


  const addNewSkills = () => {
    setSkillsList((prev) => [
      ...prev,
      { ...EMPTY_SKILL },
    ]);
  };


  const removeSkills = () => {
    setSkillsList((prev) =>
      prev.length > 1
        ? prev.slice(0, -1)
        : prev
    );
  };


  const onSave = async () => {
    setLoading(true);

    try {
      const skills = skillsList
        .filter((skill) => skill.name.trim())
        .map(({ id, resumeId, ...skill }) => skill);

      await api.updateSkills( resumeId, skills );

      if (typeof enabledNext === 'function') {
        enabledNext(true);
      }

      toast.success('Skills updated');
    } catch (error) {
      console.error('UPDATE_SKILLS_ERROR:', error);

      toast.error('Failed to update skills');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">
        Skills
      </h2>

      <p>Add Your Top Professional Skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div key={index} className="flex justify-between mb-2 border rounded-lg p-3">
            <div>
              <label className="text-xs">
                Name
              </label>

              <Input
                className="w-full" value={item.name ?? ''}
                onChange={(e) => handleChange( index, 'name', e.target.value)}
              />
            </div>

            <Rating
              style={{ maxWidth: 120, }}  value={item.rating}
              onChange={(value) => handleChange( index, 'rating', value )}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={addNewSkills}
            className="text-primary"
          >
            + Add More Skill
          </Button>

          <Button
            variant="outline"
            onClick={removeSkills}
            disabled={skillsList.length === 1}
            className="text-primary"
          >
            - Remove
          </Button>
        </div>

        <Button disabled={loading} onClick={onSave}>
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );
}


export default Skills;