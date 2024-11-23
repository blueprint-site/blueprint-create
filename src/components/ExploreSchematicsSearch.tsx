import "../styles/exploreschematicssearch.scss";
import { Dropdown } from "react-bootstrap";
import SchematicPNG from "../assets/schematic.png";
import Badge from 'react-bootstrap/Badge';

function ExploreSchematicsSearch() {
    return (
        <div className="everything">
            <div className="button-div"><a href="/schematics/upload" className="upload-button">Upload a Schematic (<u>alpha</u>)</a></div>
        </div>
    );
}

export default ExploreSchematicsSearch;
