import Animation from '@/assets/schematicannon.webp';

const SchematicUploadLoadingOverlay = ({ message }: { message: string }) => {
    return ( 
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs">
                <div className="loader">
                    <img src={Animation} alt="Schematicannon shooting" className="max-w-[200px] h-full w-full m-auto"/>
                    <h1 className="text-4xl font-minecraft text-white/80">
                        {message ? message : 'Uploading Schematic...'}
                    </h1>
                </div>
            </div>
        </>
     );
}
 
export default SchematicUploadLoadingOverlay;
