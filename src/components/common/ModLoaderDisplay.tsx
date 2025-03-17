import DevinsBadges from '@/components/utility/DevinsBadges';
import neoforge from '@/assets/neoforge_46h.png';
const ModLoaderDisplay = ({ loaders = [] }: { loaders: string[] }) => {
  if (loaders.length === 0) {
    return <div>No mod loaders found!</div>;
  }

  const uniqueLoaders = [...new Set(loaders.map((loader) => loader.toLowerCase()))];

  return (
    <div className='flex flex-row gap-2'>
      {uniqueLoaders.map((loader) => {
        return loader === 'neoforge' ? (
          <div key={loader}>
            <img src={neoforge} alt={loader} className='h-8' />
          </div>
        ) : (
          <DevinsBadges
            key={loader}
            type='compact-minimal'
            category='supported'
            className={'h-8'}
            name={loader}
            format='svg'
            height={32}
          />
        );
      })}
    </div>
  );
};

export default ModLoaderDisplay;
