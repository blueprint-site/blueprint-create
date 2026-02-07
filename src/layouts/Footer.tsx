import Logo from '@/assets/logo_compressed.webp';
export default function Footer() {
  const commitSha = "7a2a3bbd718c2c65b66263d70ccb945178c84ff6";
  const repositoryUrl = 'https://github.com/blueprint-site/blueprint-create';
  return (
    <div className='px-4 h-12 bg-header shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(255,255,255,0.1),0_-2px_4px_-2px_rgba(255,255,255,0.1)]'>
      <div className='flex items-center py-4'>
        <img src={Logo} alt='' className='h-10 w-10 mr-2' />
        <div className='flex flex-col'>
          <p className='font-minecraft text-sm'>Blueprint</p>
          <p className='opacity-50 text-xs'>A site with Create Mod addons</p>
        </div>
        <div className='ml-auto flex mr-20 gap-2 font-minecraft opacity-80'>
          <a
            href={repositoryUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:cursor-pointer'
          >
            Github
          </a>
          <a
            href={`${repositoryUrl}/commit/${commitSha}`}
            target='_blank'
            rel='noopener noreferrer' className='underline hover:cursor-pointer'
          >
            Build: {commitSha.substring(0, 7)}
          </a>
        </div>
      </div>
    </div>
  );
}
