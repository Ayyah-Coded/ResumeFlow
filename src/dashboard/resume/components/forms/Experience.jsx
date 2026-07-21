import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';

import GlobalApi from '@/services/GlobalApi';
import RichTextEditor from '../RichTextEditor';
import { useAxiosClient } from '@/hooks/useAxiosClient';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const EMPTY_EXPERIENCE = {
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  workSummary: '',
};


function Experience({ enabledNext }) {
  const axiosClient = useAxiosClient();
  const api = GlobalApi(axiosClient);

  const { resumeId } = useParams();
  const { resumeInfo } = useContext(ResumeInfoContext);

  const [loading, setLoading] = useState(false);
  const [experienceList, setExperienceList] = useState(
    resumeInfo?.experiences?.length
      ? resumeInfo.experiences
      : [
          {
            ...EMPTY_EXPERIENCE,
          },
        ]
  );


  const handleChange = ( index, name, value ) => {
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
        ...EMPTY_EXPERIENCE,
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


  const handleRichTextEditor = ( event, name, index ) => {
    handleChange( index, name, event.target.value );
  };


  const onSave = async () => {
    setLoading(true);

    try {
      const experiences = experienceList.map(
        ({ id, resumeId, ...experience }) =>
          experience
      );

      await api.updateExperiences(
        resumeId,
        experiences
      );

      enabledNext(true);

      toast.success(
        'Experience updated'
      );
    } catch (error) {
      console.error(
        'UPDATE_EXPERIENCE_ERROR:',
        error
      );

      toast.error(
        'Failed to update experience'
      );
    } finally {
      setLoading(false);
    }
};


  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">
          Professional Experience
        </h2>

        <p>Add Your Previous Job Experience</p>

        <div>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs">
                    Position Title
                  </label>

                  <Input
                    name="title" value={item.title ?? ''}
                    onChange={(e) => handleChange( index, e.target.name, e.target.value )}
                  />
                </div>

                <div>
                  <label className="text-xs">
                    Company Name
                  </label>

                  <Input
                    name="companyName" value={item.companyName ?? ''}
                    onChange={(e) => handleChange( index, e.target.name, e.target.value )}
                  />
                </div>

                <div>
                  <label className="text-xs">
                    City
                  </label>

                  <Input
                    name="city" value={item.city ?? ''}
                    onChange={(e) => handleChange( index, e.target.name, e.target.value )}
                  />
                </div>

                <div>
                  <label className="text-xs">
                    State
                  </label>

                  <Input
                    name="state" value={item.state ?? ''}
                    onChange={(e) => handleChange(index, e.target.name, e.target.value )}
                  />
                </div>

                <div>
                  <label className="text-xs">
                    Start Date
                  </label>

                  <Input
                    type="date" name="startDate" value={item.startDate ?? ''}
                    onChange={(e) => handleChange( index, e.target.name, e.target.value )}
                  />
                </div>

                <div>
                  <label className="text-xs">
                    End Date
                  </label>

                  <Input
                    type="date"  name="endDate" value={item.endDate ?? ''}
                    onChange={(e) =>
                      handleChange( index, e.target.name, e.target.value )}
                  />
                </div>

                <div className="col-span-2">
                  <RichTextEditor
                    positionTitle={item.title}
                    value={item.workSummary ?? ''}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(
                        event,
                        'workSummary',
                        index
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={addNewExperience}
              className="text-primary"
            >
              + Add More Experience
            </Button>

            <Button
              variant="outline"
              onClick={removeExperience}
              className="text-primary"
            >
              - Remove
            </Button>
          </div>

          <Button
            disabled={loading}
            onClick={onSave}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


export default Experience;