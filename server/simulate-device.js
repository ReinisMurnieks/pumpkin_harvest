// Simulate IoT device sending data
// Run: node simulate-device.js

const DEVICE_ID = process.argv[2] || 'IOT-2024-001';
const SERVER_URL = 'http://localhost:3001/api';
const INTERVAL = 5000; // Send data every 5 seconds

console.log(`Simulating device: ${DEVICE_ID}`);
console.log(`Sending to: ${SERVER_URL}`);
console.log('Press Ctrl+C to stop\n');

// Simulate sensor readings with some variation
let baseTemp = 22;
let baseHumidity = 65;
let baseLat = 52.52;
let baseLng = 13.40;

async function sendData() {
  // Add random variation to simulate real sensors
  const temperature = (baseTemp + (Math.random() - 0.5) * 2).toFixed(1);
  const humidity = Math.round(baseHumidity + (Math.random() - 0.5) * 10);
  const light = Math.round(400 + Math.random() * 200);
  
  // Simulate GPS movement for delivery boxes
  baseLat += (Math.random() - 0.5) * 0.001;
  baseLng += (Math.random() - 0.5) * 0.001;
  
  const data = {
    temperature: parseFloat(temperature),
    humidity,
    light,
    gps: {
      lat: parseFloat(baseLat.toFixed(6)),
      lng: parseFloat(baseLng.toFixed(6))
    }
  };

  try {
    const response = await fetch(`${SERVER_URL}/devices/${DEVICE_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`[${new Date().toLocaleTimeString()}] Sent: Temp=${temperature}°C, Humidity=${humidity}%, Light=${light}lux, GPS=(${baseLat.toFixed(4)}, ${baseLng.toFixed(4)})`);
    } else {
      console.error('Failed to send data:', response.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Send data at regular intervals
setInterval(sendData, INTERVAL);
sendData(); // Send immediately on start
