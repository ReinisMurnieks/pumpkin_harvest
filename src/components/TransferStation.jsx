import { useState, useRef, useEffect } from 'react';
import {
  transferDevice,
  getSourcesByTypeGrouped,
  getSourceType,
  getSource,
  getDeviceCountAtSource,
  hasCapacity
} from '../data/iotData';
import { getDevice, getVegetable } from '../data/registry';

export default function TransferStation({ currentSourceId, onClose, onTransfer }) {
  const [mode, setMode] = useState('serial'); // 'serial' or 'qr'
  const [serialCode, setSerialCode] = useState('');
  const [foundDevice, setFoundDevice] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef(null);

  const sources = getSourcesByTypeGrouped();
  const currentSource = getSource(currentSourceId);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleSerialLookup = () => {
    setError('');
    setSuccess('');
    setFoundDevice(null);

    if (!serialCode.trim()) {
      setError('Please enter a device serial code');
      return;
    }

    const device = getDevice(serialCode.trim().toUpperCase());
    if (!device) {
      setError(`Device "${serialCode}" not found in registry`);
      return;
    }

    const vegetable = getVegetable(device.vegetableId);
    setFoundDevice({
      ...device,
      vegetableName: vegetable?.name || 'Unknown'
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSerialLookup();
    }
  };

  const handleTransfer = () => {
    if (!foundDevice || !selectedDestination) return;

    // Check capacity for vending machines
    if (selectedDestination.startsWith('CL') && !hasCapacity(selectedDestination)) {
      const destSource = getSource(selectedDestination);
      setError(`❌ ${destSource?.name || selectedDestination} is full (9/9 slots)`);
      return;
    }

    const result = transferDevice(foundDevice.id, selectedDestination);
    if (result) {
      const destSource = getSource(selectedDestination);
      setSuccess(`✓ ${foundDevice.id} transferred to ${destSource?.name || selectedDestination}`);
      setFoundDevice(null);
      setSerialCode('');
      setSelectedDestination('');
      onTransfer?.();
      
      // Auto-focus back to input for next scan
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      setError('Transfer failed. Destination may be full.');
    }
  };

  const flowSteps = [
    { type: 'GS', label: 'Garden', color: '#4caf50', icon: '🌱', sources: sources.gardens },
    { type: 'SB', label: 'Storage', color: '#ff9800', icon: '📦', sources: sources.storage },
    { type: 'DB', label: 'Delivery', color: '#2196f3', icon: '🚚', sources: sources.delivery },
    { type: 'CL', label: 'Vending Machine', color: '#9c27b0', icon: '🏪', sources: sources.clients }
  ];

  return (
    <div className="transfer-station-overlay">
      <div className="transfer-station-modal">
        <div className="transfer-station-header">
          <div>
            <h2>📡 Transfer Station</h2>
            {currentSource && (
              <p className="station-location">
                Station: <strong>{currentSource.name}</strong> ({currentSourceId})
              </p>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="transfer-mode-tabs">
          <button
            className={`mode-tab ${mode === 'serial' ? 'active' : ''}`}
            onClick={() => setMode('serial')}
          >
            ⌨️ Serial Code
          </button>
          <button
            className={`mode-tab ${mode === 'qr' ? 'active' : ''}`}
            onClick={() => setMode('qr')}
          >
            📷 QR Scanner
          </button>
        </div>

        <div className="transfer-station-content">
          {mode === 'serial' ? (
            <div className="serial-input-section">
              <label>Enter Device Serial Code:</label>
              <div className="serial-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g., IOT-2025-001"
                  value={serialCode}
                  onChange={(e) => setSerialCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="serial-input"
                />
                <button className="lookup-btn" onClick={handleSerialLookup}>
                  Search
                </button>
              </div>
            </div>
          ) : (
            <div className="qr-scanner-section">
              <div className="qr-placeholder">
                <div className="qr-frame">
                  <span className="qr-icon">📷</span>
                  <p>Point camera at QR code</p>
                  <p className="qr-hint">QR scanning requires camera access</p>
                </div>
              </div>
              <p className="qr-manual-hint">
                Or enter serial code manually:
              </p>
              <div className="serial-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g., IOT-2025-001"
                  value={serialCode}
                  onChange={(e) => setSerialCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="serial-input"
                />
                <button className="lookup-btn" onClick={handleSerialLookup}>
                  Search
                </button>
              </div>
            </div>
          )}

          {error && <div className="transfer-error">{error}</div>}
          {success && <div className="transfer-success">{success}</div>}

          {foundDevice && (
            <div className="found-device-card">
              <div className="device-found-header">
                <span className="checkmark">✓</span>
                <span>Device Found</span>
              </div>
              <div className="device-details">
                <div className="detail-row">
                  <span className="detail-label">Serial:</span>
                  <span className="detail-value code">{foundDevice.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Product:</span>
                  <span className="detail-value">{foundDevice.vegetableName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Current Source:</span>
                  <span className="detail-value">{foundDevice.sourceId || 'Not assigned'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Registered:</span>
                  <span className="detail-value">{foundDevice.createdAt}</span>
                </div>
              </div>

              <div className="destination-selector">
                <h4>Select Destination:</h4>
                <div className="destination-groups">
                  {flowSteps.map(step => (
                    <div key={step.type} className="dest-group">
                      <div className="dest-group-header" style={{ color: step.color }}>
                        {step.icon} {step.label}
                      </div>
                      <select
                        className="dest-select"
                        value={selectedDestination.startsWith(step.type) ? selectedDestination : ''}
                        onChange={(e) => setSelectedDestination(e.target.value)}
                        style={{ borderColor: step.color }}
                      >
                        <option value="">Select {step.label}...</option>
                        {step.sources.map(src => {
                          const isVending = src.id.startsWith('CL');
                          const count = isVending ? getDeviceCountAtSource(src.id) : null;
                          const capacity = src.capacity || 9;
                          const isFull = isVending && count >= capacity;
                          return (
                            <option key={src.id} value={src.id} disabled={isFull}>
                              {src.id} - {src.name} {isVending ? `(${count}/${capacity})` : ''} {isFull ? '- FULL' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="confirm-transfer-btn"
                onClick={handleTransfer}
                disabled={!selectedDestination}
              >
                Confirm Transfer
              </button>
            </div>
          )}
        </div>

        <div className="transfer-station-footer">
          <div className="recent-transfers">
            <span className="footer-hint">💡 Tip: Use a barcode scanner for faster input</span>
          </div>
        </div>
      </div>
    </div>
  );
}
