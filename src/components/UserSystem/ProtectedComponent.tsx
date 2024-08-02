import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProtectedComponent() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setError('No token found. Please log in.');
            setLoading(false);
            return;
        }

        axios.get('http://5.39.223.27:6555/api/protected', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(error => {
            setError('Failed to fetch protected data.');
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Protected Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default ProtectedComponent;
