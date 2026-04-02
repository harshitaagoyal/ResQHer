'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons occasionally breaking in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function SingleIncidentMap({ lat, lng }) {
  const position = [lat, lng];

  return (
    // 🚨 THE FIX: Adding a unique key forces React to fully rebuild the map on re-renders, 
    // completely preventing the "reused by another instance" crash!
    <MapContainer 
      key={`${lat}-${lng}-${new Date().getTime()}`} 
      center={position} 
      zoom={14} 
      scrollWheelZoom={false} 
      className="w-full h-full z-0 relative"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
    </MapContainer>
  );
}