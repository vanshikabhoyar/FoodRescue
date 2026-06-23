import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [expiring, setExpiring] = useState([]);
  const [stats, setStats] = useState({ total: 0, expiring: 0, donated: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [allRes, expiringRes] = await Promise.all([
        API.get('/food'),
        API.get('/food/expiring')
      ]);
      setExpiring(expiringRes.data);
      const all = allRes.data;
      setStats({
        total: all.length,
        expiring: expiringRes.data.length,
        donated: all.filter(i => i.isDonated).length
      });
    };
    fetchData();
  }, []);

  const cardStyle = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1 };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#2d6a4f' }}>Welcome back, {user?.name}! 👋</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <div style={cardStyle}>
          <h1 style={{ color: '#2d6a4f', margin: 0 }}>{stats.total}</h1>
          <p style={{ color: '#666' }}>Total Items</p>
        </div>
        <div style={cardStyle}>
          <h1 style={{ color: '#ff8c00', margin: 0 }}>{stats.expiring}</h1>
          <p style={{ color: '#666' }}>Expiring Soon</p>
        </div>
        <div style={cardStyle}>
          <h1 style={{ color: '#52b788', margin: 0 }}>{stats.donated}</h1>
          <p style={{ color: '#666' }}>Items Donated</p>
        </div>
      </div>

      {expiring.length > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px', color: '#856404' }}>⚠️ Items Expiring Within 3 Days</h3>
          {expiring.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e0a0' }}>
              <span>{item.name}</span>
              <span style={{ color: '#856404' }}>{new Date(item.expiryDate).toDateString()}</span>
            </div>
          ))}
          <Link to="/recipes" style={{ display: 'inline-block', marginTop: '12px', background: '#2d6a4f', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}>
            🍳 Get Recipe Suggestions
          </Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[
          { to: '/scan', icon: '📷', label: 'Scan Bill / Product', desc: 'Auto-detect expiry dates from bill photos' },
          { to: '/food', icon: '🥫', label: 'Manage Food Items', desc: 'Add, edit, or remove items manually' },
          { to: '/recipes', icon: '🍳', label: 'Recipe Suggestions', desc: 'Cook before it expires!' },
          { to: '/donations', icon: '🤝', label: 'Food Donations', desc: 'List or claim donated food' }
        ].map(link => (
          <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2rem' }}>{link.icon}</div>
              <h3 style={{ color: '#2d6a4f', margin: '8px 0 4px' }}>{link.label}</h3>
              <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;