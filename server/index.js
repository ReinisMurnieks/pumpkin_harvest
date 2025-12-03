const express = require('express');
const cors = require('cors');
const path = require('path');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (use database in production)
let devices = {};
let deviceHistory = {};

// Initialize with sample devices
const sampleDevices = [
  { historyCode: 'IOT-2024-001', vegetableId: 'TOM', unit: 'Tomato', sourceId: 'GS' },
  { historyCode: 'IOT-2024-002', vegetableId: 'CAR', unit: 'Carrot', sourceId: 'SB' },
  { historyCode: 'IOT-2024-003', vegetableId: 'LET', unit: 'Lettuce', sourceId: 'DB' },
  { historyCode: 'IOT-2024-004', vegetableId: 'CUC', unit: 'Cucumber', sourceId: 'GS' },
];

const sourceNames = { GS: 'Garden Spot', SB: 'Storage Box', DB: 'Delivery Box', CL: 'Client' };
const processStatus = { GS: 'Garden', SB: 'Storage', DB: 'Delivery', CL: 'Client' };

sampleDevices.forEach(d => {
  devices[d.historyCode] = {
    ...d,
    sourceName: sourceNames[d.sourceId],
    processStatus: processStatus[d.sourceId],
    nowStatus: 'connected',
    lastUpdate: new Date().toISOString(),
    temperature: 22.5,
    humidity: 65,
    light: 450,
    gps: { lat: 52.52 + Math.random() * 0.1, lng: 13.40 + Math.random() * 0.1 }
  };
  deviceHistory[d.historyCode] = [];
});

// Broadcast to all WebSocket clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

// Check connection status based on data
function checkConnectionStatus(data) {
  if (data.temperature === null || data.humidity === null || 
      data.light === null || !data.gps) {
    return 'disconnected';
  }
  return 'connected';
}


// REST API Endpoints

// Get all devices
app.get('/api/devices', (req, res) => {
  res.json(Object.values(devices));
});

// Get single device
app.get('/api/devices/:id', (req, res) => {
  const device = devices[req.params.id];
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// Get device history
app.get('/api/devices/:id/history', (req, res) => {
  const history = deviceHistory[req.params.id] || [];
  const range = req.query.range || '24h';
  
  // Filter by time range
  const now = Date.now();
  const ranges = {
    '1h': 3600000,
    '24h': 86400000,
    '7d': 604800000,
    '30d': 2592000000
  };
  const cutoff = now - (ranges[range] || ranges['24h']);
  
  const filtered = history.filter(h => new Date(h.timestamp).getTime() >= cutoff);
  res.json(filtered);
});

// Register new device
app.post('/api/devices', (req, res) => {
  const { historyCode, vegetableId, unit, sourceId } = req.body;
  
  if (!historyCode) {
    return res.status(400).json({ error: 'historyCode required' });
  }
  
  devices[historyCode] = {
    historyCode,
    vegetableId: vegetableId || 'UNK',
    unit: unit || 'Unknown',
    sourceId: sourceId || 'GS',
    sourceName: sourceNames[sourceId] || 'Garden Spot',
    processStatus: processStatus[sourceId] || 'Garden',
    nowStatus: 'disconnected',
    lastUpdate: new Date().toISOString(),
    temperature: null,
    humidity: null,
    light: null,
    gps: null
  };
  
  deviceHistory[historyCode] = [];
  
  broadcast({ type: 'device_registered', device: devices[historyCode] });
  res.json(devices[historyCode]);
});

// Update device data (IoT devices call this endpoint)
app.put('/api/devices/:id', (req, res) => {
  const id = req.params.id;
  
  if (!devices[id]) {
    return res.status(404).json({ error: 'Device not found. Register first.' });
  }
  
  const { temperature, humidity, light, gps, sourceId } = req.body;
  const now = new Date().toISOString();
  
  // Update device
  devices[id] = {
    ...devices[id],
    temperature: temperature ?? devices[id].temperature,
    humidity: humidity ?? devices[id].humidity,
    light: light ?? devices[id].light,
    gps: gps || devices[id].gps,
    sourceId: sourceId || devices[id].sourceId,
    sourceName: sourceNames[sourceId] || devices[id].sourceName,
    processStatus: processStatus[sourceId] || devices[id].processStatus,
    lastUpdate: now,
    nowStatus: checkConnectionStatus({
      temperature: temperature ?? devices[id].temperature,
      humidity: humidity ?? devices[id].humidity,
      light: light ?? devices[id].light,
      gps: gps || devices[id].gps
    })
  };
  
  // Save to history
  deviceHistory[id].push({
    timestamp: now,
    data: { ...devices[id] }
  });
  
  // Keep only last 1000 entries per device
  if (deviceHistory[id].length > 1000) {
    deviceHistory[id] = deviceHistory[id].slice(-1000);
  }
  
  // Broadcast update to all connected dashboards
  broadcast({ type: 'device_update', device: devices[id] });
  
  res.json(devices[id]);
});

// Delete device
app.delete('/api/devices/:id', (req, res) => {
  const id = req.params.id;
  if (devices[id]) {
    delete devices[id];
    delete deviceHistory[id];
    broadcast({ type: 'device_deleted', historyCode: id });
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Dashboard connected via WebSocket');
  
  // Send current state on connect
  ws.send(JSON.stringify({ type: 'init', devices: Object.values(devices) }));
  
  ws.on('close', () => {
    console.log('Dashboard disconnected');
  });
});

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           PUMPKIN HARVEST IoT Server                       ║
╠════════════════════════════════════════════════════════════╣
║  REST API:    http://localhost:${PORT}/api/devices            ║
║  WebSocket:   ws://localhost:${PORT}                          ║
╠════════════════════════════════════════════════════════════╣
║  Endpoints:                                                ║
║    GET    /api/devices          - Get all devices          ║
║    GET    /api/devices/:id      - Get single device        ║
║    POST   /api/devices          - Register new device      ║
║    PUT    /api/devices/:id      - Update device data       ║
║    DELETE /api/devices/:id      - Delete device            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
