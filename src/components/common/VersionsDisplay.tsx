const VersionsDisplay = ({ versions = [] }: { versions?: string[] }) => {
    if (versions.length === 0) {
        return <div>No mod loaders found!</div>;
    }

    return (
        <div className='flex flex-row gap-2'>
            {versions.map((version, i) => (
                <div key={i}>{version}</div>
            ))}
        </div>
    );
};

export default VersionsDisplay;
