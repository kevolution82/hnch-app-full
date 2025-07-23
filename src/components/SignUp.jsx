import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from './DangerModal';
import './Login.css';
import './SignUp.css';

/* signup form */
function SignUp() {
  // form state includes all fields, aliases as array, avatar as a file
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    organization: '',
    aliases: [],
    birthdate: '',
    avatar: null,
  });

  // input for adding new alias
  const [aliasInput, setAliasInput] = useState('');
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ show: false, message: '' });

  // handles input changes, supports file upload for avatar
  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setForm({ ...form, avatar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // adds alias to aliases array
  const handleAliasAdd = e => {
    e.preventDefault();
    if (aliasInput.trim()) {
      setForm({ ...form, aliases: [...form.aliases, aliasInput.trim()] });
      setAliasInput('');
    }
  };

  // removes alias from aliases array
  const handleAliasRemove = idx => {
    setForm({ ...form, aliases: form.aliases.filter((_, i) => i !== idx) });
  };

  // calculates age from birthdate
  function getAge(birthdate) {
    if (!birthdate) return 0;
    const [yyyy, mm, dd] = birthdate.split('-');
    const birth = new Date(`${yyyy}-${mm}-${dd}`);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - (birth.getMonth() - 1);
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // checks for required fields, valid email, password match, age
  const validate = () => {
    const newErrors = {};
    ['fullName', 'username', 'password', 'confirmPassword', 'email', 'birthdate'].forEach(field => {
      if (!form[field] || (Array.isArray(form[field]) && form[field].length === 0)) newErrors[field] = 'Required';
    });
    if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Enter a valid email address right now.';
    }
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'ERROR! Passwords do not match.';
    }
    if (
      form.birthdate &&
      form.birthdate.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      const age = getAge(form.birthdate);
      if (age < 18) {
        newErrors.birthdate = 'Whoa there! You must be at least 18 years old.';
      }
    }
    return newErrors;
  };

  // submits form data to backend using FormData, shows modal on success or error
  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      let msg = '';
      if (newErrors.email) msg += `${newErrors.email}\n`;
      if (newErrors.birthdate) msg += `${newErrors.birthdate}\n`;
      if (Object.values(newErrors).includes('Required')) msg += 'Please fill out all these required fields.\n';
      if (newErrors.confirmPassword) msg += `${newErrors.confirmPassword}\n`;
      setModal({ show: true, message: msg.trim() });
      return;
    }
    // prepare form data for backend, supports file and array fields.
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'aliases') {
        value.forEach(alias => formData.append('aliases[]', alias));
      } else if (key === 'avatar' && value) {
        formData.append('avatar', value);
      } else {
        formData.append(key, value);
      }
    });
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Signup failed');
      // handle success (redirect, show message, etc. etc. etc.)
      setModal({ show: true, message: 'Account created successfully!' });
    } catch (err) {
      setModal({ show: true, message: err.message });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Create Account</h2>
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          {errors.fullName && <span>{errors.fullName}</span>}
        </label>
        <label>
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span>{errors.username}</span>}
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span>{errors.password}</span>}
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </label>
        <label>
          E-Mail
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span>{errors.email}</span>}
        </label>
        <label>
          Criminal Organization
          <input
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
          />
        </label>
        <label>
          Aliases
          {/* allows adding and removing multiple aliases */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={aliasInput}
              onChange={e => setAliasInput(e.target.value)}
              placeholder="Add alias"
            />
            <button onClick={handleAliasAdd}>Add</button>
          </div>
          <ul>
            {form.aliases.map((alias, idx) => (
              <li key={idx}>
                {alias}
                {/* remove button for each alias */}
                <button type="button" onClick={() => handleAliasRemove(idx)}>Remove</button>
              </li>
            ))}
          </ul>
          {errors.aliases && <span>{errors.aliases}</span>}
        </label>
        <label>
          Birthdate
          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            style={{ color: form.birthdate ? "#fff" : "#aaa", background: "#222" }}
          />
          {errors.birthdate && <span>{errors.birthdate}</span>}
        </label>
        <label>
          Avatar
          {/* file input for avatar image */}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign Up</button>
        <div className="create-account-link">
          <Link to="/login">Already have an account? Login!</Link>
        </div>
      </form>
      {modal.show && (
        <ConfirmModal
          message={modal.message}
          onConfirm={() => setModal({ show: false, message: '' })}
          alertOnly={true}
        />
      )}
    </div>
  );
}

export default SignUp;