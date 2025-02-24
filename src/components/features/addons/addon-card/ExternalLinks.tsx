import DevinsBadges from '@/components/utility/DevinsBadges';

interface ExternalLinksProps {
  slug: string;
  curseforge_raw: object;
  modrinth_raw: object;
}

export const ExternalLinks = ({ slug, curseforge_raw, modrinth_raw }: ExternalLinksProps) => (
  <div className='flex flex-col justify-between gap-2 md:flex-row'>
    {curseforge_raw && (
      <a
        className='flex h-full w-full items-center justify-center md:w-1/2'
        target='_blank'
        rel='noopener noreferrer'
        href={`https://www.curseforge.com/minecraft/mc-mods/${slug}`}
      >
        <DevinsBadges type='compact' category='available' name='curseforge' format='svg' />
      </a>
    )}
    {modrinth_raw && (
      <a
        className='flex h-full w-full items-center justify-center md:w-1/2'
        target='_blank'
        rel='noopener noreferrer'
        href={`https://modrinth.com/mod/${slug}`}
      >
        <DevinsBadges type='compact' category='available' name='modrinth' format='svg' />
      </a>
    )}
  </div>
);
