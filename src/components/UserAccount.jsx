import React, { useState } from 'react';
import './UserAccount.css';
import MyGoons from './MyGoons';

const defaultAvatar = 'https://via.placeholder.com/150?text=Avatar';

const initialTabs = ['General Information', 'Messaging', 'My Goons'];

const demoUserData = {
  fullName: 'Bobby DeLuca',
  username: 'coldplayfan82',
  email: 'bobby@mafiamail.com',
  organization: 'None',
  aliases: 'Robert, Bobby D',
  birthdate: '05/15/1982',
  avatar: defaultAvatar,
};

const demoChats = [
  {
    id: 'chat1',
    name: 'Support',
    messages: [
      { sender: 'Support', text: "Hello! How's can we help you today?" },
      { sender: 'coldplayfan82', text: "Hi, I heard you're the guy to talk about a certain thing." },
      { sender: 'Support', text: 'Sure, ask away!' },
    ],
  },
  {
    id: 'chat2',
    name: 'Friend',
    messages: [
      { sender: 'Friend', text: "Hey Bobby, are you comin' to the docks tonight?" },
      { sender: 'coldplayfan82', text: 'Say less.' },
    ],
  },
];

function UserAccount({
  userData = demoUserData,
  chats = demoChats,
  myGoons = [],
  onRemove,
  updateWallet,
  wallet
}) {
  const [form, setForm] = useState({
    fullName: userData?.fullName || '',
    username: userData?.username || '',
    email: userData?.email || '',
    organization: userData?.organization || '',
    aliases: userData?.aliases || '',
    birthdate: userData?.birthdate || '',
    avatar: userData?.avatar || defaultAvatar,
  });

  const [activeTab, setActiveTab] = useState(initialTabs[0]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedChat, setSelectedChat] = useState(chats?.[0]?.id || null);

  // does the avatar upload
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm({ ...form, avatar: ev.target.result });
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // handles field changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // validate fields
  const validate = () => {
    const newErrors = {};
    ['fullName', 'username', 'email', 'birthdate'].forEach(field => {
      if (!form[field]) newErrors[field] = 'Required';
    });
    if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Enter a valid email address.';
    }
    return newErrors;
  };

  // save edit changes
  const handleSave = e => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setEditMode(false);
    // backend stuff would go here, i.e. save form data
  };

  // messaging tab logic
  const chatList = chats || [];
  const currentChat = chatList.find(chat => chat.id === selectedChat);

  return (
    <div
      className="account-container"
      style={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: 'transparent',
        width: '100%',
        padding: '32px 0'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '32px',
          width: '100%',
          maxWidth: '900px',
          marginTop: '120px', // moved content further down
          marginBottom: '48px',
          boxSizing: 'border-box'
        }}
      >
        {/* tabs */}
        <div
          style={{
            minWidth: '180px',
            borderRight: '1px solid #333',
            paddingRight: '18px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {initialTabs.map(tab => (
            <div
              key={tab}
              style={{
                padding: '12px 0',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                color: '#111',
                fontSize: '1.05em'
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        {/* content in the tab */}
        <div
          style={{
            flex: 1,
            paddingLeft: '32px',
            boxSizing: 'border-box',
            width: '100%',
            minWidth: 0
          }}
        >
          {activeTab === 'General Information' && (
            <form
              className="account-form"
              style={{
                maxWidth: '500px',
                color: '#111',
                margin: '0 auto',
                width: '100%'
              }}
              onSubmit={handleSave}
            >
              <h2 style={{ color: '#111', textAlign: 'left' }}>Profile</h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginBottom: '18px',
                  flexWrap: 'wrap'
                }}
              >
                <img
                  src={form.avatar}
                  alt="Avatar"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    background: '#222',
                    border: '2px solid orange'
                  }}
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    onChange={handleAvatarChange}
                  />
                  <label
                    htmlFor="avatar-upload"
                    style={{
                      background: 'orange',
                      color: '#222',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginTop: '8px'
                    }}
                  >
                    Change Avatar
                  </label>
                </div>
              </div>
              <label style={{ color: '#111', width: '100%', display: 'block' }}>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                  style={{ color: '#111', background: '#222', width: '100%' }}
                />
                {errors.fullName && <span style={{ color: '#111' }}>{errors.fullName}</span>}
              </label>
              <label style={{ color: '#111', width: '100%', display: 'block' }}>
                Username
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                  style={{ color: '#111', background: '#222', width: '100%' }}
                />
                {errors.username && <span style={{ color: '#111' }}>{errors.username}</span>}
              </label>
              <label style={{ color: '#111', width: '100%', display: 'block' }}>
                E-Mail
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                  style={{ color: '#111', background: '#222', width: '100%' }}
                />
                {errors.email && <span style={{ color: '#111' }}>{errors.email}</span>}
              </label>
              <label style={{ color: '#111', width: '100%', display: 'block' }}>
                Criminal Organization
                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  disabled={!editMode}
                  style={{ color: '#111', background: '#222', width: '100%' }}
                />
              </label>
              <label style={{ color: '#111', width: '100%', display: 'block' }}>
                Aliases
                <input
                  type="text"
                  name="aliases"
                  value={form.aliases}
                  onChange={handleChange}
                  disabled={!editMode}
                  style={{ color: '#111', background: '#222', width: '100%' }}
                />
              </label>
              <label style={{ color: '#111', width: '100%', display: 'block' }}>
                Birthdate
                <input
                  type="date"
                  name="birthdate"
                  value={form.birthdate}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  style={{ color: '#111', background: '#222', width: '100%' }}
                />
                {errors.birthdate && <span style={{ color: '#111' }}>{errors.birthdate}</span>}
              </label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
                {!editMode ? (
                  <button type="button" onClick={() => setEditMode(true)}>
                    Edit
                  </button>
                ) : (
                  <>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
          {activeTab === 'Messaging' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                width: '100%',
                minWidth: 0,
                height: 'auto'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '24px',
                  width: '100%',
                  minWidth: 0
                }}
              >
                {/* chat list */}
                <div
                  style={{
                    width: '180px',
                    borderRight: '1px solid #333',
                    overflowY: 'auto'
                  }}
                >
                  <h3 style={{ color: 'orange', marginBottom: '10px' }}>Chats</h3>
                  {chatList.length === 0 && <div>No chats yet.</div>}
                  {chatList.map(chat => (
                    <div
                      key={chat.id}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        background: selectedChat === chat.id ? '#333' : 'transparent',
                        color: selectedChat === chat.id ? 'orange' : '#fff',
                        borderRadius: '6px',
                        marginBottom: '6px'
                      }}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      {chat.name}
                    </div>
                  ))}
                </div>
                {/* chat window */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#222',
                    borderRadius: '12px',
                    padding: '18px',
                    overflowY: 'auto',
                    minWidth: 0
                  }}
                >
                  {currentChat ? (
                    <>
                      <h3 style={{ color: 'orange', marginBottom: '10px' }}>{currentChat.name}</h3>
                      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
                        {currentChat.messages.map((msg, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: '10px',
                              textAlign: msg.sender === form.username ? 'right' : 'left'
                            }}
                          >
                            <span
                              style={{
                                background: msg.sender === form.username ? 'orange' : '#444',
                                color: msg.sender === form.username ? '#222' : '#fff',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                display: 'inline-block',
                                maxWidth: '70%'
                              }}
                            >
                              <strong>{msg.sender}:</strong> {msg.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* message input */}
                      <form style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onSubmit={e => {
                        e.preventDefault();
                      }}>
                        <input
                          type="text"
                          placeholder="Type a message..."
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#333',
                            color: '#fff',
                            minWidth: 0
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: 'orange',
                            color: '#222',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: 'bold'
                          }}
                        >
                          Send
                        </button>
                      </form>
                    </>
                  ) : (
                    <div style={{ color: '#aaa' }}>Select a chat to view messages.</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'My Goons' && (
            <div style={{ width: '100%', margin: '0 auto', maxWidth: '600px' }}>
              <MyGoons
                goons={myGoons}
                onRemove={onRemove}
                updateWallet={updateWallet}
                wallet={wallet}
              />
            </div>
          )}
        </div>
      </div>
      {/* makes it responsive */}
      <style>
        {`
          @media (max-width: 900px) {
            .account-container > div {
              flex-direction: column !important;
              gap: 0 !important;
              max-width: 100vw !important;
              padding: 0 8px !important;
            }
            .account-form {
              max-width: 100vw !important;
              padding: 0 !important;
            }
          }
          @media (max-width: 600px) {
            .account-container {
              padding: 8px 0 !important;
            }
            .account-form {
              max-width: 100vw !important;
              padding: 0 !important;
            }
            .account-container > div > div {
              padding-left: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default UserAccount;