import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3001/api';
const WS_URL = 'ws://localhost:3001';

// Set to true to use real API, false for mock data
export const USE_REAL_API = false;

export function useIoTData() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  // Fetch all devices
  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/devices`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!USE_REAL_API) return;

    let ws;
    let reconnectTimeout;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('Connected to IoT server');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'init':
            setDevices(message.devices);
            setLoading(false);
            break;
          case 'device_update':
            setDevices(prev => 
              prev.map(d => d.historyCode === message.device.historyCode ? message.device : d)
            );
            break;
          case 'device_registered':
            setDevices(prev => [...prev, message.device]);
            break;
          case 'device_deleted':
            setDevices(prev => prev.filter(d => d.historyCode !== message.historyCode));
            break;
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from IoT server');
        setConnected(false);
        // Reconnect after 5 seconds
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  // Initial fetch if not using WebSocket
  useEffect(() => {
    if (USE_REAL_API) {
      fetchDevices();
    }
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    connected,
    refetch: fetchDevices
  };
}

// Fetch device history
export async function fetchDeviceHistory(deviceId, range = '24h') {
  try {
    const response = await fetch(`${API_URL}/devices/${deviceId}/history?range=${range}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (err) {
    console.error('Error fetching history:', err);
    return [];
  }
}

// Register new device
export async function registerDevice(deviceData) {
  try {
    const response = await fetch(`${API_URL}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
    if (!response.ok) throw new Error('Failed to register');
    return await response.json();
  } catch (err) {
    console.error('Error registering device:', err);
    return null;
  }
}

// Update device
export async function updateDevice(deviceId, data) {
  try {
    const response = await fetch(`${API_URL}/devices/${deviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  } catch (err) {
    console.error('Error updating device:', err);
    return null;
  }
}
