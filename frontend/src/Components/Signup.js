import React, { useState } from 'react';
import './Signup.css'; // Import the CSS file for styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://fuzziess-vx0m.onrender.com/api/auth/signup', formData);
      console.log('Signup successful:', response.data);
      navigate('/login'); // Redirect to login page after successful signup
    } catch (err) {
      setError('Signup failed. Please try again.'); // Show error message if signup fails
    }
  };

  return (
    <div className="signup-container">
      <h1 className='signup-h1'>Sign Up</h1>
      <form className='signup-form' onSubmit={handleSubmit}>
        <input  
          className='input-signup'
          placeholder="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input 
          className='input-signup'
          placeholder="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          className='input-signup'
          placeholder="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input 
          className="sub-signup" 
          type="submit" 
          value="Sign Up" 
        />
        {error && <p>{error}</p>} {/* Display error if signup fails */}
      </form>
      <a className='signup-anchor' href="/login">Go back to login page</a> {/* Link to login */}
    </div>
  );
};

export default SignUp;
