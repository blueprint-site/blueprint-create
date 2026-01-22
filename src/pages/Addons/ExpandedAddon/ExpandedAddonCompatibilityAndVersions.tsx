import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpandedAddonCompatibilityAndVersionsProps {
  versions: string[];
}

export const ExpandedAddonCompatibilityAndVersions = ({ versions = [] }: ExpandedAddonCompatibilityAndVersionsProps) => {
    return (
        <div className="w-80 space-y-4 text-white">
            <Card>
                <CardHeader>
                    <CardTitle className="font-minecraft text-2xl">Versions</CardTitle>
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
        </div>
    )
}