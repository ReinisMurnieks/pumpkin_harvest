import {
  getSource,
  getVegetable,
  getAllDevices,
  sourceRegistry,
  vegetableRegistry
} from './registry';

// Re-export registry items
export { sourceRegistry as sources, vegetableRegistry as vegetables };
export * from './registry';

// Get all sources by type prefix
function getSourcesByType(prefix) {
  return Object.keys(sourceRegistry).filter(id => id.startsWith(prefix));
}

// Get random source of a specific type
function getRandomSourceOfType(prefix) {
  const sources = getSourcesByType(prefix);
  return sources[Math.floor(Math.random() * sources.length)];
}

// Get source type from ID (e.g., 'GS-01' -> 'GS')
function getSourceType(sourceId) {
  if (!sourceId) return null;
  return sourceId.split('-')[0];
}

// Generate random sensor values (10% chance of data loss = null)
function randomLight() {
  if (Math.random() < 0.1) return null; // 10% data loss
  return Math.floor(Math.random() * 1000);
}

function randomHumidity() {
  if (Math.random() < 0.1) return null; // 10% data loss
  return Math.floor(Math.random() * 60) + 30;
}

function randomTemperature() {
  if (Math.random() < 0.1) return null; // 10% data loss
  return (Math.random() * 25 + 15).toFixed(1);
}

// Check if device has any data loss
function hasDataLoss(light, humidity, temperature, gps) {
  return light === null || humidity === null || temperature === null || gps === null;
}

// Global delivery zones for mobile delivery boxes
const deliveryZones = [
  { name: 'Europe', latMin: 35.0, latMax: 60.0, lngMin: -10.0, lngMax: 25.0 },
  { name: 'North America', latMin: 25.0, latMax: 50.0, lngMin: -125.0, lngMax: -70.0 },
  { name: 'Asia Pacific', latMin: 10.0, latMax: 45.0, lngMin: 100.0, lngMax: 145.0 },
  { name: 'South America', latMin: -35.0, latMax: 5.0, lngMin: -75.0, lngMax: -35.0 },
  { name: 'Australia', latMin: -40.0, latMax: -10.0, lngMin: 110.0, lngMax: 155.0 }
];

function randomGPS() {
  // Pick random global zone
  const zone = deliveryZones[Math.floor(Math.random() * deliveryZones.length)];
  const lat = (Math.random() * (zone.latMax - zone.latMin) + zone.latMin).toFixed(6);
  const lng = (Math.random() * (zone.lngMax - zone.lngMin) + zone.lngMin).toFixed(6);
  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}

// Process status based on source type
function getProcessStatus(sourceId) {
  const type = getSourceType(sourceId);
  const statusMap = {
    GS: 'Garden',
    SB: 'Storage',
    DB: 'Delivery',
    CL: 'Client'
  };
  return statusMap[type] || 'Unknown';
}

// Track current source for each device
let deviceSources = {};

// Initialize device sources from previous data or device registry
export function initDeviceSources(previousData) {
  if (previousData && previousData.length > 0) {
    previousData.forEach(device => {
      deviceSources[device.historyCode] = device.sourceId;
    });
  } else {
    // Initialize devices with their assigned sourceId from registry
    getAllDevices().forEach(device => {
      deviceSources[device.id] = device.sourceId || getRandomSourceOfType('GS');
    });
  }
}

// Reset and randomize all device sources for testing
export function randomizeDeviceSources() {
  const types = ['GS', 'SB', 'DB', 'CL'];
  deviceSources = {};
  getAllDevices().forEach(device => {
    const randomType = types[Math.floor(Math.random() * types.length)];
    deviceSources[device.id] = getRandomSourceOfType(randomType);
  });
}

// Get current source for a device
export function getDeviceSource(deviceId) {
  return deviceSources[deviceId] || null;
}

// Get count of devices at a source
export function getDeviceCountAtSource(sourceId) {
  return Object.values(deviceSources).filter(id => id === sourceId).length;
}

// Check if source has capacity (vending machines have 9 slots)
export function hasCapacity(sourceId) {
  const source = getSource(sourceId);
  if (!source) return false;
  
  // Vending machines (CL-*) have 9-slot capacity
  if (sourceId.startsWith('CL')) {
    const capacity = source.capacity || 9;
    const currentCount = getDeviceCountAtSource(sourceId);
    return currentCount < capacity;
  }
  
  // Other sources have unlimited capacity
  return true;
}

// Transfer device to a new source
export function transferDevice(deviceId, newSourceId) {
  if (!deviceId || !newSourceId) return false;
  const source = getSource(newSourceId);
  if (!source) return false;
  
  // Check capacity for vending machines
  if (newSourceId.startsWith('CL')) {
    // Don't count current device if it's already at this source
    const currentSource = deviceSources[deviceId];
    if (currentSource !== newSourceId && !hasCapacity(newSourceId)) {
      return false; // Vending machine is full
    }
  }
  
  deviceSources[deviceId] = newSourceId;
  return true;
}

// Get all sources grouped by type
export function getSourcesByTypeGrouped() {
  return {
    gardens: getSourcesByType('GS').map(id => getSource(id)),
    storage: getSourcesByType('SB').map(id => getSource(id)),
    delivery: getSourcesByType('DB').map(id => getSource(id)),
    clients: getSourcesByType('CL').map(id => getSource(id))
  };
}

// Calculate distance between two GPS points (Haversine formula)
function calculateDistance(gps1, gps2) {
  if (!gps1 || !gps2) return Infinity;
  
  const R = 6371; // Earth's radius in km
  const dLat = (gps2.lat - gps1.lat) * Math.PI / 180;
  const dLng = (gps2.lng - gps1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(gps1.lat * Math.PI / 180) * Math.cos(gps2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest storage hub to a given GPS location
export function findNearestStorage(gps) {
  const storageIds = getSourcesByType('SB');
  let nearestId = null;
  let minDistance = Infinity;
  
  storageIds.forEach(id => {
    const storage = getSource(id);
    if (storage?.gps) {
      const distance = calculateDistance(gps, storage.gps);
      if (distance < minDistance) {
        minDistance = distance;
        nearestId = id;
      }
    }
  });
  
  return nearestId || getRandomSourceOfType('SB');
}

// Find nearest vending machine with capacity to a given GPS location
export function findNearestAvailableVending(gps) {
  const clientIds = getSourcesByType('CL');
  let nearestId = null;
  let minDistance = Infinity;
  
  clientIds.forEach(id => {
    if (hasCapacity(id)) {
      const client = getSource(id);
      if (client?.gps) {
        const distance = calculateDistance(gps, client.gps);
        if (distance < minDistance) {
          minDistance = distance;
          nearestId = id;
        }
      }
    }
  });
  
  return nearestId; // Returns null if all vending machines are full
}

// Export helper for getting sources by type
export { getSourcesByType, getSourceType };

// Generate IoT data for all registered devices
export function generateIotData(previousData) {
  const now = new Date().toISOString();
  
  if (Object.keys(deviceSources).length === 0) {
    initDeviceSources(previousData);
  }
  
  return getAllDevices().map(device => {
    const currentSourceId = deviceSources[device.id] || getRandomSourceOfType('GS');
    const currentType = getSourceType(currentSourceId);
    
    // 30% chance to move from current source
    // Flow: GS -> SB -> DB -> SB or CL
    let newSourceId = currentSourceId;
    if (Math.random() < 0.3) {
      switch (currentType) {
        case 'GS': // Garden -> random Storage Box
          newSourceId = getRandomSourceOfType('SB');
          break;
        case 'SB': // Storage Box -> random Delivery Box
          newSourceId = getRandomSourceOfType('DB');
          break;
        case 'DB': // Delivery Box -> Storage Box OR Vending Machine (if has capacity)
          // Get current delivery location
          const deliverySource = getSource(currentSourceId);
          const deliveryGps = deliverySource?.gps || randomGPS();
          
          if (Math.random() < 0.5) {
            // Go to nearest storage hub
            newSourceId = findNearestStorage(deliveryGps);
          } else {
            // Try to find nearest vending machine with capacity
            const nearestVending = findNearestAvailableVending(deliveryGps);
            if (nearestVending) {
              newSourceId = nearestVending;
            } else {
              // All vending machines full, go to nearest storage hub
              newSourceId = findNearestStorage(deliveryGps);
            }
          }
          break;
        case 'CL': // Client (vending machine) is end point - items stay until sold/removed
          break;
      }
    }
    
    deviceSources[device.id] = newSourceId;
    
    const source = getSource(newSourceId);
    const vegetable = getVegetable(device.vegetableId);
    
    // Generate sensor data
    const light = randomLight();
    const humidity = randomHumidity();
    const temperature = randomTemperature();
    const gps = source?.fixedLocation ? source.gps : randomGPS();
    
    // Disconnected if any data loss
    const nowStatus = hasDataLoss(light, humidity, temperature, gps) ? 'disconnected' : 'connected';
    
    return {
      historyCode: device.id,
      vegetableId: device.vegetableId,
      unit: vegetable?.name || 'Unknown',
      sourceId: newSourceId,
      sourceName: source?.name || 'Unknown',
      processStatus: getProcessStatus(newSourceId),
      nowStatus,
      lastUpdate: now,
      light,
      humidity,
      temperature,
      gps
    };
  });
}
