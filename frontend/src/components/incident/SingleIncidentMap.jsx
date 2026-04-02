'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Red pin icon for the emergency location
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function SingleIncidentMap({ lat, lng }) {
  if (!lat || !lng) return null;

  const position = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false} // Hides the +/- buttons for a cleaner look
      dragging={false}    // Prevents accidental scrolling on the map
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={position} icon={customIcon} />
    </MapContainer>
  );
}