import React, {useState} from 'react';
import axios from 'axios'
import backendURL from '../config';

function ForgotPassword(){
    const [email, setEmail] = useState("");

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post(`${backendURL}/api/v1/auth/forgot-password`, {email})
            alert(response.data.msg);
        }catch (e) {
            if (e.response && e.response.data) {
              // If the error comes from backend validation, display it
              alert(e.response.data.msg[0] || 'An error occurred');
            } else {
              // General error handling (if server is down or something else fails)
              alert('Something went wrong. Please try again later.');
            }
        }   
    }

    return(
        <>
        <h1>ForgotPassword</h1>
        <label> Email </label>
        <br />
        <input type="email" onChange={(e)=>setEmail(e.target.value)}/>
        <br /><br />
        <button onClick={handleSubmit}>ForgotPassword</button>
        <br />
        </>
    )
}

export default ForgotPassword;