import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'

import ThemeColor from './ThemeColor';

import PersonalDetail from './forms/PersonalDetail'
import Summary from './forms/Summary';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';

function FormSection() {
  const [ activeFormIndex, setActiveFormIndex ] = useState(1);
  const [ enableNext, setEnableNext ] = useState(true);
  const { resumeId} = useParams();

  return (
    <div>
        <div className='flex justify-between items-center'>
          <div className='flex gap-5'>
            <Link to={"/dashboard"}>
              <Button>
                <Home/>
              </Button>
            </Link>
            <ThemeColor/>         
          </div>

          <div className='flex gap-2'>
            { activeFormIndex > 1 && <Button size="sm"  onClick={ () => setActiveFormIndex(activeFormIndex - 1) }><ArrowLeft/></Button>}
              <Button disabled = { !enableNext } className="flex gap-2" size="sm" onClick={()=>setActiveFormIndex(activeFormIndex + 1)}>
                Next 
                <ArrowRight/>
              </Button>
          </div>
        </div>
          {activeFormIndex == 1
            ? <PersonalDetail enabledNext = {(v) => setEnableNext(v)} />
            : activeFormIndex == 2
              ? <Summary  enabledNext = {(v) => setEnableNext(v)} />
              : activeFormIndex == 3
                ? <Experience enabledNext = {(v) => setEnableNext(v)} />  
                : activeFormIndex == 4
                  ? <Education enabledNext = {(v) => setEnableNext(v)} />
                  : activeFormIndex == 5
                    ? <Skills enabledNext = {(v) => setEnableNext(v)} />
                    : activeFormIndex == 6
                      ? <Navigate to={`/individualresume/${resumeId}/display`}/>
                      : null
          }
    </div>
  );
};

export default FormSection;