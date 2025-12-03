import React, { useState } from 'react';
import {
  getAllSources,
  getAllVegetables,
  getAllDevices,
  registerDevice,
  registerVegetable,
  registerSource
} from '../data/registry';

export default function RegistryPanel({ onClose, onUpdate }) {
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

  const handleRegisterVegetable = () => {
    if (newVegId && newVegName) {
      registerVegetable(newVegId.toUpperCase(), newVegName);
      setNewVegId('');
      setNewVegName('');
      onUpdate?.();
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
      onUpdate?.();
    }
  };

  const handleRegisterDevice = () => {
    if (selectedVegForDevice) {
      registerDevice(selectedVegForDevice);
      setSelectedVegForDevice('');
      onUpdate?.();
    }
  };

  return (
    <div className="registry-overlay">
      <div className="registry-modal">
        <div className="registry-header">
          <h2>Registry Management</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>

        <div className="registry-tabs">
          <button 
            className={`tab-btn ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            Devices ({getAllDevices().length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'vegetables' ? 'active' : ''}`}
            onClick={() => setActiveTab('vegetables')}
          >
            Vegetables ({getAllVegetables().length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            Sources ({getAllSources().length})
          </button>
        </div>

        <div className="registry-content">
          {activeTab === 'devices' && (
            <div className="registry-section">
              <h3>Register New Device</h3>
              <div className="form-row">
                <select 
                  value={selectedVegForDevice} 
                  onChange={(e) => setSelectedVegForDevice(e.target.value)}
                >
                  <option value="">Select Vegetable</option>
                  {getAllVegetables().map(v => (
                    <option key={v.id} value={v.id}>[{v.id}] {v.name}</option>
                  ))}
                </select>
                <button onClick={handleRegisterDevice} disabled={!selectedVegForDevice}>
                  Register Device
                </button>
              </div>
              
              <h3>Registered Devices</h3>
              <div className="registry-list">
                {getAllDevices().map(device => {
                  const veg = getAllVegetables().find(v => v.id === device.vegetableId);
                  return (
                    <div key={device.id} className="registry-item">
                      <span className="item-id">{device.id}</span>
                      <span className="item-name">{veg?.name || device.vegetableId}</span>
                      <span className="item-date">{device.createdAt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'vegetables' && (
            <div className="registry-section">
              <h3>Register New Vegetable</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="ID (e.g. ONI)"
                  value={newVegId}
                  onChange={(e) => setNewVegId(e.target.value)}
                  maxLength={3}
                />
                <input
                  type="text"
                  placeholder="Name (e.g. Onion)"
                  value={newVegName}
                  onChange={(e) => setNewVegName(e.target.value)}
                />
                <button onClick={handleRegisterVegetable} disabled={!newVegId || !newVegName}>
                  Register
                </button>
              </div>
              
              <h3>Registered Vegetables</h3>
              <div className="registry-list">
                {getAllVegetables().map(veg => (
                  <div key={veg.id} className="registry-item">
                    <span className="item-id">{veg.id}</span>
                    <span className="item-name">{veg.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="registry-section">
              <h3>Register New Source</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="ID (e.g. GS)"
                  value={newSourceId}
                  onChange={(e) => setNewSourceId(e.target.value)}
                  maxLength={2}
                />
                <input
                  type="text"
                  placeholder="Name (e.g. Garden Spot)"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newSourceDesc}
                  onChange={(e) => setNewSourceDesc(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newSourceFixed}
                    onChange={(e) => setNewSourceFixed(e.target.checked)}
                  />
                  Fixed Location (like Garden Spot)
                </label>
              </div>
              {newSourceFixed && (
                <div className="form-row">
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Latitude (e.g. 52.520008)"
                    value={newSourceLat}
                    onChange={(e) => setNewSourceLat(e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Longitude (e.g. 13.404954)"
                    value={newSourceLng}
                    onChange={(e) => setNewSourceLng(e.target.value)}
                  />
                </div>
              )}
              <div className="form-row">
                <button 
                  onClick={handleRegisterSource} 
                  disabled={!newSourceId || !newSourceName || (newSourceFixed && (!newSourceLat || !newSourceLng))}
                >
                  Register Source
                </button>
              </div>
              
              <h3>Registered Sources (Flow Order)</h3>
              <div className="registry-list">
                {getAllSources().map((source, idx) => (
                  <div key={source.id} className="registry-item">
                    <span className="item-order">{idx + 1}</span>
                    <span className="item-id">{source.id}</span>
                    <span className="item-name">{source.name}</span>
                    <span className="item-desc">{source.description}</span>
                    {source.fixedLocation && source.gps && (
                      <span className="item-gps">
                        {source.gps.lat.toFixed(4)}, {source.gps.lng.toFixed(4)}
                      </span>
                    )}
                    {!source.fixedLocation && (
                      <span className="item-mobile">Mobile</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
