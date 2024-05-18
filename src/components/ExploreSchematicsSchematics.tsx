import "../styles/exploreschematicsschematics.scss"
import WorldDestroyer from "../assets/schematic-images/world_destroyer.webp"

function ExploreSchematicsSchematics() {
    return (
        <div className="schematics">
            <div className="schematic">
                <h1>Title</h1>
                <img src={WorldDestroyer} alt="" />
                <h3>Description</h3>
                <div>
                    <button className="download-button">Download</button><button className="ThreeD-button">View in 3D</button>
                </div>
            </div>
        </div>
    )
}

export default ExploreSchematicsSchematics