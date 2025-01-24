import DiscordLogo from "@/assets/icons/discord-mark-blue.png";
import GithubLogo from "@/assets/icons/github-mark-white.png";
import GoogleLogo from "@/assets/icons/google-mark-color.png";
import "@/styles/login.scss";
import React from 'react';
import supabase from '../utility/Supabase';

var client = supabase;

function Login() {
    const [userEmail, setEmail] = React.useState('');
    const [userPassword, setPassword] = React.useState('');
    const [error, setError] = React.useState('');


    const handleGithubLogin = async () => {
        try {
            const { data, error } = await client.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: 'http://localhost:5173/user'
                }
            });
            if (error) {
                console.error('Error signing in with GitHub:', error);
                setError(error.message); // Assuming you have an setError function to update the error state
            } else {
                console.log('Signed in with GitHub:');
                localStorage.setItem("isSignedIn", "true");
                localStorage.setItem("userData", JSON.stringify(data));
                // You can also update the state with the user data here
            }
        } catch (error) {
            console.error('Unexpected error signing in with GitHub:', error);
            setError('An unexpected error occurred');
        }
    }
    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'http://localhost:5173/user'
                }
            });
            if (error) {
                console.error('Error signing in with Google:', error);
                setError(error.message); // Assuming you have an setError function to update the error state
            } else {
                console.log('Signed in with Google:');
                localStorage.setItem("isSignedIn", "true");
                localStorage.setItem("userData", JSON.stringify(data));
                // You can also update the state with the user data here
            }
        } catch (error) {
            console.error('Unexpected error signing in with Google:', error);
            setError('An unexpected error occurred');
        }
    }
    const handleDiscordLogin = async () => {
        try {
            const { data, error } = await client.auth.signInWithOAuth({
                provider: 'discord',
                options: {
                    redirectTo: 'http://localhost:5173/user'
                }
            });
            if (error) {
                console.error('Error signing in with Discord:', error);
                setError(error.message); // Assuming you have an setError function to update the error state
            } else {
                console.log('Signed in with Discord:');
                localStorage.setItem("isSignedIn", "true");
                localStorage.setItem("userData", JSON.stringify(data));
                // You can also update the state with the user data here
            }
        } catch (error) {
            console.error('Unexpected error signing in with Discord:', error);
            setError('An unexpected error occurred');
        }
    }

    return (
        <div className="logins">
            {/* <div className="login-container">
                <h1 className="login-header">Let's log you in!</h1>
                {{ error } && <p className="error-message">{error}</p>}
                <input type="username" onChange={(e) => setEmail(e.target.value)} placeholder="Username" className="input-email" />
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Your password 🤫" className="input-password" />
                <button className="login-button" onClick={handlePasswordLogin}>Log In!</button>
                <div className="signup"><h5>No account? <a href="/register">Register</a></h5></div>
            </div> */}

            <div className="oauth-container">
                <h1 className="oauth-header">Login using:</h1>
                {/* GOOGLE OAUTH*/}
                <button onClick={handleGoogleLogin} className='oauth'>
                    <img src={GoogleLogo} alt="" className="oauth-image" />
                    <h4>Google</h4>
                </button>
                {/* GITHUB OAUTH*/}
                <button onClick={handleGithubLogin} className='oauth'>
                    <img src={GithubLogo} alt="" className="oauth-image" />
                    <h4>Github</h4>
                </button>
                {/* DISCORD OAUTH*/}
                <button onClick={handleDiscordLogin} className='oauth'>
                    <img src={DiscordLogo} alt="" className="oauth-image" />
                    <h4>Discord</h4>
                </button>
            <h6 className='verysmoltext'>Account will be created automatically</h6>
            <h6 className='verysmoltext'>Why no password email option? <a href="">Read here</a></h6>
            </div>
        </div>
    )
}

export default Login;