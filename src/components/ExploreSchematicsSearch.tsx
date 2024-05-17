import "../styles/exploreschematicssearch.scss";
import { Dropdown } from "react-bootstrap";

function ExploreSchematicsSearch() {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search..." className="search-input"/>
            <div className="dropdown-container">
                    <Dropdown>
                        <Dropdown.Toggle>
                            Type
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Train</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Farm</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Factory</Dropdown.Item>
                            <Dropdown.Item href="#/action-4">Building</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
        </div>
    );
}

export default ExploreSchematicsSearch;