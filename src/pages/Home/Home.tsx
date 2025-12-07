export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-center dark'>
        <h1 className='text-blueprint font-bold font-minecraft text-2xl'>
          For now the home is empty... But the addons arent!
        </h1>
        <button
          onClick={() => (window.location.href = '/addons')}
          className='bg-blueprint px-20 py-1 mt-3 text-black font-minecraft'
        >
          Go to addons!
        </button>
      </div>
    </div>
  );
}
