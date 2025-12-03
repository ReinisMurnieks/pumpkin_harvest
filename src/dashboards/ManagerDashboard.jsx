import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4caf50', '#ff9800', '#2196f3', '#9c27b0'];

export default function ManagerDashboard({ data, history, onLogout }) {
  const gardenCount = data.filter(d => d.sourceId?.startsWith('GS')).length;
  const storageCount = data.filter(d => d.sourceId?.startsWith('SB')).length;
  const deliveryCount = data.filter(d => d.sourceId?.startsWith('DB')).length;
  const clientCount = data.filter(d => d.sourceId?.startsWith('CL')).length;
  
  const connectedCount = data.filter(d => d.nowStatus === 'connected').length;
  const disconnectedCount = data.filter(d => d.nowStatus === 'disconnected').length;

  const pieData = [
    { name: 'Garden', value: gardenCount, color: '#4caf50' },
    { name: 'Storage', value: storageCount, color: '#ff9800' },
    { name: 'Delivery', value: deliveryCount, color: '#2196f3' },
    { name: 'Client', value: clientCount, color: '#9c27b0' }
  ].filter(d => d.value > 0);

  const vegetableStats = {};
  data.forEach(d => {
    if (!vegetableStats[d.unit]) vegetableStats[d.unit] = 0;
    vegetableStats[d.unit]++;
  });
  const barData = Object.entries(vegetableStats).map(([name, count]) => ({ name, count }));

  const avgTemp = data.length ? (data.reduce((sum, d) => sum + (parseFloat(d.temperature) || 0), 0) / data.length).toFixed(1) : 0;
  const avgHumidity = data.length ? Math.round(data.reduce((sum, d) => sum + (d.humidity || 0), 0) / data.length) : 0;

  return (
    <div className="dashboard manager-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div><h2>Manager Dashboard</h2><p>Executive overview and analytics</p></div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><span className="stat-value">{data.length}</span><span className="stat-label">Total Devices</span></div>
        <div className="stat-card green"><span className="stat-value">{connectedCount}</span><span className="stat-label">Connected</span></div>
        <div className="stat-card red"><span className="stat-value">{disconnectedCount}</span><span className="stat-label">Disconnected</span></div>
        <div className="stat-card orange"><span className="stat-value">{avgTemp}°C</span><span className="stat-label">Avg Temp</span></div>
        <div className="stat-card blue"><span className="stat-value">{avgHumidity}%</span><span className="stat-label">Avg Humidity</span></div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Distribution by Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Vegetables Count</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#888" fontSize={10} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1e1e2f', border: '1px solid #333' }} />
              <Bar dataKey="count" fill="#00d4ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card garden">
          <h4>Garden Spot</h4>
          <span className="count">{gardenCount}</span>
          <span className="label">Growing</span>
        </div>
        <div className="summary-card storage">
          <h4>Storage Box</h4>
          <span className="count">{storageCount}</span>
          <span className="label">Stored</span>
        </div>
        <div className="summary-card delivery">
          <h4>Delivery Box</h4>
          <span className="count">{deliveryCount}</span>
          <span className="label">In Transit</span>
        </div>
        <div className="summary-card client">
          <h4>Client</h4>
          <span className="count">{clientCount}</span>
          <span className="label">Delivered</span>
        </div>
      </div>
      
      <div className="made-with-kiro">
        <span>Made with</span>
        <svg className="kiro-logo" viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span className="kiro-text">Kiro</span>
      </div>
    </div>
  );
}
