# IoT Device Integration Guide

## Backend API Requirements

Your backend should expose these endpoints:

### REST API Endpoints

```
GET  /api/devices              - Get all devices
GET  /api/devices/:id          - Get single device
GET  /api/devices/:id/history  - Get device history
POST /api/devices              - Register new device
PUT  /api/devices/:id          - Update device data
```

### Expected Data Format

Each device should send data in this format:

```json
{
  "historyCode": "IOT-2024-001",
  "vegetableId": "TOM",
  "unit": "Tomato",
  "sourceId": "GS",
  "sourceName": "Garden Spot",
  "processStatus": "Garden",
  "nowStatus": "connected",
  "lastUpdate": "2024-12-03T10:30:00Z",
  "temperature": 22.5,
  "humidity": 65,
  "light": 450,
  "gps": {
    "lat": 52.520008,
    "lng": 13.404954
  }
}
```

## Hardware Options

### 1. ESP32 with Sensors (Recommended for Garden/Storage)
- DHT22 (Temperature + Humidity)
- BH1750 (Light sensor)
- NEO-6M GPS module
- WiFi built-in

### 2. Raspberry Pi with GPS Hat (Delivery tracking)
- GPS module for location
- 4G/LTE module for mobile connectivity
- Temperature sensor

### 3. Arduino with GSM Shield
- For remote locations without WiFi

## Example ESP32 Code

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <TinyGPS++.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* serverUrl = "http://your-server.com/api/devices/IOT-2024-001";

DHT dht(4, DHT22);
TinyGPSPlus gps;

void sendData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    StaticJsonDocument<512> doc;
    doc["temperature"] = dht.readTemperature();
    doc["humidity"] = dht.readHumidity();
    doc["light"] = analogRead(34); // Light sensor on pin 34
    doc["gps"]["lat"] = gps.location.lat();
    doc["gps"]["lng"] = gps.location.lng();
    doc["nowStatus"] = "connected";
    doc["lastUpdate"] = getISOTime();
    
    String json;
    serializeJson(doc, json);
    
    int responseCode = http.PUT(json);
    http.end();
  }
}

void loop() {
  sendData();
  delay(60000); // Send every minute
}
```

## Backend Example (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let devices = {}; // In production, use a database

// Get all devices
app.get('/api/devices', (req, res) => {
  res.json(Object.values(devices));
});

// Get single device
app.get('/api/devices/:id', (req, res) => {
  res.json(devices[req.params.id] || null);
});

// Update device (IoT devices call this)
app.put('/api/devices/:id', (req, res) => {
  devices[req.params.id] = {
    ...devices[req.params.id],
    ...req.body,
    historyCode: req.params.id,
    lastUpdate: new Date().toISOString()
  };
  res.json(devices[req.params.id]);
});

// Register new device
app.post('/api/devices', (req, res) => {
  const id = req.body.historyCode;
  devices[id] = req.body;
  res.json(devices[id]);
});

app.listen(3001, () => console.log('API running on port 3001'));
```

## GPS Tracker Options

### Commercial GPS Trackers
- Teltonika FMB920 (vehicle tracking)
- Queclink GL300 (asset tracking)
- These send data via MQTT or HTTP

### DIY GPS Tracker
- ESP32 + NEO-6M GPS + SIM800L (GSM)
- Sends location every X minutes

## Connection Status

Device is "connected" when:
- All sensor data is present (temperature, humidity, light, GPS)
- Last update within expected interval

Device is "disconnected" when:
- Any sensor data is null/missing
- No update received in expected time

## To Enable Real Data

1. Set up your backend API
2. Update `API_BASE_URL` in `src/api/iotService.js`
3. Modify `src/data/iotData.js` to use API instead of mock data
4. Configure your IoT devices to send data to your API
