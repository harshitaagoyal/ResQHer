'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ShieldAlert, Hospital, HeartPulse, Pill, Train, Fuel } from 'lucide-react';
import GpsStatusCard from '@/components/nearbyhelp/GpsStatusCard';
import HelpCategoryCard from '@/components/nearbyhelp/HelpCategoryCard';

export default function NearbyHelpPage() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve location. Please check permissions.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const searchNearby = (query) => {
    if (location) {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.lat},${location.lng},14z`;
      window.open(url, '_blank');
    }
  };

  const emergencyCategories = [
    { title: "Nearest Police Station", desc: "Find law enforcement for immediate assistance.", icon: <ShieldAlert size={28} />, color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800", query: "Police Station" },
    { title: "Nearest Hospital", desc: "Locate emergency medical care and trauma centers.", icon: <Hospital size={28} />, color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800", query: "Hospital Emergency Room" },
    { title: "Women's NGOs & Shelters", desc: "Safe havens and Sakhi One Stop Centers.", icon: <HeartPulse size={28} />, color: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800", query: "Women NGO shelter" },
    { title: "24/7 Pharmacies", desc: "Find medical supplies or a safe, lit place.", icon: <Pill size={28} />, color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", query: "24 hour Pharmacy" },
    { title: "Safe Transit Zones", desc: "Major stations with security presence.", icon: <Train size={28} />, color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800", query: "Metro Station Bus Terminal" },
    { title: "24/7 Petrol Pumps", desc: "Well-lit public spaces with CCTV presence.", icon: <Fuel size={28} />, color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800", query: "24 hour Petrol Pump" }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#020617] p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-2">
            <MapPin size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Find Nearby <span className="text-pink-600">Safe Zones</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Instantly locate emergency services and safe spaces using your GPS.
          </p>
        </div>

        <GpsStatusCard 
          loading={loading} 
          error={error} 
          location={location} 
          onRetry={getLocation} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyCategories.map((cat, i) => (
            <HelpCategoryCard 
              key={i} 
              category={cat} 
              onClick={() => searchNearby(cat.query)} 
              disabled={!location} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}