import { toast } from 'sonner';
import { Brain, LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAxiosClient } from '@/hooks/useAxiosClient';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import {
  BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList,
  BtnStrikeThrough, BtnUnderline, Editor, EditorProvider,
  Separator, Toolbar } from 'react-simple-wysiwyg';


function RichTextEditor({ onRichTextEditorChange, positionTitle, defaultValue }) {

  const [value, setValue] = useState(defaultValue ?? '' );

  const [loading, setLoading] = useState(false);
  const { aiUsage, setAiUsage } = useContext(ResumeInfoContext);

  const axiosClient = useAxiosClient();


  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);


  const handleEditorChange = (event) => {
    const nextValue = event.target.value;

    setValue(nextValue);

    onRichTextEditorChange({ target: { value: nextValue } });
  };


  const generateExperienceFromAI = async () => {
    if (!positionTitle?.trim()) {
      toast('Please Add Position Title');

      return;
    };
    setLoading(true);

    try {
      const response = await axiosClient.post(
        '/api/ai/experience',
        {
          positionTitle: positionTitle.trim(),
        }
      );

      setAiUsage(response.data.usage);

      const generatedText = response.data.data;

      setValue(generatedText);

      onRichTextEditorChange({
        target: { value: generatedText },
      });
    } catch (error) {
      console.error('GENERATE_EXPERIENCE_ERROR:', error);

      toast(error.response?.data?.message || 'Failed to generate experience content');   
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">
          Description
        </label>

        {aiUsage && (
          <span className="text-xs text-muted-foreground">
            {aiUsage.remaining} AI generations left
          </span>
        )}

        <Button
          variant="outline"  size="sm"
          onClick={generateExperienceFromAI}
          disabled={loading || aiUsage?.remaining === 0}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate from AI
            </>
          )}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          onChange={handleEditorChange}
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
}


export default RichTextEditor;