import React, { useEffect, useState } from 'react';
import "../../../styles/usersettings.scss";
import { Navigate, useNavigate } from 'react-router-dom';
import supabase from '../../../components/Supabase';

var client = supabase;

function UserPage() {
    const [userdata, setUserdata] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEmail, setShowEmail] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        getUserData()
    }, [])

    const handleEmailClick = () => {
        setShowEmail(!showEmail);
    };
    const getUserData = async () => {
        const { data: { user } } = await client.auth.getUser()
        setUserdata(user) // Store the user data in the state
    }

    const handleSignOut = async () => {
        try {
            const { error } = await client.auth.signOut()

            if (error) {
                console.error("Error signing out:", error);
                alert("There was an error signing out: " + error)
            }
            else {
                console.log("Successfully signed out");
                localStorage.setItem("isSignedIn", "false");
                navigate("/login", { replace: true });
            }
        }
        catch (error) {
            console.error("Unexpected error signing out:", error);
            setError("An unexpected error occurred");
            alert("Signing out unsuccesfull. Why? I dont know honestly, its unexpected")
        }
    }

    return (
        <div className='main-container'>
            <div className="top-container">
                <div className="top-container-textbox">
                    <span className='welcomeback'>Welcome Back</span>
                    <h1 className='name'>{userdata?.user_metadata?.full_name}</h1>
                </div>
                <img src={userdata?.user_metadata?.avatar_url} className='avatar'></img>
            </div>
            <br />
            <br />
            <div className="databox-1">
                <h3>Account info:</h3>
                <h5 className='data-row'>Your <b>currently used</b> username: {userdata?.user_metadata?.custom_claims?.global_name}</h5>
                <span className='data-row-diagnostic'>The username <b>above</b> is the username that <b>will be used on the site</b></span>
                <h5 className='data-row-diagnostic'>Username 2: {userdata?.user_metadata?.preferred_username}</h5>
                <h5 className='data-row'>Email: {showEmail ? userdata?.email : 'Hidden 🤫'}</h5>
                <button className='dangerous-button' onClick={handleEmailClick}>
                    {showEmail ? 'Hide Email' : 'Show Email'}
                </button>
                <h5 className='data-row'>Email verified: {userdata?.email_confirmed ? 'Yes' : 'No'}</h5>
                <h5 className='data-row'>Phone number: {userdata?.phone || 'Not provided'}</h5>
                <h5 className='data-row'>Created at: {new Date(userdata?.created_at).toLocaleString()}</h5>
                <h5 className='data-row-diagnostic'>Updated at: {new Date(userdata?.updated_at).toLocaleString()}</h5>
                <h5 className='data-row-diagnostic'>Last signed in at: {new Date(userdata?.last_sign_in_at).toLocaleString()}</h5>
                <h5 className='data-row-diagnostic'>Your role: {userdata?.role}</h5>
                <h5 className='data-row-dangerous'>User id: {userdata?.id}</h5>
                <span className='data-row-diagnostic'>Note: The lightly grayed out rows is data used for debugging, it isnt very important</span>
            </div>
            <br />
            <div className="databox-1">
                <h3>Registered data providers:</h3>
                <h5 className='data-row'>Now logged in with: {userdata?.app_metadata?.provider}</h5>
                <h5 className='data-row-diagnostic'>Linked to these accounts: {userdata?.app_metadata?.providers.join(', ')}</h5>
            </div>
            <br />
            <center>
                <button className='dangerous-button' onClick={handleSignOut}>Sign out</button>
            </center>

            <br />
        </div>
    )
}

export default UserPage;