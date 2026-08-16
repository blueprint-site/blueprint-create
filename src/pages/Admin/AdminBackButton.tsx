import { MoveLeft } from 'lucide-react';
export default function AdminBackButton() {
  return (
    <a href='/admin' className='flex mb-1 gap-2 opacity-40 underline'>
      <MoveLeft />
      Back to all admin pages
    </a>
  );
}
