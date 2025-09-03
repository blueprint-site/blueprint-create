import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router';
import ThemeToggle from '@/components/utility/ThemeToggle.tsx';
import { SearchIcon, UploadCloud, User } from 'lucide-react';

export const ToolsBox = () => {
  return (
    <>
      <div className={'absolute top-3 right-3'}>
        <ThemeToggle></ThemeToggle>
      </div>
      <div className={'flex justify-center gap-2'}>
        <Link to='/schematics/upload'>
          <Button className='minecraft-btn'>
            <UploadCloud></UploadCloud> Upload schematics
          </Button>
        </Link>
        <Link to='/addons'>
          <Button className='minecraft-btn'>
            <SearchIcon></SearchIcon> Look for addons
          </Button>
        </Link>
        <Link to='/user'>
          <Button className='minecraft-btn'>
            <User /> My profile
          </Button>
        </Link>
      </div>
    </>
  );
};
