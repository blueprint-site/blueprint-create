import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import TimerProgress from "@/components/utility/TimerProgress.tsx";
import {Download, Hourglass, Share} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {useLoggedUser} from "@/api/context/loggedUser/loggedUserContext.tsx";
import {Schematic} from "@/types";
import {useIncrementDownloads} from "@/api/endpoints/useSchematics.tsx";

export interface SchematicsDetailsHeaderProps {
  schematic : Schematic
}

export const SchematicsDetailsHeader = ({schematic}: SchematicsDetailsHeaderProps) => {
  const [createdAtTimestamp, setCreatedAtTimestamp] = useState<number | null>(null);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const { mutate: incrementDownloads } = useIncrementDownloads();
  const LoggedUser = useLoggedUser();
  const userID = LoggedUser.user ? LoggedUser.user.$id : '';
  const isUploadedByUser = userID === schematic?.user_id;
  const currentSchematicTimestamp = schematic?.$createdAt;

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };
  useEffect(() => {
    if (currentSchematicTimestamp) {
      const timestamp = new Date(currentSchematicTimestamp).getTime();
      setCreatedAtTimestamp(timestamp);

      const expirationTime = timestamp + 60000;
      if (Date.now() > expirationTime && isUploadedByUser) {
        setIsTimerComplete(true);
      }
    }
  }, [currentSchematicTimestamp, isUploadedByUser]);
  return (
    <Card className={"mt-8"}>
      <CardHeader className='text-center'>
        <div className='flex w-full justify-between'>
          <div className='flex items-center justify-start gap-4'>
            {isUploadedByUser && (
                <>
                  {createdAtTimestamp && !isTimerComplete ? (
                      <TimerProgress
                          startTimestamp={createdAtTimestamp}
                          countdownTime={60}
                          description='Processing your upload... Your schematic will be visible to everyone in about a minute'
                          icon={<Hourglass />}
                          onComplete={() => setIsTimerComplete(true)}
                      />
                  ) : (
                      <div className='flex items-center gap-3'>
                      <span className='text-success text-sm font-semibold'>
                        Your schematic is now public!
                      </span>
                      </div>
                  )}
                </>
            )}
          </div>
          <div className='flex items-center justify-end gap-4'>
            <Button variant='default' className='transition-all duration-300 hover:shadow-lg'>
              <Share className='mr-2' /> Share
            </Button>
            <Button
                onClick={() => {
                  openUrl(schematic.schematic_url);
                  incrementDownloads(schematic.$id);
                }}
                variant='success'
                className='transition-all duration-300 hover:shadow-lg'>
              <Download className='mr-2' />
              <span className='font-bold'>Download</span>
            </Button>
          </div>
        </div>

        <CardTitle>
          <h1 className='text-2xl font-bold md:text-3xl'>{schematic.title}</h1>
        </CardTitle>
        <CardDescription className='text-foreground-muted'>
          By {schematic.authors.join(', ')}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
