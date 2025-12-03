import React from 'react';
import { getAllSources } from '../data/registry';

// Group sources by type
const sourceTypes = [
  { prefix: 'GS', label: '🌱 All Gardens' },
  { prefix: 'SB', label: '📦 All Storage' },
  { prefix: 'DB', label: '🚚 All Delivery' },
  { prefix: 'CL', label: '👤 All Clients' }
];

export default function Filters({ search, status, sourceId, onSearchChange, onStatusChange, onSourceChange }) {
  const allSources = getAllSources();
  
  // Group sources by type
  const gardenSources = allSources.filter(s => s.id.startsWith('GS'));
  const storageSources = allSources.filter(s => s.id.startsWith('SB'));
  const deliverySources = allSources.filter(s => s.id.startsWith('DB'));
  const clientSources = allSources.filter(s => s.id.startsWith('CL'));

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by IoT code..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="connected">Connected</option>
        <option value="disconnected">Disconnected</option>
      </select>
      <select value={sourceId} onChange={(e) => onSourceChange(e.target.value)}>
        <option value="">All Sources</option>
        {sourceTypes.map(type => (
          <option key={type.prefix} value={`type:${type.prefix}`}>{type.label}</option>
        ))}
        <optgroup label="🌱 Gardens">
          {gardenSources.map(source => (
            <option key={source.id} value={source.id}>{source.name}</option>
          ))}
        </optgroup>
        <optgroup label="📦 Storage">
          {storageSources.map(source => (
            <option key={source.id} value={source.id}>{source.name}</option>
          ))}
        </optgroup>
        <optgroup label="🚚 Delivery">
          {deliverySources.map(source => (
            <option key={source.id} value={source.id}>{source.name}</option>
          ))}
        </optgroup>
        <optgroup label="👤 Clients">
          {clientSources.map(source => (
            <option key={source.id} value={source.id}>{source.name}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
