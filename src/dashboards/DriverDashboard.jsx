import React, { useState } from 'react';
import DeviceGraph from '../components/DeviceGraph';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export default function DriverDashboard({ data, history, onLogout }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const deliveryData = data.filter(d => d.sourceId?.startsWith('DB'));
  
  const positions = deliveryData.filter(d => d.gps).map(d => ({ ...d, position: [d.gps.lat, d.gps.lng] }));
  const center = positions.length > 0 ? positions[0].position : [20, 0];

  return (
    <div className="dashboard driver-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div><h2>Driver Dashboard</h2><p>Mobile view for delivery drivers</p></div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="driver-stats">
        <div className="driver-stat">
          <span className="big-number">{deliveryData.length}</span>
          <span>Deliveries</span>
        </div>
        <div className="driver-stat connected">
          <span className="big-number">{deliveryData.filter(d => d.nowStatus === 'connected').length}</span>
          <span>Online</span>
        </div>
      </div>

      <div className="driver-map">
        <MapContainer center={center} zoom={2} style={{ height: '350px', borderRadius: '12px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {positions.map((d, i) => (
            <Marker key={i} position={d.position} icon={deliveryIcon}>
              <Popup><strong>{d.unit}</strong><br/>{d.historyCode}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="driver-list">
        {deliveryData.map(item => (
          <div 
            key={item.historyCode} 
            className={`driver-card ${item.nowStatus}`}
            onClick={() => setSelectedDevice(item.historyCode)}
          >
            <div className="driver-card-header">
              <span className="vegetable-name">{item.unit}</span>
              <span className={`status-dot ${item.nowStatus}`}></span>
            </div>
            <div className="driver-card-body">
              <span>{item.historyCode}</span>
              <span>{item.temperature}°C</span>
            </div>
          </div>
        ))}
      </div>

      {selectedDevice && <DeviceGraph deviceCode={selectedDevice} history={history} onClose={() => setSelectedDevice(null)} />}
      
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
