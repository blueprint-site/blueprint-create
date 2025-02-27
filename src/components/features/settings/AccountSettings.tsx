import {Button} from '@/components/ui/button.tsx';
import {UserCog} from 'lucide-react';
import {functions} from "@/config/appwrite.ts";
import {useLoggedUser} from "@/api/context/loggedUser/loggedUserContext.tsx";
import {ExecutionMethod} from "appwrite";

export default function AccountSettings() {


  const user = useLoggedUser();

  const getUserData = () => {
    const userId = user.user?.$id;

    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    const body = JSON.stringify({ userId });
    console.log('Request body:', body);

    const promise = functions.createExecution(
        '67bf7b35002f188635ac',
        undefined,
        false,
        undefined,
        ExecutionMethod.GET,
        {"x-user-id":userId},
    );

    promise.then(
        (response) => {
          console.log('Success:', response);
        },
        (error) => {
          console.error('Error:', error);
        }
    );
  };
 console.log(getUserData())

  return (
    <div>
      <h2 className='text-2xl font-bold'>Account Settings</h2>

      {/* 2FA Section */}
      {/* <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <div className="text-lg font-semibold">Two-factor authentication</div>
        </div>
        <p className="text-sm text-foreground-muted">
          Add an additional layer of security to your account during login.
        </p>
        <div className="flex gap-4">
          <Button variant="outline">Setup 2FA</Button>
        </div>
      </section> */}

      {/* Providers Section */}

      <section className='space-y-4'>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>Data</div>
        </div>
        <p className='text-foreground-muted text-sm'>
          Because we are transparent with you , you can download all your data we have about you at anytime !
        </p>
        <p className='text-foreground-muted text-sm'>
          You can also delete all your data instantly *
        </p>
        <p className='text-gray-500 text-xs'>
          * The deleting process is launch instantly but that's can take up to 5 min to the front end reflect the actual change !
        </p>
        <p className='text-foreground-muted text-sm'>
          <b className="text-destructive" > WARNING ! When it's done there is no come back ! </b>
        </p>
        <div className='flex gap-4'>
          <Button variant='outline' disabled>
            Get my data
          </Button>
          <Button variant='destructive' disabled>
            Delete all my data
          </Button>
        </div>
      </section>
      <section className='space-y-4'>
        <div className='flex items-center gap-2'>
          <UserCog className='h-5 w-5' />
          <div className='text-lg font-semibold'>OAuth</div>
        </div>
        <p className='text-foreground-muted text-sm'>
          Add or remove sign-on methods from your account, including GitHub, GitLab, Microsoft,
          Discord, Steam, and Google.
        </p>
        <div className='flex gap-4'>
          <Button variant='outline' disabled>
            Coming Soon
          </Button>
        </div>
      </section>
    </div>
  );
}
