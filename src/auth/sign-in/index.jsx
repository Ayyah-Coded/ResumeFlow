import { SignIn } from '@clerk/react';


function SignInPage() {
  return (
    <div className='flex justify-center my-25 item-center'>
      <SignIn fallbackRedirectUrl="/dashboard" />
    </div>
  )
}

export default SignInPage;