import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpandedAddonCompatibilityAndVersionsProps {
  versions: string[];
  authors?: string[];
}

export const ExpandedAddonCompatibilityAndVersions = ({ versions = [], authors = [] }: ExpandedAddonCompatibilityAndVersionsProps) => {
    return (
        <div className="w-80 space-y-4 text-white">
            <Card>
                <CardHeader>
                    <CardTitle className="font-minecraft text-xl">Versions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {versions.map(version => <Badge variant="secondary" key={version}>{version}</Badge>)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-minecraft text-xl">Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">No compatibility information available.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-minecraft text-xl">Authors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {authors.map(author => (
                            <Badge variant="secondary" key={author}>{author}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}