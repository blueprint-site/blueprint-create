
import { useParams } from "react-router-dom";
import { Download, Share } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

import ModLoaderDisplay from "@/components/common/ModLoaderDisplay.tsx";
import VersionsDisplay from "@/components/common/VersionsDisplay.tsx";

import {useFetchSchematic} from "@/api/endpoints/useSchematics.tsx";
import {useIncrementDownloads} from "@/api/endpoints/useSchematics.tsx";
const SchematicDetails = () => {
    const { id } = useParams();
    console.log("id", id);
    const {data: schematicData} =  useFetchSchematic(id);
    console.log("schematicData", schematicData);
    const { mutate: incrementDownloads } = useIncrementDownloads();

    const openUrl = (url: string) => {
        window.open(url, '_');
    };

    if (!schematicData) {
        return <div className="flex items-center justify-center p-8 text-foreground-muted">Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-10">
            <Card className="bg-surface-1">
                <CardHeader className="text-center">
                    <div className="flex gap-4 items-center justify-end">
                        <Button variant="default" className="transition-all duration-300 hover:shadow-lg">
                            <Share className="mr-2" /> Share
                        </Button>
                        <Button
                            onClick={() => { openUrl(schematicData.schematic_url); incrementDownloads(schematicData.$id)}}
                            variant="success"
                            className="transition-all duration-300 hover:shadow-lg"
                        >
                            <Download className="mr-2" />
                            <span className="font-bold">Download</span>
                        </Button>
                    </div>
                    <CardTitle>
                        <h1 className="text-2xl md:text-3xl font-bold">{schematicData.title}</h1>
                    </CardTitle>
                    <CardDescription className="text-foreground-muted">
                        By {schematicData.authors}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="w-full md:w-1/2">
                            <img
                                src={schematicData.image_url}
                                alt={schematicData.title}
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            <h2 className="text-xl font-semibold">Description:</h2>
                            <p className="text-foreground-muted whitespace-pre-wrap">
                                {schematicData.description}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Categories</h3>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Create Versions</h3>
                                <VersionsDisplay versions={schematicData.create_versions} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Minecraft Versions</h3>
                                <VersionsDisplay versions={schematicData.game_versions} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Modloaders</h3>
                                <ModLoaderDisplay loaders={schematicData.modloaders} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div id="TOREMOVETHHEYSUCKS"  className="h-50"></div>
        </div>
    );
};

export default SchematicDetails;