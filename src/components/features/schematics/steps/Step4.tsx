interface Step4Props {
  uploadedImageUrl: string;
  title: string;
  description: string;
  gameVersions: string[];
  createVersions: string[];
  loaders: string[];
}

function Step4({
  uploadedImageUrl,
  title,
  description,
  gameVersions,
  createVersions,
  loaders,
}: Step4Props) {
  return (
    <>
      <h2 className='text-center'>Confirm and Upload</h2>
      <div className='flex items-center justify-center'>
        <img
          src={uploadedImageUrl}
          alt='Preview'
          className='mt-2 h-32 w-1/4 items-center object-cover'
        />
      </div>
      <p>
        <strong>Title:</strong> {title}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Game Versions:</strong> {gameVersions.join(', ')}
      </p>
      <p>
        <strong>Create Versions:</strong> {createVersions.join(', ')}
      </p>
      <p>
        <strong>Loaders:</strong> {loaders.join(', ')}
      </p>
    </>
  );
}

export default Step4;