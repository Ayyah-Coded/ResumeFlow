import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import GlobalApi from '@/services/GlobalApi';

import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useAxiosClient } from '@/hooks/useAxiosClient';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';


function PersonalDetail({ enabledNext }) {
  const axiosClient = useAxiosClient();
  const api = GlobalApi(axiosClient);

  const { resumeId } = useParams();

  const {
    resumeInfo,
    setResumeInfo,
  } = useContext(ResumeInfoContext);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResumeInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();

    if (!resumeInfo) {
      toast.error('Resume data is not loaded yet');
      return;
    }

    setLoading(true);

    const data = {
      firstName: resumeInfo.firstName,
      lastName: resumeInfo.lastName,
      jobTitle: resumeInfo.jobTitle,
      address: resumeInfo.address,
      phone: resumeInfo.phone,
      email: resumeInfo.email,
    };

    try {
      await api.updateResume(resumeId, data);

      enabledNext(true);

      toast.success('Personal details updated');
    } catch (error) {
      console.error(
        'UPDATE_PERSONAL_DETAILS_ERROR:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to update personal details'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">
        Personal Detail
      </h2>

      <p>
        Get Started with the basic information
      </p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">
              First Name
            </label>

            <Input
              name="firstName"
              value={resumeInfo?.firstName ?? ''}
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm">
              Last Name
            </label>

            <Input
              name="lastName"
              value={resumeInfo?.lastName ?? ''}
              required
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm">
              Job Title
            </label>

            <Input
              name="jobTitle"
              value={resumeInfo?.jobTitle ?? ''}
              required
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm">
              Address
            </label>

            <Input
              name="address"
              value={resumeInfo?.address ?? ''}
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm">
              Phone
            </label>

            <Input
              name="phone"
              value={resumeInfo?.phone ?? ''}
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm">
              Email
            </label>

            <Input
              name="email"
              value={resumeInfo?.email ?? ''}
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={loading || !resumeInfo}
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
  );
}

export default PersonalDetail;