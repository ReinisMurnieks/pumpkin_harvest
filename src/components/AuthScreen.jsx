import React, { useState } from 'react';

const USERS_KEY = 'harvestly_users';
const SESSION_KEY = 'harvestly_session';

// Load users from localStorage
function loadUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Check if user is logged in
export function getSession() {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch { return null; }
}

// Save session
export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Clear session
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export default function AuthScreen({ onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const users = loadUsers();
    const user = users[email.toLowerCase()];
    
    if (!user) {
      setError('User not found');
      return;
    }
    
    if (user.password !== password) {
      setError('Invalid password');
      return;
    }
    
    saveSession({ email: user.email, name: user.name });
    onSuccess();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('All fields required');
      return;
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    const users = loadUsers();
    const emailLower = email.toLowerCase();
    
    if (users[emailLower]) {
      setError('Email already registered');
      return;
    }
    
    users[emailLower] = {
      email: emailLower,
      name,
      password,
      createdAt: new Date().toISOString()
    };
    
    saveUsers(users);
    saveSession({ email: emailLower, name });
    onSuccess();
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h1>Harvestly</h1>
        <p className="auth-subtitle">Global Fresh Produce Tracking</p>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <span className="auth-error">{error}</span>}
            <button type="submit" className="auth-submit">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <span className="auth-error">{error}</span>}
            <button type="submit" className="auth-submit">Create Account</button>
          </form>
        )}

        <div className="made-with-kiro">
          <span>Made with</span>
          <svg className="kiro-logo" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="kiro-text">Kiro</span>
        </div>
      </div>
    </div>
  );
}
