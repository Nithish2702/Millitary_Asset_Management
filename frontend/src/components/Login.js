import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Attempting login with:', credentials.username);
        try {
            const user = await login(credentials);
            console.log('Login successful:', user);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Military Asset Management</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit">Login</button>
                </form>
                <div className="demo-credentials">
                    <p>Demo Credentials:</p>
                    <p>Admin: admin / admin123</p>
                    <p>Commander: commander_alpha / commander123</p>
                    <p>Logistics: logistics_alpha / logistics123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
