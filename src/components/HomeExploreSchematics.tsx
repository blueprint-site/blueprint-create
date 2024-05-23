import { useTranslation } from 'react-i18next';
import "../styles/homeexploreschematics.scss";
import "../styles/exploreschematicsschematics.scss";
import WorldDestroyer from "../assets/schematic-images/world_destroyer.webp"
import IndustrialBuildings from "../assets/schematic-images/industrial_buildings.webp"
import InsideFactory from "../assets/schematic-images/inside_factory.webp"
import BulkProcessing from "../assets/schematic-images/bulk_processing.webp"
import Card from 'react-bootstrap/Card';

function HomeExploreSchematics() {
    const versions = ["1.16.5", "1.18.2", "1.19.2", "1.20.1"]
    return (
        <>
        <h1>Explore Schematics</h1>
            <div className="schematics">
                <Card className="schematic">
                    <Card.Img variant="top" src={WorldDestroyer} />
                <Card.Body>
                    <Card.Title>Schematic name</Card.Title>
                <Card.Text>
                    For Minecraft {versions[0]}<br/>
                Schematic Description
                </Card.Text>
                    <a className="download-button">Download</a>
                    <a className="ThreeD-button">3D View</a>
                </Card.Body>
                </Card>
                <Card className="schematic">
                    <Card.Img variant="top" src={IndustrialBuildings} />
                <Card.Body>
                    <Card.Title>Schematic name</Card.Title>
                <Card.Text>
                    For Minecraft {versions[1]}<br/>
                Schematic Description
                </Card.Text>
                    <a className="download-button">Download</a>
                    <a className="ThreeD-button">3D View</a>
                </Card.Body>
                </Card>
                <Card className="schematic">
                    <Card.Img variant="top" src={InsideFactory} />
                <Card.Body>
                    <Card.Title>Schematic name</Card.Title>
                <Card.Text>
                For Minecraft {versions[2]}<br/>
                Schematic Description
                </Card.Text>
                    <a className="download-button">Download</a>
                    <a className="ThreeD-button">3D View</a>
                </Card.Body>
                </Card>
                <Card className="schematic">
                    <Card.Img variant="top" src={BulkProcessing} />
                <Card.Body>
                    <Card.Title>Schematic name</Card.Title>
                <Card.Text>
                For Minecraft {versions[3]}<br/>
                Schematic Description
                </Card.Text>
                    <a className="download-button">Download</a>
                    <a className="ThreeD-button">3D View</a>
                </Card.Body>
                </Card>
            </div>
            <center>
            <a className='show-more' href="/schematics">Show More</a>
            </center>
        </>
    );
}

export default HomeExploreSchematics;