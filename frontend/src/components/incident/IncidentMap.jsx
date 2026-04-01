'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons not showing in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const urgentIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function IncidentMap({ incidents }) {
  // Default center: Dhanbad/Jharkhand coordinates
  const center = [23.6693, 86.1511];

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-inner z-0">
      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Dark Mode Map Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {incidents.map((incident, idx) => {
          // Check if location exists and has lat/lng
          const position = incident.location?.lat && incident.location?.lng 
            ? [incident.location.lat, incident.location.lng] 
            : null;

          if (!position) return null;

          return (
            <Marker 
              key={idx} 
              position={position} 
              icon={incident.severity === 'High' ? urgentIcon : customIcon}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-slate-900">{incident.name}</h4>
                  <p className="text-xs text-slate-600">{incident.current_situation}</p>
                  <div className="mt-2 text-[10px] font-bold text-pink-600 uppercase">
                    Severity: {incident.severity}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}