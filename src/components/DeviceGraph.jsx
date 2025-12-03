import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TIME_RANGES = {
  hour: { label: 'Hour', hours: 1 },
  day: { label: 'Day', hours: 24 },
  month: { label: 'Month', hours: 24 * 30 },
  year: { label: 'Year', hours: 24 * 365 }
};

export default function DeviceGraph({ deviceCode, history, onClose }) {
  const [timeRange, setTimeRange] = useState('day');

  const chartData = useMemo(() => {
    const now = new Date();
    const rangeHours = TIME_RANGES[timeRange].hours;
    const cutoff = new Date(now.getTime() - rangeHours * 3600000);

    const deviceHistory = history
      .filter(entry => new Date(entry.timestamp) >= cutoff)
      .map(entry => {
        const device = entry.data.find(d => d.historyCode === deviceCode);
        if (!device) return null;
        
        const date = new Date(entry.timestamp);
        let label;
        if (timeRange === 'hour' || timeRange === 'day') {
          label = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (timeRange === 'month') {
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          label = date.toLocaleDateString('en-US', { month: 'short' });
        }

        return {
          time: label,
          timestamp: entry.timestamp,
          temperature: parseFloat(device.temperature),
          humidity: device.humidity,
          light: device.light,
          gps: device.gps,
          processStatus: device.processStatus,
          sourceId: device.sourceId
        };
      })
      .filter(Boolean)
      .reverse();

    return deviceHistory;
  }, [deviceCode, history, timeRange]);

  const gpsPositions = useMemo(() => {
    return chartData
      .filter(d => d.gps)
      .map(d => ({
        position: [d.gps.lat, d.gps.lng],
        time: d.time,
        timestamp: d.timestamp
      }));
  }, [chartData]);

  const mapCenter = gpsPositions.length > 0 
    ? gpsPositions[gpsPositions.length - 1].position 
    : [55, 20];

  const pathCoordinates = gpsPositions.map(p => p.position);

  return (
    <div className="graph-overlay">
      <div className="graph-modal">
        <div className="graph-header">
          <h2>{deviceCode} History</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="time-range-selector">
          {Object.entries(TIME_RANGES).map(([key, { label }]) => (
            <button
              key={key}
              className={`range-btn ${timeRange === key ? 'active' : ''}`}
              onClick={() => setTimeRange(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {chartData.length === 0 ? (
          <div className="no-data">No data available for this time range</div>
        ) : (
          <div className="charts-container">
            <div className="chart-section">
              <h4>Process Journey</h4>
              <div className="journey-timeline">
                {chartData.map((item, idx) => (
                  <div key={idx} className={`journey-step ${item.processStatus?.toLowerCase()}`}>
                    <span className="journey-time">{item.time}</span>
                    <span className="journey-status">{item.processStatus}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-section">
              <h4>GPS Location History</h4>
              <div className="map-container">
                <MapContainer center={mapCenter} zoom={6} style={{ height: '200px', width: '100%', borderRadius: '8px' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  {pathCoordinates.length > 1 && (
                    <Polyline positions={pathCoordinates} color="#00d4ff" weight={2} />
                  )}
                  {gpsPositions.map((pos, idx) => (
                    <Marker key={idx} position={pos.position}>
                      <Popup>
                        <strong>{pos.time}</strong><br />
                        Lat: {pos.position[0].toFixed(4)}<br />
                        Lng: {pos.position[1].toFixed(4)}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            <div className="chart-section">
              <h4>Temperature (°C)</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#1e1e2f', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="temperature" stroke="#ff7043" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h4>Humidity (%)</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#1e1e2f', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="humidity" stroke="#42a5f5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h4>Light (lux)</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#1e1e2f', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="light" stroke="#ffca28" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
