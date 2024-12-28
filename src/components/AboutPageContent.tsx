import Contributors from "./Contributors";
import "../styles/aboutpagecontent.scss"
import NoiseImage from "../assets/backgrounds/noise.png";

const AboutPageContent = () => {
    return (
        <div className="box">
            <div className="header-box">
                <h1 className="header">About Blueprint</h1>
                <h6 className="description-title">Probably the best thing that has ever existed since crackers</h6>
            </div>
            <div className="body">
                <h2 className="paragraph-section">What are we doing?</h2>
                <p>We want to create a Create Mod focused website with plenty of nice and useful features. One of those is <a href="/addons">Addons Page</a> where you can discover new addons <br />
                Now we are working on a Schematics page (alternative to <a href="https://createmod.com">createmod.com</a>) where you will be able to discover and upload your own schematics.
                </p>
                <h2 className="paragraph-section">How to contact us?</h2>
                <p>
                    You can of course join our discord (preffered): <a href="https://discord.gg/ZF7bwgatrT">https://discord.gg/ZF7bwgatrT</a> <br />
                    Or email us at: <a href="mailto:blueprint-site@proton.me">blueprint-site@proton.me</a>
                </p>
            </div>
            <br />
            <div className="body">
                <h2 className="paragraph-section">
                    GitHub
                </h2>
                <p>
                    Our github Link: <a href="https://github.com/blueprint-site">https://github.com/blueprint-site</a>. <br />
                    <b>Instructions</b> for <b>running locally</b> are included in the <b>Readme.md</b> file on <b>"react-refactor" branch</b>.
                </p>
            </div>
            <br />
            <div className="body">
                <h2 className="paragraph-section">
                    Discord
                </h2>
                <p>
                    Our Discord: <a href="https://discord.gg/ZF7bwgatrT">https://discord.gg/ZF7bwgatrT</a>. <br />
                    Here we post updates, sneak peeks, and you can report issues.
                </p>
            </div>
            <br />
        </div>
    );
}

export default AboutPageContent;