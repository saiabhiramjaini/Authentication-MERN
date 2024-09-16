import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import backendURL from '../config';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [cPassword, setCpassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendURL}/api/v1/auth/reset-password/${token}`, { password, cPassword });
            alert(response.data.msg);
            if (response.data.msg === "Password updated successfully") {
                navigate('/signin');
            }
        } catch (e) {
            if (e.response && e.response.data) {
              // If the error comes from backend validation, display it
              alert(e.response.data.msg[0] || 'An error occurred');
            } else {
              // General error handling (if server is down or something else fails)
              alert('Something went wrong. Please try again later.');
            }
        }
    }

    return (
        <>
            <h1>ResetPassword</h1>
            <label> Password </label>
            <br />
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <br /><br />
            <label> Confirm Password </label>
            <br />
            <input type="password" onChange={(e) => setCpassword(e.target.value)} />
            <br /><br />
            <button onClick={handleSubmit}>ResetPassword</button>
        </>
    )
}

export default ResetPassword;