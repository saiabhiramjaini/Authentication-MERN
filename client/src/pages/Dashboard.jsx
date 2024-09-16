import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backendURL from '../config';

function DashBoard() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(""); // Define error state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/v1/auth/profile`);
                setEmail(response.data.email);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                // Set error message when fetching data fails
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized access or token expired. Please login again.');
                } else {
                    setError('Error fetching profile data. Please try again later.');
                }
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${backendURL}/api/v1/auth/logout`);
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <h1>Welcome to Dashboard</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p> // Render error message if there is one
            ) : (
                <>
                    {/* Render profile data here */}
                    <p>Email: {email}</p>
                    <p>Username: {username}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </>
    );
}

export default DashBoard;
