import { useContext, useState } from 'react'
import { AIChatSession } from '@/services/AIModel';

import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Button } from '@/components/ui/button';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnUnderline, Editor, EditorProvider, Separator, Toolbar } from 'react-simple-wysiwyg'

import { EXPERIENCE_PROMPT } from "@/prompts/experience.prompt";


function RichTextEditor ({ onRichTextEditorChange, index, defaultValue }) {
    const [ value, setValue ] = useState(defaultValue);
    const [ loading, setLoading ] = useState(false);

    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
    
    const GenerateSummaryFromAI = async () => {     
      if(!resumeInfo?.Experience[index]?.title) {
        toast('Please Add Position Title');
        return ;
      }
      setLoading(true);

      const prompt = EXPERIENCE_PROMPT.replace('{positionTitle}', resumeInfo.Experience[index].title);
      
      try {
        const result = await AIChatSession.sendMessage(prompt);
        const generatedText = result.response.text();
        setValue(generatedText);
        onRichTextEditorChange({ target: { value: generatedText } });
      } catch (error) {
        toast('Failed to generate summary. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  return (
    <div>
      <div className ='flex justify-between my-2'>
        <label className ='text-xs'>Summary</label>
        <Button variant ="outline" size ="sm" onClick = { GenerateSummaryFromAI }
          disabled = {loading} className ="flex gap-2 border-primary text-primary"
        >
          {loading 
            ? <LoaderCircle className ='animate-spin'/>
            : <>
                <Brain className='h-4 w-4'/> Generate from AI 
              </>
          }
        </Button>
      </div>
      <EditorProvider>
        <Editor value = {value} onChange ={(e) => { setValue(e.target.value);
          onRichTextEditorChange(e) }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;