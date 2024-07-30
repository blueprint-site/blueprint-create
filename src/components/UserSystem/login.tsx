import "../../styles/login.scss";
import GoogleLogo from "../../assets/icons/google-mark-color.png";
import GithubLogo from "../../assets/icons/github-mark-white.png";
import DiscordLogo from "../../assets/icons/discord-mark-blue.png";

function Login() {
    
    

    return (
        <div className="logins">
            <div className="login-container">
                <h1 className="login-header">Let's log you in!</h1>
                <input type="email" placeholder="Email or username ✉️" className="input-email"/>
                <input type="password" placeholder="Your password 🤫" className="input-password"/>
                <button className="login-button" onClick={() => alert("This needs to be done!")}>Log In!</button>
                <div className="signup"><h5>No account? <a href="/signup">Sign Up</a></h5></div>
            </div>
            
            <div className="oauth-container">
                <h1 className="oauth-header">Or log in with:</h1>
                <div className="oauth">
                    <a href="/loginwith/google"><img src={GoogleLogo} alt="" className="oauth-image"/>
                    <h4>Log In with Google</h4>
                    </a>
                </div>
                <div className="oauth">
                    <a href="/loginwith/github">
                    <img src={GithubLogo} alt="" className="oauth-image"/>
                    <h4>Log In with Github</h4>
                    </a>
                </div>
                <div className="oauth">
                    <a href="/loginwith/discord">
                    <img src={DiscordLogo} alt="" className="oauth-image"/>
                    <h4>Log In with Discord</h4>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Login;