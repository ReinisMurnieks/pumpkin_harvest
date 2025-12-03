import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored markers
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const gardenIcon = createIcon('green');
const storageIcon = createIcon('orange');
const deliveryIcon = createIcon('blue');
const clientIcon = createIcon('violet');

function SourceMap({ title, devices, icon, color, defaultCenter }) {
  const positions = devices
    .filter(d => d.gps)
    .map(d => ({
      ...d,
      position: [d.gps.lat, d.gps.lng]
    }));

  const center = positions.length > 0 
    ? positions[0].position 
    : defaultCenter;

  return (
    <div className="source-map-card">
      <h3 style={{ color }}>{title}</h3>
      <span className="device-count">{devices.length} devices</span>
      <div className="source-map-container">
        <MapContainer 
          center={center} 
          zoom={2} 
          style={{ height: '200px', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {positions.map((device, idx) => (
            <Marker key={idx} position={device.position} icon={icon}>
              <Popup>
                <strong>{device.historyCode}</strong><br />
                {device.unit}<br />
                Temp: {device.temperature}°C<br />
                Humidity: {device.humidity}%
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default function SourceMaps({ data }) {
  const gardenDevices = data.filter(d => d.sourceId?.startsWith('GS'));
  const storageDevices = data.filter(d => d.sourceId?.startsWith('SB'));
  const deliveryDevices = data.filter(d => d.sourceId?.startsWith('DB'));
  const clientDevices = data.filter(d => d.sourceId?.startsWith('CL'));

  return (
    <div className="source-maps-container">
      <SourceMap 
        title="Garden Spots" 
        devices={gardenDevices} 
        icon={gardenIcon}
        color="#4caf50"
        defaultCenter={[20, 0]}
      />
      <SourceMap 
        title="Storage Boxes" 
        devices={storageDevices} 
        icon={storageIcon}
        color="#ff9800"
        defaultCenter={[20, 0]}
      />
      <SourceMap 
        title="Delivery Boxes" 
        devices={deliveryDevices} 
        icon={deliveryIcon}
        color="#2196f3"
        defaultCenter={[20, 0]}
      />
      <SourceMap 
        title="Clients" 
        devices={clientDevices} 
        icon={clientIcon}
        color="#9c27b0"
        defaultCenter={[20, 0]}
      />
    </div>
  );
}
