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
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    // fetches user info when page loads
    async function fetchUser() {
      console.log('Fetching user data...');
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        console.log('User data received:', data);
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
    console.log('Trying to update email to:', email);
    const res = await fetch('/api/users/me/email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    console.log('Email update response status:', res.status);
    setMessage(res.ok ? 'Email updated!' : 'Failed to update ya email.');
  };

  // updates user password in backend
  const handlePasswordChange = async e => {
    e.preventDefault();
    console.log('Attempting password change...');
    const res = await fetch('/api/users/me/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    console.log('Password change response:', res.status);
    setMessage(res.ok ? 'It actually worked! Password changed!' : 'Failed to change ya password!');
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="user-account-container">
      <div className="tab-bar">
        <button
          onClick={() => setActiveTab('account')}
          className={activeTab === 'account ' ? 'active' : ''}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('mygoons')}
          className={activeTab === 'mygoons' ? 'active' : ''}
        >
          My Goons
        </button>
      </div>

      {activeTab === 'account' && (
        <>
          {/* show account info and froms */}
          <div className="user-info">
            <img src={user.avatarUrl} alt="Avatar" className="avatar" />
            <h2>{user.fullName}</h2>
            <p>Email: {user.email}</p>
            <p>Aliases: {user.aliases && user.aliases.join(', ')}</p>
          </div>
          {/* email and password forms and chatbot */}
          <form onSubmit={handleEmailChange} className="update-form">
            <label htmlFor="email">New Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit">Update Email</button>
          </form>

          <form onSubmit={handlePasswordChange} className="update-form">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Change Password</button>
          </form>

          {message && <div className="message">{message}</div>}
          <div className="chat-section">
            <h3>chat with ai goon applicant</h3>
            <Chatbot userId={user.id} />
          </div>
        </>
      )}

      {activeTab === 'mygoons' && (
        <MyGoons goons={goons} onRemove={onRemoveGoon} updateWallet={updateWallet} />
      )}
    </div>
  );

export default UserAccount;