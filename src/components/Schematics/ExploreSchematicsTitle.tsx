
import Experience_Block from "@/assets/block_of_experience.webp";
import '../styles/exploreschematicstitle.scss';

function ExploreSchematicsTitle() {
    return (
        <div className="exploreschematicstitle-container">
            <h1>Explore Schematics</h1>
            <a href="/schematics/3dviewer" className="a">Wanna see your schematic in 3D? <img src={Experience_Block} alt="" /></a>
        </div>
    )
};

export default ExploreSchematicsTitle;