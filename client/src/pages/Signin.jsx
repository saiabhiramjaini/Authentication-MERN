import React, {useState} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import backendURL from '../config';

function Signin(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post(`${backendURL}/api/v1/auth/signin`, {email, password})
            
            if(response.data.msg == "Signin successful"){
                navigate('/dashboard')
            }
            else{
                alert(response.data.msg);
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

    return(
        <>
        <h1>Signin</h1>
        <label> Email </label>
        <br />
        <input type="email" onChange={(e)=>setEmail(e.target.value)}/>
        <br /><br />
        <label> Password </label>
        <br />
        <input type="password" onChange={(e)=>setPassword(e.target.value)}/>
        <br /><br />
        <button onClick={handleSubmit}>Signin</button>
        <br />
        <a href="/forgotPassword">forgot password?</a>
        <br />
        <a href="/signup">Don't have an account?</a>
        </>
    )
}

export default Signin;