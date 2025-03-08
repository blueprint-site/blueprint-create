import AdminStats from '.';

export const AddonStatsWrapper = () => {
  return (
    <div className='mt-4 flex flex-wrap gap-4'>
      <AdminStats.AddonStatsDisplayScanned />
      <AdminStats.AddonStatsDisplayValidated />
      <AdminStats.UsersStatsDisplayRegistered />
    </div>
  );
};
