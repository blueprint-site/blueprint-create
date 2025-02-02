import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import supabase from "@/components/utility/Supabase";

import {LoadingSpinner} from "@/components/LoadingOverlays/LoadingSpinner";
import "@/styles/schematicslist.scss";
import {buttonVariants} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Download, Search, Upload, View} from "lucide-react";
import {Schematic} from "@/types";
import {Badge} from "@/components/ui/badge.tsx";
import ModLoaderDisplay from "@/components/common/ModLoaderDisplay.tsx";

function SchematicsList() {
  const [schematics, setSchematics] = useState<Schematic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  // Fetch schematics from Supabase
  const fetchSchematics = async (query?: string) => {
    setLoading(true);
    setError(null);
    let data: any;

    if (query) {
      data = await supabase
          .from("schematics")
          .select("*")
          .or(`title.ilike.%${query}%, description.ilike.%${query}%, authors.ilike.%${query}%`);
    } else {
      data = await supabase
          .from("schematics")
          .select("*")
          .order("created_at", { ascending: false });
    }

    if (data.error) {
      setError("Failed to fetch schematics.");
      console.error("Error fetching schematics:", data.error);
    } else {
      setSchematics(data.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSchematics();
  }, []);
  const versionFormating = (version: string[]) => {
    return version.map((version, i) => {
      return (
            <Badge key={i} variant={"mcVersion"}>
              {version}
            </Badge>


      );
  })
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center gap-4 p-4">
          <LoadingSpinner size="lg" />
          <p className="text-foreground-muted">Loading schematics for you...</p>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">Oops! There was an error: {error}</div>;
  }

  return (
      <>
        <div className=" mx-auto px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Explore Schematics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row md:flex-row gap-4 mx-16 mt-4 items-center">
              <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder=" Search schematics..."
                  startIcon={Search}
                  className="w-1/3 md:w-1/2"
              />
              <div className={'w-full'}>
                <h1 className="text-2xl font-bold w-full"></h1>
              </div>
              <div>

                <Link className={buttonVariants({variant: "default"})} to={"../schematics/upload"}>
                  <Upload/> Upload Schematic
                </Link>
              </div>
              <div>
                <Link className={buttonVariants({variant: "link"})} to={"../schematics/3dviewer"}>
                  <View/> View in 3D
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>




        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-16 mt-8">
          {schematics.length === 0 ? (
              <h3 className="text-center col-span-full text-lg font-semibold">No schematics uploaded yet. Be the
                first!</h3>
          ) : (
              schematics.map((schematic, i) => (
                  <Card
                      key={i}
                      className="flex flex-col h-full bg rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`../schematics/${schematic.id}`)}
                  >

                    <div className="h-40 overflow-hidden">
                      <img className="w-full h-full object-cover rounded-t-md" alt={schematic.title} src={schematic.image_url} />
                    </div>


                    <CardHeader className="flex-grow">
                      <CardTitle>{schematic.title}</CardTitle>
                      <CardDescription>{schematic.description.slice(0, 150)}...</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div>Modloader: <ModLoaderDisplay loaders={schematic.modloaders}/></div>
                      <div>
                        Made for Minecraft:
                       <div className=" flex flex-grow gap-2"> {versionFormating(schematic.game_versions)} </div>
                      </div>
                    </CardContent>


                    <CardFooter className="mt-auto">
                      <Link className={buttonVariants({ variant: "default", className: "w-full text-center" })} to={schematic.schematic_url} onClick={(e) => e.stopPropagation()}>
                        <Download /> Download
                      </Link>
                    </CardFooter>
                  </Card>
              ))
          )}
        </div>
      </>
  );
}

export default SchematicsList;
