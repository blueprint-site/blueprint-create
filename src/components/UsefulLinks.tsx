import WikiLogo from "../assets/brass_ingot.webp"
import CreateLogo from "../assets/create_mod_logo.webp"

import '../styles/usefullinks.scss';

function UsefulLinks() {
    return (
        <div className="useful-links">
            <center>
                <h1>Here are some useful Create Mod links:</h1>
                <a href="https://create.fandom.com/wiki/Create_Mod_Wiki" target="_blank"><img src={WikiLogo} alt="" />Create Mod wiki</a>
                <br />
                <a href="https://modrinth.com/mod/create" target="_blank"><img src={CreateLogo} alt="" />Create Mod (Forge)</a>
                <br />
                <a href="https://modrinth.com/mod/create-fabric" target="_blank"><img src={CreateLogo} alt="createmodlogo" />Create Mod (Fabric)</a>
            </center>
        </div>
    );
}

export default UsefulLinks;