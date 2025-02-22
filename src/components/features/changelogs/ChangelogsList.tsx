import {changelogs} from "@/config/changelogs.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import MarkdownDisplay from "@/components/utility/MarkdownDisplay.tsx";


export const changelogsList = () => {

    return(
        <div className="h-full m-4">
            {changelogs.map((changelog, index) => (
                <div key={index} className="flex">
                    <Card className={"mt-4  w-full"}>
                        <CardHeader>
                            <CardTitle>{changelog.title}</CardTitle>
                            <CardDescription>V {changelog.version}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MarkdownDisplay content={changelog.content}/>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )

}

export default changelogsList