import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import GlobalApi from '@/services/GlobalApi';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";

import { toast } from 'sonner';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';


function ThemeColor() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF"
  ];

  const { resumeInfo, setResumeInfo } =
    useContext(ResumeInfoContext);

  const { resumeId } = useParams();

  const selectedColor = resumeInfo?.themeColor;

  const onColorSelect = (color) => {
    setResumeInfo({
      ...resumeInfo,
      themeColor: color,
    });

    const data = {
      data: {
        themeColor: color,
      },
    };

    GlobalApi.UpdateResumeDetail(resumeId, data).then(
      () => toast('Theme Color Updated'),
      () => toast('Failed to update theme color')
    );
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2"
          />
        }
      >
        <LayoutGrid />
        Theme
      </PopoverTrigger>

      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">
          Select Theme Color
        </h2>

        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 cursor-pointer rounded-full border hover:border-black ${
                selectedColor === item
                  ? 'border-black'
                  : ''
              }`}
              style={{ background: item }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;