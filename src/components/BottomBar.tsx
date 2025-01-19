import Logo from "../assets/logo.webp"
import "../styles/bottombar.scss"

function BottomBar() {
	
	return (
		<footer className="bottom-bar">
			<div className="bottom-bar-content">
				<img src={Logo} alt="" className="bottom-bar-logo" />
				<h4 className="bottom-bar-sitename">Blueprint Site</h4>
				<h6 className="bottom-bar-bug">Found a bug? Report it to <a href="https://github.com/blueprint-site/blueprint-site.github.io">GitHub issues</a>.</h6>
				<h6 className="bottom-bar-bug">NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.</h6>
				<h6 className="bottom-bar-bug">Not affiliated with Create Mod team or one of the addons in any way.</h6>
			</div>
		</footer>
	);
}

export default BottomBar;