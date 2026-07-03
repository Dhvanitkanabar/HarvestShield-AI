"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent({ locations }: { locations: Array<{ lat: number, lng: number, label: string }> }) {
  // Return null on server-side
  if (typeof window === 'undefined') return null;

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, idx) => (
        <Marker key={idx} position={[loc.lat, loc.lng]} icon={icon}>
          <Popup>{loc.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
