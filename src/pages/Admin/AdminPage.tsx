export default function AdminPage() {
  return (
    <div className='p-4'>
      <h1 className='font-minecraft text-3xl font-bold'>Admin page</h1>
      <div className='mt-2 flex gap-5'>
        <a
          href='/admin/review'
          className='p-10 bg-surface-2 hover:cursor-pointer font-minecraft rounded'
        >
          Review addons
        </a>
        <a
          href='/admin/featured'
          className='p-10 bg-surface-2 hover:cursor-pointer font-minecraft rounded'
        >
          Change featured addons
        </a>
      </div>
    </div>
  );
}
