import {Badge} from "@/components/ui/badge.tsx";
import ModLoaderDisplay from "@/components/common/ModLoaderDisplay.tsx";
import CategoryBadges from "@/components/features/addons/addon-card/CategoryBadges.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ExternalLinks} from "@/components/features/addons/addon-card/ExternalLinks.tsx";
import {CardContent} from "@/components/ui/card.tsx";
import {ReactNode, useEffect, useState} from "react";
import {CurseForgeAddon, ModrinthAddon} from "@/types";
import {Bug, Github, Globe} from "lucide-react";


export interface AddonDetailsParams {
    versions: string[];
    loaders: string[];
    categories: string[];
    slug: string;
    curseforge_raw?: CurseForgeAddon | null;
    modrinth_raw?: ModrinthAddon | null;
}
export const AddonDetailsContent = ({
                                        versions = [],
                                        loaders = [],
                                        categories = [],
                                        slug = '',
                                        curseforge_raw,
                                        modrinth_raw
}: AddonDetailsParams) => {
    const [availableOn, setAvailableOn] = useState<string[]>([]);
    const createLink = (icon: ReactNode, label: string, url?: string) => {
        return url ? { icon, label, url } : null;
    };
    const { sourceUrl, issuesUrl, websiteUrl } = curseforge_raw?.links || {};

    const externalLinks = [
        createLink(<Github className="h-4 w-4" />, "Source Code", sourceUrl || ''),
        createLink(<Bug className="h-4 w-4" />, "Issue Tracker", issuesUrl || ''),
        createLink(<Globe className="h-4 w-4" />, "Website", websiteUrl),
    ].filter((link): link is { icon: ReactNode; label: string; url: string } => link !== null);
    useEffect(() => {
        const platforms: string[] = [];

        if (curseforge_raw) {
            platforms.push('curseforge');
        }
        if (modrinth_raw) {
            platforms.push('modrinth');
        }

        setAvailableOn(platforms);
    }, [curseforge_raw, modrinth_raw]);

    console.log(availableOn)
    console.log(availableOn.includes('modrinth'));
    return (
        <CardContent className="space-y-6">
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-4'>
                    <div>
                        <h3 className='mb-2 text-sm font-semibold'>Versions</h3>
                        <div className='flex flex-wrap gap-2'>
                            {versions?.map((version) => (
                                <Badge key={version} variant='outline'>
                                    {version}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className='mb-2 text-sm font-semibold'>Mod Loaders</h3>
                        <ModLoaderDisplay loaders={loaders}/>
                    </div>

                    <div>
                        <h3 className='mb-2 text-sm font-semibold'>Categories</h3>
                        <CategoryBadges categories={categories} />
                    </div>
                </div>
                <div className='space-y-4'>
                    <div>
                        <h3 className='mb-2 text-sm font-semibold'>Links</h3>
                        <div className='grid grid-cols-1 gap-2'>
                            {externalLinks.map((link, index) => (
                                <Button key={index} variant='outline' className='w-full justify-start' asChild>
                                    <a href={link.url} target='_blank' rel='noopener noreferrer'>
                                        {link.icon}
                                        <span className='ml-2'>{link.label}</span>
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className='mb-2 text-sm font-semibold'>Available On</h3>
                        <ExternalLinks
                            slug={slug}
                            curseforge={availableOn.includes('curseforge')}
                            modrinth={availableOn.includes('modrinth')}
                        />
                    </div>
                </div>
            </div>
        </CardContent>
    )
}