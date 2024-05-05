import { Link } from "react-router-dom";

function NoPage() {
    return (
        <>
            <div className="404-box">
                <center>
                    <h1>Whoops! This page is unavaible or it doesn't exist!</h1>
                    <h1>Check the url for errors or contact: </h1>
                    <h1 className="email">blueprint-site@proton.me</h1>
                    <Link to="/index" className="button">To homepage</Link>
                </center>
            </div>
        </>
    )
}

export default NoPage;