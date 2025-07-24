import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot';
import MyGoons from './UserAccount/MyGoons';
import './UserAccount.css';

function UserAccount() {
  // user state holds user info from backend
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    // fetches user info when page loads
    async function fetchUser() {
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setEmail(data.email);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  // updates user email in backend
  const handleEmailChange = async e => {
    e.preventDefault();
    const res = await fetch('/api/users/me/email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setMessage(res.ok ? 'Email updated!' : 'Failed to update ya email.');
  };

  // updates user password in backend
  const handlePasswordChange = async e => {
    e.preventDefault();
    const res = await fetch('/api/users/me/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setMessage(res.ok ? 'It actually worked! Password changed!' : 'Failed to change ya password!');
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="user-account-container">
      <div className="user-info">
        {/* shows user avatar image */}
        <img src={user.avatarUrl} alt="Avatar" className="avatar" />
        <h2>{user.fullName}</h2>
        <p>Email: {user.email}</p>
        {/* shows all user aliases separated by commas */}
        <p>Aliases: {user.aliases && user.aliases.join(', ')}</p>
      </div>
      <form onSubmit={handleEmailChange} className="update-form">
        <label>
          Change Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Email</button>
      </form>
      <form onSubmit={handlePasswordChange} className="update-form">
        <label>
          Change Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Change Password</button>
      </form>
      {/* shows message after email or password update */}
      {message && <div className="message">{message}</div>}
      <div className="chat-section">
        <h3>Chat with AI Goon Applicant</h3>
        {/* chatbot for user interaction */}
        <Chatbot userId={user.id} />
      </div>
    </div>
  );
}

export default UserAccount;