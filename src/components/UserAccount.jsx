import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAccount.css';
import MyGoons from './MyGoons';
import ConfirmModal from './ConfirmModal';
import EditButton from './EditButton';

const defaultAvatar = 'https://static.wixstatic.com/media/7a4abc_a01c97c757434c33b4c1b7777e4a4934~mv2.png';
const initialTabs = ['General Information', 'Messaging', 'My Goons', 'Logout'];
const demoChats = [
  {
    id: 'sal',
    name: 'Big Sal',
    messages: [
      { sender: 'sal', text: "Ay, I saw your gig post. You need muscle or you need brains? Either way, I'm your guy. Let's talk business." }
    ],
  },
  {
    id: 'sssteven',
    name: 'Sssteven',
    messages: [
      { sender: 'sssteven', text: "Hisss... I sssaw your gig. Doesss it involve ratsss? I can handle ratsss... for a price." }
    ],
  },
  {
    id: 'grandma',
    name: 'Grandma ❤️',
    messages: [
      { sender: 'grandma', text: "Hi honey, can you help me with the remote again? I can't find the Netflix button. Love you!" }
    ],
  },
  {
    id: 'petey no-nose',
    name: 'Petey No-Nose',
    messages: [
      { sender: 'petey no-nose', audio: '/petey.wav', text: "🔊 [Voice message]" }
    ],
  },
];

function UserAccount({
  userData,
  chats = demoChats,
  myGoons = [],
  onRemove,
  updateWallet,
  wallet
}) {
  const [form, setForm] = useState(() => {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
  return {
    fullName: user.fullName || '',
    username: user.username || '',
    email: user.email || '',
    organization: user.organization || '',
    aliases: user.aliases || '',
    birthdate: user.birthdate || '',
    avatar: user.avatar || defaultAvatar,
  };
});

  const [modal, setModal] = useState({ show: false, message: '' }); 
  const navigate = useNavigate(); 
  useEffect(() => {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
  if (!user || !user.username) {
    navigate('/login');
  }
}, [navigate]);
  const [editMode, setEditMode] = useState(false); 
  const [activeTab, setActiveTab] = useState(initialTabs[0]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedChat, setSelectedChat] = useState(chats?.[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);

  // load messages for selected chat wh en messaging tab is active
useEffect(() => {
  if (activeTab !== 'Messaging' || !selectedChat) return;
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
  const userId = loggedInUser.id || 1;

  // fetches messages for this user and chat from the backend
  fetch(`http://localhost:8080/api/messages/${userId}/${selectedChat}`)
    .then(res => res.ok ? res.json() : [])
    .then(data => setMessages(data))
    .catch(() => setMessages([]));
}, [activeTab, selectedChat]);

  // does the avatar upload
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(prev => {
          const updated = { ...prev, avatar: ev.target.result };
          // update avatar in sessionStorage immediately
          const user = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
          sessionStorage.setItem('loggedInUser', JSON.stringify({ ...user, avatar: ev.target.result }));
          return updated;
        });
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // handleChange updates the form state when the user types in a field
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handleSendMessage sends the user's message to the backend and updates the chat window
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    const userId = loggedInUser.id || 1;
    const chat = chats.find(c => c.id === selectedChat);
    const character = chat ? chat.id : selectedChat;
  
    try {

      const res = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          text: messageInput,
          character,
        }),
      });
  
      if (res.ok) {
        // fetch updated messages after sending
        const response = await fetch(`http://localhost:8080/api/messages/${userId}/${character}`);
        const updatedMessages = response.ok ? await response.json() : [];
        setMessages(updatedMessages);
        setMessageInput(''); // clear the input box
      } else {
        setModal({ show: true, message: 'failed to send message.' });
      }
    } catch (err) {
      setModal({ show: true, message: 'failed to send message.' });
    }
  };

  // validate checks for required fields and valid email format before saving
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

  // edit mode
  const handleEdit = () => {
    setEditMode(true);
    setErrors({});
  };

  const handleSave = async e => {
  e.preventDefault();
  const newErrors = validate();
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

    try {
    const res = await fetch(`http://localhost:8080/api/users/${form.username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updatedUser = await res.json();
      sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setForm(updatedUser);
      setEditMode(false);
    } else {
      setModal({ show: true, message: 'Failed to update profile.' });
    }
  } catch (err) {
    setModal({ show: true, message: 'Failed to update profile.' });
  }
};

  const handleCancel = () => {
    const user = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    setForm({
      fullName: user.fullName || '',
      username: user.username || '',
      email: user.email || '',
      organization: user.organization || '',
      aliases: user.aliases || '',
      birthdate: user.birthdate || '',
      avatar: user.avatar || defaultAvatar,
    });
    setEditMode(false);
    setErrors({});
  };

  // only users with ADMIN role (from sessionStorage) see the delete button for messages
  const handleDelete = (msgId) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    fetch(`http://localhost:8080/api/messages/${msgId}?username=${loggedInUser.username}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed!');
        setMessages(messages.filter(m => m.id !== msgId));
      })
      .catch(err => {        
        setModal({ show: true, message: 'Failed to delete message (ADMIN ONLY!).' });
      });
  };

  // logging out clears the user from sessionStorage and navigates to login page
  const handleLogout = () => {
    setModal({
      show: true,
      message: "Alright fine, you're logged out. Just don't talk about anything you've seen here. Got it?"
    });
  };

  const handleModalConfirm = () => {
    if (modal.message.startsWith("Alright fine, you're logged out. Just don't talk about anything you've seen here. Got it?")) {
      sessionStorage.removeItem('loggedInUser');
      setModal({ show: false, message: '' });
      navigate('/login', { replace: true });
    } else {
      setModal({ show: false, message: '' });
    }
  };

  // admin status
  const isAdmin = (() => {
    const user = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    return user.role === 'ADMIN';
  })();

  const chatList = chats || [];
  const currentChat = chatList.find(chat => chat.id === selectedChat);

  return (
    <main className="account-container" style={{
      minHeight: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      background: 'transparent',
      width: '100%',
      padding: '32px 0',
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif'
    }}>
      <section style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '32px',
        width: '100%',
        maxWidth: '900px',
        marginTop: '120px',
        marginBottom: '48px',
        boxSizing: 'border-box'
      }}>
        {/* tabs */}
        <div style={{
          minWidth: '180px',
          borderRight: '1px solid #333',
          paddingRight: '18px',
          display: 'flex',
          flexDirection: 'column'
        }}>
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
        <div style={{
          flex: 1,
          paddingLeft: '32px',
          boxSizing: 'border-box',
          width: '100%',
          minWidth: 0
        }}>
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginBottom: '18px',
                flexWrap: 'wrap'
              }}>
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
                  style={{ color: '#fff', background: '#222', width: '100%' }}
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
                  style={{ color: '#fff', background: '#222', width: '100%' }}
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
                  style={{ color: '#fff', background: '#222', width: '100%' }}
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
                  style={{ color: '#fff', background: '#222', width: '100%' }}
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
                  style={{ color: '#fff', background: '#222', width: '100%' }}
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
                  style={{ color: '#fff', background: '#222', width: '100%' }}
                />
                {errors.birthdate && <span style={{ color: '#fff' }}>{errors.birthdate}</span>}
              </label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
                {!editMode ? (
                  <EditButton onClick={handleEdit} />
                ) : (
                  <>
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      onClick={handleCancel}
                    >
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
              <div style={{ marginBottom: '8px', textAlign: 'right' }}>

              </div>
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
                  <h3 style={{ color: 'black', marginBottom: '10px' }}>Chats</h3>
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
                {/* chat window and message input */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  {selectedChat ? (
                    <>
                      <div
                        style={{
                          height: '650px',
                          overflowY: 'auto',
                          marginBottom: '12px',
                          background: '#222',
                          borderRadius: '10px',
                          padding: '12px'
                        }}
                      >

                        {messages.map((msg, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: '10px',
                              textAlign: msg.sender === form.username ? 'right' : 'left'
                            }}
                          >
                            <span
                              className="chat-message-bubble"
                              style={{
                                background: msg.sender === form.username ? 'orange' : '#444',
                                color: msg.sender === form.username ? '#222' : '#fff',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                display: 'inline-block',
                                maxWidth: '70%',
                                width: 'auto'
                              }}
                            >
                              <strong>{msg.sender}:</strong> {msg.text}
                              {msg.audio && (
                                <audio
                                  className="chat-audio"
                                  controls
                                  style={{ display: 'block', marginTop: '8px', width: '100%' }}
                                >
                                  <source src={msg.audio} type="audio/wav" />
                                  your browser does not support this thing.
                                </audio>
                              )}
                              {/* admin delete button */}
                              {isAdmin && (
                                <button
                                  style={{
                                    marginLeft: '10px',
                                    background: 'red',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '2px 8px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleDelete(msg.id)}
                                >
                                  Delete
                                </button>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* message input */}
                      <form style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onSubmit={handleSendMessage}>
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={e => setMessageInput(e.target.value)}
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
                    <div style={{ color: '#aaa', flex: 1 }}>Select a chat to view messages.</div>
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
          {activeTab === 'Logout' && (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <button
                style={{
                  background: 'orange',
                  color: '#222',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 32px',
                  fontWeight: 'bold',
                  fontSize: '1.2em',
                  cursor: 'pointer'
                }}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </section>
      {modal.show && (
        <ConfirmModal
          message={modal.message}
          onConfirm={handleModalConfirm}
          alertOnly={true}
        />
      )}
    </main>
  );
}

export default UserAccount;