import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#2d6a4f', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none' }}>
        🍃 FoodRescue
      </Link>
      {user && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/food" style={{ color: 'white', textDecoration: 'none' }}>My Food</Link>
          <Link to="/scan" style={{ color: 'white', textDecoration: 'none' }}>Scan Bill</Link>
          <Link to="/recipes" style={{ color: 'white', textDecoration: 'none' }}>Recipes</Link>
          <Link to="/donations" style={{ color: 'white', textDecoration: 'none' }}>Donations</Link>
          <button onClick={handleLogout} style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;