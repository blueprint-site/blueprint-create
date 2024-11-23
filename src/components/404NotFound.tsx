import "../styles/404notfound.scss";

function Error404Page() {
    return (
        <div className="notfound-container">
            <h1>404</h1>
            <h3>Oops! Looks like the page is not found!</h3>
            <h4>We could not find this page</h4>  
            <h4>If you believe this is a bug email us at <a href="mailto:blueprint-site@proton.me">blueprint-site@proton.me</a></h4>
        </div>
    );
}

export default Error404Page;