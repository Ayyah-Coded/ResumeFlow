import { useState } from 'react';
import { toast } from 'sonner'
import GlobalApi from '@/services/GlobalApi'
import { Link, useNavigate } from 'react-router-dom';
import { useAxiosClient } from '@/hooks/useAxiosClient';
import { Loader2Icon, MoreVertical } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"


function ResumeCardItem ({ resume,refreshData }) {
  const axiosClient = useAxiosClient();
  const api = GlobalApi(axiosClient);

  const navigation = useNavigate();
  const [ openAlert, setOpenAlert ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const onDelete = () => {
    setLoading(true);

    api.deleteResume(resume.resumeId).then(resp => {
      console.log(resp);
      toast('Resume Deleted!');

      refreshData()
      setLoading(false);
      setOpenAlert(false);
    }, ()=>{
      setLoading(false);
    })
  }
  return (    
    <div className =''>
      <Link to={`/dashboard/resume/${resume.resumeId}/edit`}>
        <div 
          className ='p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 flex items-center justify-center h-[280px] border-t-4 rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary'
          style = {{ borderColor: resume?.themeColor }}
        >
          <div className ='flex items-center justify-center h-[180px] '>
            {/* <Notebook/> */}
            <img src ="/cv.png" width={80} height={80} alt="CV image" />
          </div>
        </div>
      </Link>
    <div 
      className ='border p-3 flex justify-between  text-white rounded-b-lg shadow-lg'
      style ={{ background:resume?.themeColor }}
    >
      <h2 className ='text-sm'>{resume.title}</h2>      
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className ='h-4 w-4 cursor-pointer'/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>        
          <DropdownMenuItem  onClick = {() => navigation(`/dashboard/resume/${resume.resumeId}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick = {() => navigation(`/individualresume/${resume.resumeId}/display`)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick = {() => navigation(`/individualresume/${resume.resumeId}/display`)}>
            Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick = {() => setOpenAlert(true)}>
            Delete
          </DropdownMenuItem>        
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>    
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this resume from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick ={ () => setOpenAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick ={ onDelete } disabled ={loading}>
              {loading? <Loader2Icon className='animate-spin'/>:'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
)};

export default ResumeCardItem;