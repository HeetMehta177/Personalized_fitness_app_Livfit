import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            const token = response.data.token;
            alert('Login successful');
            localStorage.setItem('token', token);
            navigate('/profile');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Wrong username or password. Please try again.');
            } else {
                console.log('Login Error', error);
            }
        }
    }

    return (
        <div className='login-box'>
            <div className='login-header'>
                <header>Login</header>
            </div>
            <form className='login-form' onSubmit={handleLogin} >
                <div className='input-box'>
                    <input
                        type='text'
                        className='input-field'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete='off'
                        required
                    />
                </div>
                <div className='input-box'>
                    <input
                        type='password'
                        className='input-field'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete='off'
                        required
                    />
                </div>
                <div className='input-submit'>
                    <button className='submit-btn' type='submit' id='submit'></button>
                    <label htmlFor='submit'>Sign In</label>
                </div>
                <div className='sign-up-link'>
                    <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
