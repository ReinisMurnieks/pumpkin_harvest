import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom colored markers for each source type
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33]
});

const icons = {
  GS: createIcon('green'),
  SB: createIcon('orange'),
  DB: createIcon('blue'),
  CL: createIcon('violet')
};

function getIconForSource(sourceId) {
  if (!sourceId) return icons.GS;
  const type = sourceId.split('-')[0];
  return icons[type] || icons.GS;
}

export default function GlobalMap({ data }) {
  const positions = data
    .filter(d => d.gps)
    .map(d => ({
      ...d,
      position: [d.gps.lat, d.gps.lng],
      icon: getIconForSource(d.sourceId)
    }));

  return (
    <div className="global-map-background">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {positions.map((d, i) => (
          <Marker key={i} position={d.position} icon={d.icon}>
            <Popup>
              <strong>{d.historyCode}</strong><br />
              {d.unit}<br />
              {d.sourceName}<br />
              Status: <span style={{ color: d.nowStatus === 'connected' ? '#4caf50' : '#ff5252' }}>
                {d.nowStatus}
              </span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="global-map-overlay" />
    </div>
  );
}
