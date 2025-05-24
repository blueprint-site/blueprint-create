import DevinsBadges from '@/components/utility/DevinsBadges';

interface ModPageLinksProps {
  slug: string;
  curseforge: boolean;
  modrinth: boolean;
}

const ModPageLinks = ({ slug, curseforge, modrinth }: ModPageLinksProps) => (
  <div className='flex flex-col justify-between gap-2 md:flex-row'>
    {curseforge && (
      <div className='flex h-full w-full items-center justify-center md:w-1/2'>
        <DevinsBadges
          type='compact'
          category='available'
          name='curseforge'
          format='svg'
          href={`https://www.curseforge.com/minecraft/mc-mods/${slug}`}
          ariaLabel={`Visit ${slug} on CurseForge`}
        />
      </div>
    )}
    {modrinth && (
      <div className='flex h-full w-full items-center justify-center md:w-1/2'>
        <DevinsBadges
          type='compact'
          category='available'
          name='modrinth'
          format='svg'
          href={`https://modrinth.com/mod/${slug}`}
          ariaLabel={`Visit ${slug} on Modrinth`}
        />
      </div>
    )}
  </div>
);

export default ModPageLinks;
