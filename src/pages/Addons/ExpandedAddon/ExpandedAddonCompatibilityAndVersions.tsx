import { CardContent } from "@/components/ui/card";

interface ExpandedAddonCompatibilityAndVersionsProps {
  versions: string[];
}

export const ExpandedAddonCompatibilityAndVersions = ({ versions = [] }: ExpandedAddonCompatibilityAndVersionsProps) => {
    return (
        <CardContent className="py-6 flex w-80 text-black">
            <div className="flex-col">
                <h1 className="font-minecraft text-2xl">Versions:</h1>
                <div className="flex flex-wrap gap-2">
                    {Array.from(versions.keys()).map(version => <span className="bg-gray-300 rounded-2xl px-2 text-sm" key={version}>{versions[version]}</span>)}
                </div>
            </div>
        </CardContent>
    )
}