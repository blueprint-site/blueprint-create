import "../styles/aboutpagetitle.scss"

function AboutPageTitle() {
    return (
        <div className="about-page-title">
            <h1>How to contact Blueprint?</h1>
            <h4>Email us on <a href="mailto: blueprint-site@proton.me">blueprint-site@proton.me</a></h4>
            <h4>Or, if you want to report a bug (or write a suggestion), please <a href="https://github.com/blueprint-site/blueprint-site.github.io/issues/new">create an issue on Github</a></h4>
        </div>
    );
}

export default AboutPageTitle;