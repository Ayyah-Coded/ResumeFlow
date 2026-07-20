import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, PlusSquare } from 'lucide-react'


import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAxiosClient } from "@/hooks/useAxiosClient";
import GlobalApi from '@/services/GlobalApi'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"



function AddResume() {
  const axiosClient = useAxiosClient();
  const api = GlobalApi(axiosClient);

  const [ loading, setLoading ] = useState(false);
  const [ resumeTitle, setResumeTitle ] = useState("");
  const [ openDialog, setOpenDialog ] = useState(false)
  
  const navigation = useNavigate();

  const onCreate = async () => {
    if (!resumeTitle.trim()) {
      toast.error("Please enter a resume title");
      return;
    }

    setLoading(true);
    const resumeId = uuidv4();

    const data = {
      title: resumeTitle.trim(),
      resumeId,
    }; 

    try {
      await api.createResume(data);

      toast.success("Resume created successfully");

      setResumeTitle("");
      setOpenDialog(false);
      
      navigation(`/dashboard/resume/${resumeId}/edit`);
    } catch (error) {
      console.error("CREATE_RESUME_ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create resume"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div >
      <div 
        className ='p-14 py-24 border items-center flex justify-center bg-secondary
          rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'
        onClick = { () => setOpenDialog(true) }
      >
        <PlusSquare/>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add a title for your new resume</p>
              <Input 
                className ="my-2" 
                placeholder ="Ex.Full Stack resume"
                onChange = { (e) => setResumeTitle(e.target.value) }
              />
              <div className ='flex justify-end gap-5'>
                <Button onClick = {() => setOpenDialog(false)} variant="ghost">
                  Cancel
                </Button>
                <Button disabled = { !resumeTitle || loading } onClick = { () => onCreate() }>
                  {loading?
                  <Loader2 className = 'animate-spin' /> :'Create'   
                }
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddResume;