import { Loader2, PlusSquare } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@clerk/react'
import { v4 as uuidv4 } from 'uuid';

import GlobalApi from '@/services/GlobalApi'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner';



async function AddResume() {
  const { user } = useUser();

  const [ openDialog, setOpenDialog ] = useState(false)
  const [ resumeTitle, setResumeTitle ] = useState();
  const [ loading, setLoading ] = useState(false);
  
  const navigation = useNavigate();

  if (!resumeTitle.trim()) {
      toast.error("Please enter a resume title");
      return;
    }

  if (!user?.primaryEmailAddress?.emailAddress) {
    toast.error("User email not found");
    return;
  }

  setLoading(true);

  const resumeId = uuidv4();

  const data = {
    title: resumeTitle.trim(),
    resumeId,
    userEmail: user.primaryEmailAddress.emailAddress,
    userName: user.fullName,
  }; 

  try {
    const onCreate = await GlobalApi.CreateNewResume(data);

    toast.success("Resume created successfully");

    return onCreate;
    setTitle("");
    } catch (error) {
    console.error("CREATE_RESUME_ERROR:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to create resume"
    );
    } finally {
      setLoading(false);
    }
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