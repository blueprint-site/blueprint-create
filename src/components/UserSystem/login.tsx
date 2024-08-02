import React, { useState } from 'react';
import axios from 'axios';
import "../../styles/login.scss";
import GoogleLogo from "../../assets/icons/google-mark-color.png";
import GithubLogo from "../../assets/icons/github-mark-white.png";
import DiscordLogo from "../../assets/icons/discord-mark-blue.png";

function Login() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://5.39.223.27:6555/api/users/login', {
                username,
                password
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            alert('Login successful!');

            window.location.href = '/protected';
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="logins">
            <div className="login-container">
                <h1 className="login-header">Let's log you in!</h1>
                {{error} && <p className="error-message">{error}</p>}
                <input type="username" onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="input-email"/>
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Your password 🤫" className="input-password"/>
                <button className="login-button" onClick={handleLogin}>Log In!</button>
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