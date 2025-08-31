// Minimal loading overlay for admin navigation
export function MinimalLoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className='flex h-32 w-full items-center justify-center'>
      <div className='flex items-center gap-3'>
        <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
        <span className='text-sm text-muted-foreground'>{message}</span>
      </div>
    </div>
  );
}