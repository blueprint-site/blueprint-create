import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col min-h-full gap-7'>
      <div className='p-5 flex items-center bg-surface-2 text-white font-minecraft'>
        <div className=''>
          <h1 className='font-bold text-2xl'>Create Aeronautics released!</h1>
          <span>
            Check it's page at{' '}
            <a href='/addons/create-aeronautics' className='text-white underline'>
              Blueprint
            </a>
          </span>
        </div>

        <div className='ml-auto'>
          <img
            className='h-20'
            src='https://cdn.modrinth.com/data/oWaK0Q19/f66b5589924884ffd81acb27f3ccb775867a962e_96.webp'
          />
        </div>
      </div>
      <div className='flex justify-center flex-col align-center items-center'>
        <span className='font-bold font-minecraft text-3xl'>Welcome to Blueprint!</span>
        <span className='font-minecraft'>Check out these featured addons</span>
        <div className='mt-5 w-full max-w-300 overflow-hidden rounded-2xl bg-surface-1 text-white shadow-lg shadow-black/20'>
          <div className='flex flex-col lg:h-140 lg:flex-row'>
            <div className='relative min-h-64 lg:min-h-full lg:w-6/10'>
              <img
                src='https://cdn.modrinth.com/data/oWaK0Q19/images/b0f37794880f9da33cb27db1f8782ef40a6611df.png'
                className='h-full w-full object-cover'
                alt='Create: Aeronautics showcase'
              />
              <div className='absolute inset-0 bg-linear-to-t from-surface-1/60 via-transparent to-transparent lg:bg-none' />
            </div>
            <div className='flex flex-col gap-4 bg-linear-to-b from-surface-3 to-surface-1 p-5 font-minecraft lg:w-4/10 lg:p-6 lg:p-8'>
              <img
                className='h-20 w-20 lg:h-30 lg:w-30'
                src='https://cdn.modrinth.com/data/oWaK0Q19/f66b5589924884ffd81acb27f3ccb775867a962e_96.webp'
                alt='Create: Aeronautics'
              />
              <div className='flex flex-col gap-2 text-left'>
                <span className='text-2xl lg:text-3xl'>Create: Aeronautics</span>
                <span className='text-sm lg:text-base'>
                  Build anything from airships to planes and cars!
                </span>
              </div>
              <div className='mt-auto'>
                <a href='/addons/create-aeronautics' className='underline underline-offset-4'>
                  Open addon&#39;s page
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <button
            className='rounded-sm text-white hover:bg-accent transition-all font-minecraft p-4 bg-surface-2 mt-5 hover:cursor-pointer'
            onClick={() => navigate('/addons')}
          >
            Check out other addons too!
          </button>
        </div>
      </div>
      {/*<div className='flex items-baseline space-x-2 bg-surface-1 px-20 py-5'>
        <span className='text-3xl font-minecraft font-bold text-white'>Blueprint</span>
        <span className='text-2xl opacity-70 text-surface-4 font-minecraft'>vRe</span>
      </div>
      <div className=''>
        <button
          onClick={() => (window.location.href = '/addons')}
          className='bg-surface-1 text-white px-20 py-1 mt-3 font-minecraft hover:cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-300'
        >
          Go to addons! (click me!)
        </button>
      </div>
      <div className='p-4 bg-surface-1 mt-10 text-white'>
        <span>This is an in-progress release. More features are ported fast</span>
      </div>*/}
      {/* <div className='flex mt-10'>
        <div className='bg-surface-1 w-20 h-20'></div>
        <div className='bg-surface-2 w-20 h-20'></div>
        <div className='bg-surface-3 w-20 h-20'></div>
        <div className='bg-surface-4 w-20 h-20'></div>
        <div className='bg-surface-5 w-20 h-20'></div>
      </div>
      <br />
      <div className='bg-surface-1 font-minecraft px-10 py-3 text-white'>
        <h1 className="text-xl">This is a text</h1>
        <button className="bg-surface-2 p-2">this is a button</button>
      </div> */}
    </div>
  );
}
