export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='flex items-baseline space-x-2 bg-surface-1 px-20 py-5'>
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
      </div>
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
