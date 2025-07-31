import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from './DangerModal'; 
import './Login.css'; 
import './SignUp.css'; 

function SignUp() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    organization: '',
    aliases: '',
    birthdate: '',
  });

  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ show: false, message: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

const validate = () => {
  const newErrors = {};
  // required fields
  ['fullName', 'username', 'password', 'confirmPassword', 'email', 'birthdate'].forEach(field => {
    if (!form[field]) newErrors[field] = 'Required';
  });
  // email validation
  if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    newErrors.email = 'Enter a valid email address.';
  }
  // password matcher
  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    newErrors.confirmPassword = 'ERROR! Passwords do not match.';
  }
  // age checker (must be 18+)
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

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // this shows the modal with error messages
      let msg = '';
      if (newErrors.email) msg += `${newErrors.email}\n`;
      if (newErrors.birthdate) msg += `${newErrors.birthdate}\n`;
      if (Object.values(newErrors).includes('Required')) msg += 'Please fill out all required fields.\n';
      if (newErrors.confirmPassword) msg += `${newErrors.confirmPassword}\n`;
      setModal({ show: true, message: msg.trim() });
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      username: form.username,
      password: form.password,
      email: form.email,
      fullName: form.fullName,
      organization: form.organization,
      aliases: form.aliases,
      birthdate: form.birthdate
  });
  localStorage.setItem('users', JSON.stringify(users));
  setModal({ show: true, message: 'Account created! Please check ya email to confirm!' });
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
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
          <input
            type="text"
            name="aliases"
            value={form.aliases}
            onChange={handleChange}
          />
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