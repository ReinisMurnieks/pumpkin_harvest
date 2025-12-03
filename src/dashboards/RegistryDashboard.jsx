import React, { useState } from 'react';
import {
  getAllSources,
  getAllVegetables,
  getAllDevices,
  registerDevice,
  registerVegetable,
  registerSource
} from '../data/registry';

export default function RegistryDashboard({ onLogout, onRefresh }) {
  const [activeTab, setActiveTab] = useState('devices');
  const [newVegId, setNewVegId] = useState('');
  const [newVegName, setNewVegName] = useState('');
  const [newSourceId, setNewSourceId] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceDesc, setNewSourceDesc] = useState('');
  const [newSourceLat, setNewSourceLat] = useState('');
  const [newSourceLng, setNewSourceLng] = useState('');
  const [newSourceFixed, setNewSourceFixed] = useState(false);
  const [selectedVegForDevice, setSelectedVegForDevice] = useState('');
  const [, forceUpdate] = useState(0);

  const refresh = () => {
    forceUpdate(n => n + 1);
    onRefresh?.();
  };

  const handleRegisterVegetable = () => {
    if (newVegId && newVegName) {
      registerVegetable(newVegId.toUpperCase(), newVegName);
      setNewVegId('');
      setNewVegName('');
      refresh();
    }
  };

  const handleRegisterSource = () => {
    if (newSourceId && newSourceName) {
      const gps = newSourceFixed && newSourceLat && newSourceLng
        ? { lat: parseFloat(newSourceLat), lng: parseFloat(newSourceLng) }
        : null;
      registerSource(newSourceId.toUpperCase(), newSourceName, newSourceDesc, newSourceFixed, gps);
      setNewSourceId('');
      setNewSourceName('');
      setNewSourceDesc('');
      setNewSourceLat('');
      setNewSourceLng('');
      setNewSourceFixed(false);
      refresh();
    }
  };

  const handleRegisterDevice = () => {
    if (selectedVegForDevice) {
      registerDevice(selectedVegForDevice);
      setSelectedVegForDevice('');
      refresh();
    }
  };

  return (
    <div className="dashboard registry-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div>
            <h2>Registry Dashboard</h2>
            <p>Manage devices, vegetables, and sources</p>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="registry-tabs-full">
        <button className={`tab-btn ${activeTab === 'devices' ? 'active' : ''}`} onClick={() => setActiveTab('devices')}>
          Devices ({getAllDevices().length})
        </button>
        <button className={`tab-btn ${activeTab === 'vegetables' ? 'active' : ''}`} onClick={() => setActiveTab('vegetables')}>
          Vegetables ({getAllVegetables().length})
        </button>
        <button className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`} onClick={() => setActiveTab('sources')}>
          Sources ({getAllSources().length})
        </button>
      </div>

      <div className="registry-content-full">
        {activeTab === 'devices' && (
          <div className="registry-section-full">
            <div className="form-card">
              <h3>Register New Device</h3>
              <div className="form-row">
                <select value={selectedVegForDevice} onChange={(e) => setSelectedVegForDevice(e.target.value)}>
                  <option value="">Select Vegetable</option>
                  {getAllVegetables().map(v => (
                    <option key={v.id} value={v.id}>[{v.id}] {v.name}</option>
                  ))}
                </select>
                <button onClick={handleRegisterDevice} disabled={!selectedVegForDevice}>Register Device</button>
              </div>
            </div>
            
            <div className="registry-table">
              <h3>Registered Devices</h3>
              <table>
                <thead>
                  <tr>
                    <th>Device ID</th>
                    <th>Vegetable</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllDevices().map(device => {
                    const veg = getAllVegetables().find(v => v.id === device.vegetableId);
                    return (
                      <tr key={device.id}>
                        <td className="iot-code">{device.id}</td>
                        <td>{veg?.name || device.vegetableId}</td>
                        <td>{device.createdAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vegetables' && (
          <div className="registry-section-full">
            <div className="form-card">
              <h3>Register New Vegetable</h3>
              <div className="form-row">
                <input type="text" placeholder="ID (e.g. APL)" value={newVegId} onChange={(e) => setNewVegId(e.target.value)} maxLength={3} />
                <input type="text" placeholder="Name (e.g. Apple)" value={newVegName} onChange={(e) => setNewVegName(e.target.value)} />
                <button onClick={handleRegisterVegetable} disabled={!newVegId || !newVegName}>Register</button>
              </div>
            </div>
            
            <div className="registry-table">
              <h3>Registered Vegetables</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllVegetables().map(veg => (
                    <tr key={veg.id}>
                      <td className="iot-code">{veg.id}</td>
                      <td>{veg.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="registry-section-full">
            <div className="form-card">
              <h3>Register New Source</h3>
              <div className="form-row">
                <input type="text" placeholder="ID (e.g. WH)" value={newSourceId} onChange={(e) => setNewSourceId(e.target.value)} maxLength={2} />
                <input type="text" placeholder="Name" value={newSourceName} onChange={(e) => setNewSourceName(e.target.value)} />
                <input type="text" placeholder="Description" value={newSourceDesc} onChange={(e) => setNewSourceDesc(e.target.value)} />
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" checked={newSourceFixed} onChange={(e) => setNewSourceFixed(e.target.checked)} />
                  Fixed Location
                </label>
              </div>
              {newSourceFixed && (
                <div className="form-row">
                  <input type="number" step="0.000001" placeholder="Latitude" value={newSourceLat} onChange={(e) => setNewSourceLat(e.target.value)} />
                  <input type="number" step="0.000001" placeholder="Longitude" value={newSourceLng} onChange={(e) => setNewSourceLng(e.target.value)} />
                </div>
              )}
              <div className="form-row">
                <button onClick={handleRegisterSource} disabled={!newSourceId || !newSourceName || (newSourceFixed && (!newSourceLat || !newSourceLng))}>
                  Register Source
                </button>
              </div>
            </div>
            
            <div className="registry-table">
              <h3>Registered Sources</h3>
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllSources().map((source, idx) => (
                    <tr key={source.id}>
                      <td>{idx + 1}</td>
                      <td className="iot-code">{source.id}</td>
                      <td>{source.name}</td>
                      <td>{source.description}</td>
                      <td>
                        {source.fixedLocation && source.gps 
                          ? <span className="gps-badge">{source.gps.lat.toFixed(4)}, {source.gps.lng.toFixed(4)}</span>
                          : <span className="mobile-badge">Mobile</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
