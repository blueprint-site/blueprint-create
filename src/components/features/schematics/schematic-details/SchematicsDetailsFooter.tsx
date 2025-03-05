import {Card, CardFooter} from "@/components/ui/card.tsx";
import SocialSharing from "@/components/features/social-sharing/SocialSharing.tsx";

export interface SchematicsDetailsFooterProps {
  title: string;
}

export const SchematicsDetailsFooter = ({title = ''}: SchematicsDetailsFooterProps) => {
  return (
    <Card className={"mt-4 my-8"}>
      <CardFooter>
        <SocialSharing title={title}/>
      </CardFooter>
    </Card>
  );
};
