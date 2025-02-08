import DevinsBadges from "@/components/utility/DevinsBadges";


const ModLoaderDisplay = ({ loaders = [] }: { loaders: string[] }) => {
    if (loaders.length === 0) {
        return <div>No mod loaders found!</div>;
    }

    return (
        <div className='flex flex-row gap-2'>
            {loaders.map((loader, i) => (
                <DevinsBadges
                    key={i}
                    type="compact-minimal"
                    category="supported"
                    name={loader}
                    format="svg"
                    height={32}
                />
            ))}
        </div>
    );
};

export default ModLoaderDisplay;
