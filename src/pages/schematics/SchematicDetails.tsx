import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Share } from "lucide-react";
import supabase from "../../components/utility/Supabase";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ModLoaderDisplay from "@/components/common/ModLoaderDisplay";
import VersionsDisplay from "@/components/common/VersionsDisplay";
import ShematicCategoriesDisplay from "@/components/common/shematicCategoriesDisplay";

import { Schematic } from "@/types";

const SchematicDetails = () => {
    const { id } = useParams();
    const [schematicData, setSchematicData] = useState<Schematic>();

    const openUrl = (url: string) => {
        window.open(url, '_');
    };

    const getSchematicData = async (id: string) => {
        try {
            const { data, error } = await supabase.from('schematics')
              .select('*')
              .eq('id', id)
              .single();

            if (data) {
                return data as Schematic;
            }
            if (error) {
                console.log('Error fetching schematic data: ', error);
            }
            return null;
        } catch (error) {
            console.log('Error fetching schematic data: ', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSchematicData(id ?? '');
            if (data) {
                setSchematicData(data);
            }
        };
        fetchData();
    }, [id]);

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
                        onClick={() => openUrl(schematicData.schematic_url)}
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
                              <ShematicCategoriesDisplay categoriesList={schematicData.categories} />
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
      </div>
    );
};

export default SchematicDetails;