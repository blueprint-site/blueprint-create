import "../styles/exploreschematicssearch.scss";
import { Dropdown } from "react-bootstrap";

function ExploreSchematicsSearch() {
    return (
        <div className="everything">
            <input type="text" placeholder="Search..." className="search-input"/>
            <div className="dropdown-container">
                <Dropdown>
                    <Dropdown.Toggle>
                        Type
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/category-train">Train</Dropdown.Item>
                        <Dropdown.Item href="#/category-farm">Farm</Dropdown.Item>
                        <Dropdown.Item href="#/category-factory">Factory</Dropdown.Item>
                        <Dropdown.Item href="#/category-building">Building</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="dropdown-container">
                <Dropdown>
                    <Dropdown.Toggle>
                        Game Version
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/for-1.20.1">1.20.1</Dropdown.Item>
                        <Dropdown.Item href="#/for-1.19.2">1.19.2</Dropdown.Item>
                        <Dropdown.Item href="#/for-1.18.2">1.18.2</Dropdown.Item>
                        <Dropdown.Item href="#/for-1.16.5">1.16.5</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}

export default ExploreSchematicsSearch;
