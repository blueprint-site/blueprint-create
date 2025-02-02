import "@/styles/schematicexpanded.scss";
import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "./utility/Supabase";
import {Schematic} from "@/types";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Download, Share} from "lucide-react";
import ModLoaderDisplay from "@/components/common/ModLoaderDisplay.tsx";
import VersionsDisplay from "@/components/common/VersionsDisplay.tsx";
import ShematicCategoriesDisplay from "@/components/common/shematicCategoriesDisplay.tsx";

const SchematicExpanded = () => {
    const { id } = useParams();
    // GONNA NEED A TYPE
    const [schematicData, setSchematicData] = useState<Schematic>();
    const openUrl = (url: string) => {
        window.open(url, '_');
    }
    const getSchematicData = async (id: string) => {
        try{
            // Code to fetch schematic data from database or API
            const {data, error} = await supabase.from('schematics')
                .select('*')
                .eq('id', id)
                .single();
            // timiliris => When you want to retrieve a single entry like there you can use .single()
            if(data){
                return data as Schematic;
            }
            if(error){
                console.log('Error fetching schematic data: ', error);
            }
            return null;
        }catch (error){
            console.log('Error fetching schematic data: ', error);
            return null;

        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSchematicData(id ?? '');
            if(data){
                setSchematicData(data)// Extract the actual data from the response
            }
        };
        fetchData().then();
    }, [id]);

    if (!schematicData) {
        return <div>Loading...</div>;
    }
    console.log(schematicData);
    return (
        <>
            <div className="px-20 mt-10">
                <Card >
                    <CardHeader className={"text-center"}>
                        <div className=" flex gap-4 items-center justify-end">
                            <div>
                                <Button variant={"default"}><Share/> Share </Button>
                            </div>
                            <div>
                                <Button onClick={() => openUrl(schematicData.schematic_url)} variant={"success"}><Download/> <b> Download </b> </Button>
                            </div>


                        </div>
                        <CardTitle><h1> {schematicData.title} </h1></CardTitle>
                        <CardDescription>By {schematicData.authors}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div>
                                <img src={schematicData.image_url} alt={schematicData.title}/>
                            </div>
                            <div className="px-20">
                                <h2>Description:</h2>
                                {schematicData.description}
                            </div>
                        </div>
                        <div className="flex-col items-center gap-4">
                            <div className={'mt-2'}>
                                <h3>
                                    Categories
                                </h3>
                                 <ShematicCategoriesDisplay categoriesList={schematicData.categories}/>
                            </div>
                            <div className={'mt-2'}>
                                <h3>
                                    Create Versions
                                </h3>
                                    <VersionsDisplay versions={schematicData.create_versions}/>
                            </div>

                            <div className={'mt-2'}>
                                <h3>
                                    Minecraft Versions
                                </h3>
                                    <VersionsDisplay versions={schematicData.game_versions}/>
                            </div>
                            <div className={'mt-2'}>
                                <h3>
                                    Modloaders
                                </h3>
                                 <ModLoaderDisplay loaders={schematicData.modloaders}/>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>

        </>

    );
};
export default SchematicExpanded;