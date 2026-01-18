export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-black flex items-baseline space-x-2 bg-blueprint px-20 py-5'>
        <span className='text-3xl font-minecraft font-bold'>Blueprint</span>
        <span className='text-2xl opacity-70 text-accent font-minecraft'>vRe</span>
      </div>
      <div className=''>
        <button
          onClick={() => (window.location.href = '/addons')}
          className='bg-blueprint px-20 py-1 mt-3 text-black font-minecraft hover:cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-300'
        >
          Go to addons! (click me!)
        </button>
      </div>
      <div className="p-4 bg-blueprint mt-10 dark:text-black">
        <span>This is an in-progress release. More features will be added</span>
      </div>
    </div>
  );
}
