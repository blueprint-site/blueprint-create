import {Card, CardHeader} from "@/components/ui/card.tsx";

export interface BlogDetailsHeaderProps {
  title: string;
}

export const BlogDetailsHeader = ({title = ""}: BlogDetailsHeaderProps) => {
  return (
    <Card className={"mt-4"}>
     <CardHeader className={"text-center"}>
       <h1>{title}</h1>
     </CardHeader>
    </Card>
  );
};
