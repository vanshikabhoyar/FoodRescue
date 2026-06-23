import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', userType: 'home' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '32px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2d6a4f' }}>🍃 Join FoodRescue</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />
      <select value={form.userType} onChange={e => setForm({ ...form, userType: e.target.value })} style={inputStyle}>
        <option value="home">Home</option>
        <option value="hostel">Hostel</option>
        <option value="bakery">Bakery</option>
        <option value="supermarket">Supermarket</option>
      </select>
      <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
        Register
      </button>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;