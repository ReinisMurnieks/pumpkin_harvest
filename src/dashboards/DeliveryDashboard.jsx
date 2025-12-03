import React, { useState } from 'react';
import IoTTable from '../components/IoTTable';
import DeviceGraph from '../components/DeviceGraph';
import TransferStation from '../components/TransferStation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export default function DeliveryDashboard({ data, history, onLogout, onRefresh }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showTransferStation, setShowTransferStation] = useState(false);
  const deliveryData = data.filter(d => d.sourceId?.startsWith('DB'));
  
  const stats = {
    total: deliveryData.length,
    connected: deliveryData.filter(d => d.nowStatus === 'connected').length,
    disconnected: deliveryData.filter(d => d.nowStatus === 'disconnected').length,
    avgTemp: deliveryData.length ? (deliveryData.reduce((sum, d) => sum + (parseFloat(d.temperature) || 0), 0) / deliveryData.length).toFixed(1) : 0
  };

  const positions = deliveryData.filter(d => d.gps).map(d => ({ ...d, position: [d.gps.lat, d.gps.lng] }));
  const center = positions.length > 0 ? positions[0].position : [20, 0];

  return (
    <div className="dashboard delivery-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div><h2>Delivery Dashboard</h2><p>Track deliveries in transit across Europe</p></div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card blue"><span className="stat-value">{stats.total}</span><span className="stat-label">In Transit</span></div>
        <div className="stat-card green"><span className="stat-value">{stats.connected}</span><span className="stat-label">Connected</span></div>
        <div className="stat-card red"><span className="stat-value">{stats.disconnected}</span><span className="stat-label">Disconnected</span></div>
        <div className="stat-card orange"><span className="stat-value">{stats.avgTemp}°C</span><span className="stat-label">Avg Temp</span></div>
      </div>

      <div className="dashboard-grid">
        <div className="map-section full-width">
          <h3>Live Delivery Tracking</h3>
          <MapContainer center={center} zoom={4} style={{ height: '400px', borderRadius: '8px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {positions.map((d, i) => (
              <Marker key={i} position={d.position} icon={deliveryIcon}>
                <Popup>
                  <strong>{d.historyCode}</strong><br/>
                  {d.unit}<br/>
                  Status: {d.nowStatus}<br/>
                  Temp: {d.temperature}°C
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="table-section">
        <h3>Delivery List</h3>
        <IoTTable data={deliveryData} onDeviceClick={setSelectedDevice} />
        <button className="transfer-station-btn" onClick={() => setShowTransferStation(true)}>📡 Transfer Station</button>
      </div>

      {selectedDevice && <DeviceGraph deviceCode={selectedDevice} history={history} onClose={() => setSelectedDevice(null)} />}

      {showTransferStation && (
        <TransferStation
          onClose={() => setShowTransferStation(false)}
          onTransfer={onRefresh}
        />
      )}
      
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
