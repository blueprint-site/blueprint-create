import Logo from "../assets/logo.webp"
import "../styles/bottombar.scss"

function BottomBar() {
    return (
        <div className="bottom-bar">
		<img src={Logo} alt="" className="bottom-bar-logo" />
		<h4 className="bottom-bar-sitename">Blueprint Site</h4>
		<h6 className="bottom-bar-bug">Found a bug? Report it to blueprint-site@proton.me</h6>
		<h6 className="bottom-bar-bug">NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR
			MICROSOFT</h6>
		<h6 className="bottom-bar-bug">Not affiliated with Create Mod team in any way</h6>
		<h6 className="bottom-bar-bug">Made with ❤️ by @yehorscode, @thereal_flo_, @javaboiii and @leocaprilee</h6>
        <h6 className="bottom-bar-bug">With help of: @MythicHH and @JXSnack</h6>
	    </div>
    );
}

export default BottomBar;