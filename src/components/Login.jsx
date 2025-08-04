import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // handles login form submission and checks credentials against the localStorage
  const handleSubmit = (e) => {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    // it only updates fields that are missing and saves the avatar if it exists
    const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const avatar =
      existingProfile.username === user.username && existingProfile.avatar
        ? existingProfile.avatar
        : user.avatar || 'https://via.placeholder.com/150?text=Avatar';
    // merges all existing profile fields but updates with latest user info and avatar
    localStorage.setItem(
      'userProfile',
      JSON.stringify({ ...existingProfile, ...user, avatar })
    );
    navigate('/account');
  } else {
    setError('Invalid username or password');
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <span style={{ color: 'orange' }}>{error}</span>}
        <button type="submit">Continue</button>
        <div className="create-account-link">
          <Link to="/signup">Create Account</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;