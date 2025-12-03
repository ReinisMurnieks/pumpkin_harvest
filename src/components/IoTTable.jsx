import React from 'react';
import StatusBadge from './StatusBadge';

const processStatusClass = {
  'Garden': 'process-garden',
  'Storage': 'process-storage',
  'Delivery': 'process-delivery',
  'Client': 'process-client'
};

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
}

export default function IoTTable({ data, onDeviceClick }) {
  if (data.length === 0) {
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th rowSpan="2">IoT History Code</th>
              <th rowSpan="2">Process Status</th>
              <th rowSpan="2">Vegetable</th>
              <th rowSpan="2">Source</th>
              <th colSpan="3" className="grouped-header">IoT Now Information</th>
              <th rowSpan="2">IoT Now Status</th>
              <th rowSpan="2">GPS Location</th>
              <th rowSpan="2">Last Status Update</th>
            </tr>
            <tr>
              <th className="sub-header">Temp</th>
              <th className="sub-header">Humidity</th>
              <th className="sub-header">Light</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="10" className="empty-state">
                No IoT records found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th rowSpan="2">IoT History Code</th>
            <th rowSpan="2">Process Status</th>
            <th rowSpan="2">Vegetable</th>
            <th rowSpan="2">Source</th>
            <th colSpan="3" className="grouped-header">IoT Now Information</th>
            <th rowSpan="2">IoT Now Status</th>
            <th rowSpan="2">GPS Location</th>
            <th rowSpan="2">Last Status Update</th>
          </tr>
          <tr>
            <th className="sub-header">Temp</th>
            <th className="sub-header">Humidity</th>
            <th className="sub-header">Light</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const { date, time } = formatDateTime(item.lastUpdate);
            return (
              <tr key={item.historyCode || index}>
                <td className="iot-code clickable" onClick={() => onDeviceClick?.(item.historyCode)}>
                  {item.historyCode}
                </td>
                <td>
                  <span className={`process-badge ${processStatusClass[item.processStatus] || ''}`}>
                    {item.processStatus}
                  </span>
                </td>
                <td><span className="unit-badge">{item.unit}</span></td>
                <td className="source-info">
                  <span className="source-id">{item.sourceId}</span>
                  <span className="source-name">{item.sourceName}</span>
                </td>
                <td className="sensor-value temp">{item.temperature}°C</td>
                <td className="sensor-value humidity">{item.humidity}%</td>
                <td className="sensor-value light">{item.light} lux</td>
                <td><StatusBadge status={item.nowStatus} /></td>
                <td className="gps-value">
                  {item.gps && (
                    <a 
                      href={`https://maps.google.com/?q=${item.gps.lat},${item.gps.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.gps.lat}, {item.gps.lng}
                    </a>
                  )}
                </td>
                <td className="timestamp">
                  <span className="date">{date}</span>
                  <span className="time">{time}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
