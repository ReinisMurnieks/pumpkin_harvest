// IoT Device Registry

// Source Registry
export const sourceRegistry = {
  // Garden Spots (10) - Various cities worldwide
  'GS-01': { id: 'GS-01', name: 'Tokyo Farm', description: 'Urban rooftop garden in Shibuya', order: 1, fixedLocation: true, gps: { lat: 35.6595, lng: 139.7004 } },
  'GS-02': { id: 'GS-02', name: 'Amsterdam Garden', description: 'Canal-side greenhouse', order: 1, fixedLocation: true, gps: { lat: 52.3676, lng: 4.9041 } },
  'GS-03': { id: 'GS-03', name: 'Sydney Organic', description: 'Coastal organic farm', order: 1, fixedLocation: true, gps: { lat: -33.8688, lng: 151.2093 } },
  'GS-04': { id: 'GS-04', name: 'São Paulo Horta', description: 'Community urban garden', order: 1, fixedLocation: true, gps: { lat: -23.5505, lng: -46.6333 } },
  'GS-05': { id: 'GS-05', name: 'Paris Jardin', description: 'Rooftop vegetable garden', order: 1, fixedLocation: true, gps: { lat: 48.8566, lng: 2.3522 } },
  'GS-06': { id: 'GS-06', name: 'Dubai Oasis', description: 'Desert hydroponic farm', order: 1, fixedLocation: true, gps: { lat: 25.2048, lng: 55.2708 } },
  'GS-07': { id: 'GS-07', name: 'NYC Urban Farm', description: 'Brooklyn rooftop garden', order: 1, fixedLocation: true, gps: { lat: 40.6782, lng: -73.9442 } },
  'GS-08': { id: 'GS-08', name: 'Singapore Sky', description: 'Vertical farming tower', order: 1, fixedLocation: true, gps: { lat: 1.3521, lng: 103.8198 } },
  'GS-09': { id: 'GS-09', name: 'Cape Town Vineyard', description: 'Organic vegetable plot', order: 1, fixedLocation: true, gps: { lat: -33.9249, lng: 18.4241 } },
  'GS-10': { id: 'GS-10', name: 'Mumbai Green', description: 'Terrace garden collective', order: 1, fixedLocation: true, gps: { lat: 19.0760, lng: 72.8777 } },

  // Storage Boxes (10) - Various cities worldwide
  'SB-01': { id: 'SB-01', name: 'London Cold Store', description: 'Refrigerated warehouse', order: 2, fixedLocation: true, gps: { lat: 51.5074, lng: -0.1278 } },
  'SB-02': { id: 'SB-02', name: 'Toronto Depot', description: 'Climate-controlled facility', order: 2, fixedLocation: true, gps: { lat: 43.6532, lng: -79.3832 } },
  'SB-03': { id: 'SB-03', name: 'Seoul Storage', description: 'Smart cold chain hub', order: 2, fixedLocation: true, gps: { lat: 37.5665, lng: 126.9780 } },
  'SB-04': { id: 'SB-04', name: 'Mexico City Bodega', description: 'Fresh produce warehouse', order: 2, fixedLocation: true, gps: { lat: 19.4326, lng: -99.1332 } },
  'SB-05': { id: 'SB-05', name: 'Barcelona Almacén', description: 'Mediterranean storage', order: 2, fixedLocation: true, gps: { lat: 41.3851, lng: 2.1734 } },
  'SB-06': { id: 'SB-06', name: 'Bangkok Hub', description: 'Tropical cold storage', order: 2, fixedLocation: true, gps: { lat: 13.7563, lng: 100.5018 } },
  'SB-07': { id: 'SB-07', name: 'Chicago Warehouse', description: 'Midwest distribution center', order: 2, fixedLocation: true, gps: { lat: 41.8781, lng: -87.6298 } },
  'SB-08': { id: 'SB-08', name: 'Melbourne Store', description: 'Southern hemisphere depot', order: 2, fixedLocation: true, gps: { lat: -37.8136, lng: 144.9631 } },
  'SB-09': { id: 'SB-09', name: 'Istanbul Depo', description: 'Crossroads cold storage', order: 2, fixedLocation: true, gps: { lat: 41.0082, lng: 28.9784 } },
  'SB-10': { id: 'SB-10', name: 'Buenos Aires Frío', description: 'South American hub', order: 2, fixedLocation: true, gps: { lat: -34.6037, lng: -58.3816 } },

  // Delivery Boxes (10) - Mobile vehicles
  'DB-01': { id: 'DB-01', name: 'Express Van Tokyo', description: 'Electric delivery vehicle', order: 3, fixedLocation: false, gps: null },
  'DB-02': { id: 'DB-02', name: 'Cool Truck Amsterdam', description: 'Refrigerated truck', order: 3, fixedLocation: false, gps: null },
  'DB-03': { id: 'DB-03', name: 'Cargo Bike Paris', description: 'Eco cargo bike fleet', order: 3, fixedLocation: false, gps: null },
  'DB-04': { id: 'DB-04', name: 'Speed Van NYC', description: 'Express delivery van', order: 3, fixedLocation: false, gps: null },
  'DB-05': { id: 'DB-05', name: 'Fresh Truck London', description: 'Standard delivery truck', order: 3, fixedLocation: false, gps: null },
  'DB-06': { id: 'DB-06', name: 'Mini Van Singapore', description: 'Compact delivery vehicle', order: 3, fixedLocation: false, gps: null },
  'DB-07': { id: 'DB-07', name: 'Big Rig Chicago', description: 'Large cargo truck', order: 3, fixedLocation: false, gps: null },
  'DB-08': { id: 'DB-08', name: 'Green Van Sydney', description: 'Eco-friendly van', order: 3, fixedLocation: false, gps: null },
  'DB-09': { id: 'DB-09', name: 'Night Runner Seoul', description: 'Night delivery vehicle', order: 3, fixedLocation: false, gps: null },
  'DB-10': { id: 'DB-10', name: 'Weekend Express Dubai', description: 'Weekend delivery truck', order: 3, fixedLocation: false, gps: null },

  // Clients (10) - Self-service vending machines (9-unit capacity each)
  'CL-01': { id: 'CL-01', name: 'VM Osaka Station', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 34.6937, lng: 135.5023 }, capacity: 9, type: 'vending' },
  'CL-02': { id: 'CL-02', name: 'VM Lyon Centre', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 45.7640, lng: 4.8357 }, capacity: 9, type: 'vending' },
  'CL-03': { id: 'CL-03', name: 'VM Vienna Mall', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 48.2082, lng: 16.3738 }, capacity: 9, type: 'vending' },
  'CL-04': { id: 'CL-04', name: 'VM Berlin Hbf', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 52.5200, lng: 13.4050 }, capacity: 9, type: 'vending' },
  'CL-05': { id: 'CL-05', name: 'VM SF Tech Park', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 37.7749, lng: -122.4194 }, capacity: 9, type: 'vending' },
  'CL-06': { id: 'CL-06', name: 'VM Milano Centrale', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 45.4642, lng: 9.1900 }, capacity: 9, type: 'vending' },
  'CL-07': { id: 'CL-07', name: 'VM London Bridge', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 51.5055, lng: -0.0910 }, capacity: 9, type: 'vending' },
  'CL-08': { id: 'CL-08', name: 'VM Geneva Airport', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 46.2044, lng: 6.1432 }, capacity: 9, type: 'vending' },
  'CL-09': { id: 'CL-09', name: 'VM Stockholm Central', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 59.3293, lng: 18.0686 }, capacity: 9, type: 'vending' },
  'CL-10': { id: 'CL-10', name: 'VM Hong Kong MTR', description: 'Self-service vending machine', order: 4, fixedLocation: true, gps: { lat: 22.3193, lng: 114.1694 }, capacity: 9, type: 'vending' }
};

// Vegetable/Fruit Registry - 9 product types for vending machine slots
export const vegetableRegistry = {
  TOM: { id: 'TOM', name: 'Tomato', emoji: '🍅', slot: 1 },
  CAR: { id: 'CAR', name: 'Carrot', emoji: '🥕', slot: 2 },
  LET: { id: 'LET', name: 'Lettuce', emoji: '🥬', slot: 3 },
  CUC: { id: 'CUC', name: 'Cucumber', emoji: '🥒', slot: 4 },
  PEP: { id: 'PEP', name: 'Pepper', emoji: '🫑', slot: 5 },
  SPI: { id: 'SPI', name: 'Spinach', emoji: '🥗', slot: 6 },
  BRO: { id: 'BRO', name: 'Broccoli', emoji: '🥦', slot: 7 },
  APL: { id: 'APL', name: 'Apple', emoji: '🍎', slot: 8 },
  ORG: { id: 'ORG', name: 'Orange', emoji: '🍊', slot: 9 }
};

// Vending machine slot configuration (which product goes in which slot)
export const vendingSlotConfig = ['TOM', 'CAR', 'LET', 'CUC', 'PEP', 'SPI', 'BRO', 'APL', 'ORG'];

// Device Registry - empty for development (register devices via Registry Dashboard)
// Logic preserved:
// - Devices flow: Garden (GS) → Storage (SB) → Delivery (DB) → Vending Machine (CL)
// - Vending machines have 9 slots, one per product type
// - Each slot: TOM, CAR, LET, CUC, PEP, SPI, BRO, APL, ORG
// - If vending machine is full, delivery goes to nearest storage hub
// - Devices at vending machines (CL) stay there (end point)
export const deviceRegistry = {
  // Empty - register devices via Registry Dashboard or Transfer Station
};

// Registry helper functions
export function getSource(id) {
  return sourceRegistry[id] || null;
}

export function getVegetable(id) {
  return vegetableRegistry[id] || null;
}

export function getDevice(id) {
  return deviceRegistry[id] || null;
}

export function getAllSources() {
  return Object.values(sourceRegistry).sort((a, b) => a.order - b.order);
}

export function getAllVegetables() {
  return Object.values(vegetableRegistry);
}

export function getAllDevices() {
  return Object.values(deviceRegistry);
}

// Get source flow order
export function getSourceFlow() {
  return getAllSources().map(s => s.id);
}

// Get next source in flow
export function getNextSourceId(currentId) {
  const flow = getSourceFlow();
  const currentIndex = flow.indexOf(currentId);
  if (currentIndex < flow.length - 1) {
    return flow[currentIndex + 1];
  }
  return currentId;
}

// Register new device
export function registerDevice(vegetableId) {
  const year = new Date().getFullYear();
  const count = Object.keys(deviceRegistry).length + 1;
  const id = `IOT-${year}-${count.toString().padStart(3, '0')}`;
  
  deviceRegistry[id] = {
    id,
    vegetableId,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  return deviceRegistry[id];
}

// Register new vegetable type
export function registerVegetable(id, name) {
  vegetableRegistry[id] = { id, name };
  return vegetableRegistry[id];
}

// Register new source
export function registerSource(id, name, description, fixedLocation = false, gps = null) {
  const maxOrder = Math.max(...Object.values(sourceRegistry).map(s => s.order), 0);
  sourceRegistry[id] = { 
    id, 
    name, 
    description, 
    order: maxOrder + 1,
    fixedLocation,
    gps
  };
  return sourceRegistry[id];
}
