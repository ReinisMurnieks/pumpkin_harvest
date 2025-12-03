import React, { useState } from 'react';
import IoTTable from '../components/IoTTable';
import Filters from '../components/Filters';
import DeviceGraph from '../components/DeviceGraph';
import RegistryPanel from '../components/RegistryPanel';
import SourceMaps from '../components/SourceMaps';
import TransferStation from '../components/TransferStation';

export default function OfficeDashboard({ 
  data, 
  history, 
  selectedTimestamp, 
  onSelectTimestamp,
  onRefresh,
  onClearHistory,
  onRandomize,
  onLogout,
  lastUpdate,
  nextUpdate,
  formatCountdown
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showRegistry, setShowRegistry] = useState(false);
  const [showTransferStation, setShowTransferStation] = useState(false);

  const filteredData = data.filter(item => {
    const matchesSearch = item.historyCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || item.nowStatus === statusFilter;
    // Handle type: prefix for filtering by source type (e.g., "type:GS" for all gardens)
    const matchesSource = !sourceFilter || 
      (sourceFilter.startsWith('type:') 
        ? item.sourceId?.startsWith(sourceFilter.replace('type:', ''))
        : item.sourceId === sourceFilter);
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="dashboard office-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div>
            <h2>Office Dashboard</h2>
            <p>Complete overview of all IoT devices</p>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
        <div className="update-info">
          {lastUpdate && <span>Last update: {lastUpdate.toLocaleTimeString()}</span>}
          <span className="countdown">Next update in: {formatCountdown(nextUpdate)}</span>
          <span className="history-count">{history.length} records stored</span>
          <button className="transfer-station-btn" onClick={() => setShowTransferStation(true)}>📡 Transfer</button>
          <button className="registry-btn" onClick={() => setShowRegistry(true)}>Registry</button>
          <button className="clear-btn" onClick={onClearHistory}>Clear History</button>
          <button className="test-btn" onClick={onRandomize}>Randomize Test</button>
        </div>
      </div>

      <div className="main-content">
        <div className="table-section full-width">
          <Filters
            search={search}
            status={statusFilter}
            sourceId={sourceFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onSourceChange={setSourceFilter}
          />
          <IoTTable data={filteredData} onDeviceClick={setSelectedDevice} />
        </div>
      </div>

      <SourceMaps data={data} />

      {selectedDevice && (
        <DeviceGraph
          deviceCode={selectedDevice}
          history={history}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {showRegistry && (
        <RegistryPanel
          onClose={() => setShowRegistry(false)}
          onUpdate={onRefresh}
        />
      )}

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
