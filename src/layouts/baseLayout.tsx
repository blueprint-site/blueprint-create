import {Outlet} from "react-router-dom";
export default function BaseLayout() {
    return (
        <div className="bg-background">
            <nav className="flex">
                <h1>navigation</h1>
            </nav>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}