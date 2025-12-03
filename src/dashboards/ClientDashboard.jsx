import { useState } from 'react';
import DeviceGraph from '../components/DeviceGraph';
import TransferStation from '../components/TransferStation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getAllSources, vendingSlotConfig, getVegetable } from '../data/registry';

const clientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const VENDING_CAPACITY = 9;

// Get slot configuration with product info
const slotProducts = vendingSlotConfig.map(vegId => getVegetable(vegId));

export default function ClientDashboard({ data, history, onLogout, onRefresh }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showTransferStation, setShowTransferStation] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  
  const clientData = data.filter(d => d.sourceId?.startsWith('CL'));
  const vendingMachines = getAllSources().filter(s => s.id.startsWith('CL'));
  
  // Group devices by vending machine and organize by product slot
  const machineInventory = {};
  vendingMachines.forEach(vm => {
    // Create slot array for each product type
    const slots = vendingSlotConfig.map(vegId => {
      const device = clientData.find(d => d.sourceId === vm.id && d.vegetableId === vegId);
      return device || null;
    });
    machineInventory[vm.id] = {
      slots,
      items: clientData.filter(d => d.sourceId === vm.id)
    };
  });

  const stats = {
    totalMachines: vendingMachines.length,
    totalItems: clientData.length,
    totalCapacity: vendingMachines.length * VENDING_CAPACITY,
    connected: clientData.filter(d => d.nowStatus === 'connected').length
  };

  const positions = vendingMachines.filter(vm => vm.gps).map(vm => ({
    ...vm,
    position: [vm.gps.lat, vm.gps.lng],
    itemCount: machineInventory[vm.id]?.items?.length || 0
  }));
  const center = positions.length > 0 ? positions[0].position : [20, 0];

  return (
    <div className="dashboard client-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div><h2>🏪 Vending Machines</h2><p>Self-service fresh produce vending machines (9 slots each)</p></div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card purple"><span className="stat-value">{stats.totalMachines}</span><span className="stat-label">Machines</span></div>
        <div className="stat-card blue"><span className="stat-value">{stats.totalItems}/{stats.totalCapacity}</span><span className="stat-label">Items Stocked</span></div>
        <div className="stat-card green"><span className="stat-value">{stats.connected}</span><span className="stat-label">Connected</span></div>
        <div className="stat-card orange"><span className="stat-value">{Math.round((stats.totalItems / stats.totalCapacity) * 100)}%</span><span className="stat-label">Fill Rate</span></div>
      </div>

      <div className="vending-machines-grid">
        {vendingMachines.map(vm => {
          const inventory = machineInventory[vm.id] || { slots: [], items: [] };
          const { slots, items } = inventory;
          const fillPercent = Math.round((items.length / VENDING_CAPACITY) * 100);
          
          return (
            <div 
              key={vm.id} 
              className={`vending-machine-card ${selectedMachine === vm.id ? 'selected' : ''}`}
              onClick={() => setSelectedMachine(selectedMachine === vm.id ? null : vm.id)}
            >
              <div className="vm-header">
                <span className="vm-id">{vm.id}</span>
                <span className={`vm-status ${items.length === 0 ? 'empty' : items.length < 3 ? 'low' : 'ok'}`}>
                  {items.length === 0 ? 'Empty' : items.length < 3 ? 'Low' : 'OK'}
                </span>
              </div>
              <div className="vm-name">{vm.name}</div>
              <div className="vm-slots">
                {slots.map((slot, idx) => {
                  const product = slotProducts[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`vm-slot ${slot ? 'filled' : 'empty'}`}
                      onClick={(e) => { e.stopPropagation(); if (slot) setSelectedDevice(slot.historyCode); }}
                      title={slot ? `${slot.historyCode} - ${product?.name}` : `Slot ${idx + 1}: ${product?.name} - Empty`}
                    >
                      {slot ? (
                        <span className="slot-content">{product?.emoji || product?.name?.charAt(0)}</span>
                      ) : (
                        <span className="slot-empty-product">{product?.emoji || '—'}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="vm-footer">
                <div className="vm-fill-bar">
                  <div className="vm-fill-progress" style={{ width: `${fillPercent}%` }}></div>
                </div>
                <span className="vm-fill-text">{items.length}/{VENDING_CAPACITY}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="map-section full-width">
          <h3>Vending Machine Locations</h3>
          <MapContainer center={center} zoom={2} style={{ height: '300px', borderRadius: '8px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {positions.map((vm, i) => (
              <Marker key={i} position={vm.position} icon={clientIcon}>
                <Popup>
                  <strong>{vm.name}</strong><br/>
                  {vm.id}<br/>
                  Items: {vm.itemCount}/{VENDING_CAPACITY}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="transfer-section">
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
