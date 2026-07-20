import { UserButton, useUser } from "@clerk/react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";


function Header() {

  const { isSignedIn } = useUser();
  return (
    <div className="p-3 px-5 flex justify-between shadow-md">
       <Link to={'/dashboard'}>
        <img src="/logo.svg" width={100} height={100} alt="Resume Flow" />
      </Link>
      
      {isSignedIn 
        ? <div className="flex gap-2 items-center">
            <Button asChild variant="outline">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <UserButton/>
          </div>        
        : <Link to={'/auth/sign-in'}>
            <Button>Get Started</Button>
          </Link>
      }   
    </div>
  )
}

export default Header;