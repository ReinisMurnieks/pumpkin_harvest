// IoT API Service
// Replace API_BASE_URL with your actual backend URL

const API_BASE_URL = 'http://localhost:3001/api'; // Change this to your backend

// Fetch all device data from API
export async function fetchDeviceData() {
  try {
    const response = await fetch(`${API_BASE_URL}/devices`);
    if (!response.ok) throw new Error('Failed to fetch devices');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Fetch single device data
export async function fetchDevice(deviceId) {
  try {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`);
    if (!response.ok) throw new Error('Failed to fetch device');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Fetch device history
export async function fetchDeviceHistory(deviceId, timeRange = '24h') {
  try {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/history?range=${timeRange}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Register new device
export async function registerDevice(deviceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
    if (!response.ok) throw new Error('Failed to register device');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Update device location/status
export async function updateDevice(deviceId, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update device');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// WebSocket for real-time updates
export function connectWebSocket(onMessage) {
  const ws = new WebSocket('ws://localhost:3001/ws'); // Change to your WebSocket URL
  
  ws.onopen = () => console.log('WebSocket connected');
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  ws.onerror = (error) => console.error('WebSocket error:', error);
  ws.onclose = () => console.log('WebSocket disconnected');
  
  return ws;
}
