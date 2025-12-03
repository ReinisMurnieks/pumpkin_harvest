import React from 'react';

const dashboards = [
  { id: 'office', name: 'Office', icon: 'O' },
  { id: 'garden', name: 'Garden', icon: 'G' },
  { id: 'storage', name: 'Storage', icon: 'S' },
  { id: 'delivery', name: 'Delivery', icon: 'D' },
  { id: 'client', name: 'Client', icon: 'C' },
  { id: 'driver', name: 'Driver', icon: 'Dr' },
  { id: 'manager', name: 'Manager', icon: 'M' }
];

export default function DashboardNav({ active, onChange, onLogout }) {
  return (
    <nav className="dashboard-nav">
      <div className="nav-brand">Harvestly</div>
      <div className="nav-items">
        {dashboards.map(d => (
          <button
            key={d.id}
            className={`nav-item ${active === d.id ? 'active' : ''}`}
            onClick={() => onChange(d.id)}
          >
            <span className="nav-icon">{d.icon}</span>
            <span className="nav-label">{d.name}</span>
          </button>
        ))}
      </div>
      <button className="nav-logout" onClick={onLogout}>Logout</button>
    </nav>
  );
}
