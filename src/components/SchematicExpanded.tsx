import "@/styles/schematicexpanded.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "./utility/Supabase"; // Your Supabase client instance

const SchematicExpanded = () => {
    const { id } = useParams();
    const [schematicData, setSchematicData] = useState<any[] | null>(null);

    const getSchematicData = async (id: string) => {
        // Code to fetch schematic data from database or API
        const data = await supabase.from('schematics').select('*').eq('id', id);
        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSchematicData(id ?? '');
            setSchematicData(data.data); // Extract the actual data from the response
        };
        fetchData();
    }, [id]);

    if (!schematicData) {
        return <div>Loading...</div>;
    }
    console.log(schematicData);
    return (
        <div className="container">
            <div className="top-part">
                <span className="debug-text">Schematic id: {id}</span>
                <h1><b>{schematicData[0].title}</b></h1>
                <div className="button-div">
                    <a href={schematicData[0].schematic_url} download="beep.nbt" className="download-schematic">Download Schematic</a>
                    <a href="#" className="view-schematic">3D View</a>
                </div>
            </div>
            <div className="cover">
                <img src={schematicData[0].image_url} alt="schematic image" className="cover" />
            </div>
            <div className="main-body">
                <span className="debug-text">Description:</span>
                <h5 className="expanded-schematic-description">{schematicData[0].description}</h5>
                <h6>Available for Minecraft version: {schematicData[0].game_versions ? schematicData[0].game_versions : 'unknown'}</h6>
                <h6>Compatible with Create: {schematicData[0].create_versions ? schematicData[0].create_versions : 'unknown'}</h6>
                <h6>Made for Create on: {schematicData[0].modloader ? schematicData[0].modloader : 'unknown'}</h6>
                <h6>Created by: {schematicData[0].author}</h6>
                <br />
                <span>Uploaded on: {new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(schematicData[0].created_at))}</span>
            </div>
        </div>
    );
};
export default SchematicExpanded;