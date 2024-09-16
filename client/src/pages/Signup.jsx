import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backendURL from '../config';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCpassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/api/v1/auth/signup`, {
        username,
        email,
        password,
        cPassword,
      });

      if (response.data.msg === 'User created Successfully') {
        navigate('/signin'); // Redirect to signin page on success
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
  };

  return (
    <>
      <h1>Signup</h1>

      <label> Username </label>
      <br />
      <input type="text" onChange={(e) => setUsername(e.target.value)} />
      <br /> <br />

      <label> Email </label>
      <br />
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <br /> <br />

      <label> Password </label>
      <br />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <br /> <br />

      <label> Confirm Password </label>
      <br />
      <input type="password" onChange={(e) => setCpassword(e.target.value)} />
      <br /> <br />

      <button onClick={handleSubmit}>Signup</button>
      <br />
      <a href="/signin">Already have an account?</a>
    </>
  );
}

export default Signup;
