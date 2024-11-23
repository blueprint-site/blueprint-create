import "../../styles/register.scss";
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');
    
    const handleRegister = async () => {
        try {
            const response = await axios.post('https://blueprintapi.timiliris.be/api/users', {
                username,
                email,
                password
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            alert('Registration successful!');
        } catch (error) {
            setError('Registration failed. I dont know why.');
        }
    };
    return (
        <>
            <div className="logins">
                <div className="login-container">
                    <h1 className="login-header">Let's create an account!</h1>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="input-email"/>
                    <input type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} className="input-email"/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="input-password"/>
                    <button className="login-button" onClick={handleRegister}>Sign Up!</button>
                    <div className="signup"><h5>Already have an account? <a href="/login">Log In</a></h5></div>
                </div>
            </div>
        </>
    )
}    


export default Register;