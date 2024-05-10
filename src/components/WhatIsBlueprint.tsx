import "../styles/whatisblueprint.scss"
import AddonIcon from "../assets/minecart_coupling.webp"
import SchematicIcon from "../assets/schematic.webp"
import BlueprintLogo from "../assets/logo.webp"

function WhatIsBlueprint() {
    return (
        <div className="what-is-blueprint">
            <center>
            <h1>What is Blueprint?</h1>
            <h4>Blueprint is a Create Mod themed site!</h4>
            <img src={AddonIcon} alt="" />+<img src={SchematicIcon} alt="" />= <img src={BlueprintLogo} alt="" />
            </center>
        </div>
    );
}

export default WhatIsBlueprint;