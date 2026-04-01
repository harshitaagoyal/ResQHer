'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Hospital, ShieldAlert, HeartPulse, Pill, Train, Loader2, AlertCircle, Fuel } from 'lucide-react';

export default function NearbyHelpPage() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Automatically detect location when the page loads
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
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to retrieve your location. Please check your browser permissions.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Function to open Google Maps with a specific search query based on the user's GPS
  const searchNearby = (query) => {
    if (location) {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.lat},${location.lng},14z`;
      window.open(url, '_blank');
    }
  };

  const emergencyCategories = [
    {
      title: "Nearest Police Station",
      desc: "Find the closest local law enforcement for immediate assistance.",
      icon: <ShieldAlert size={28} />,
      color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      query: "Police Station"
    },
    {
      title: "Nearest Hospital",
      desc: "Locate emergency medical care and trauma centers.",
      icon: <Hospital size={28} />,
      color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
      query: "Hospital Emergency Room"
    },
    {
      title: "Women's NGOs & Shelters",
      desc: "Safe havens, Sakhi One Stop Centers, and support organizations.",
      icon: <HeartPulse size={28} />,
      color: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800",
      query: "Women NGO shelter One Stop Center"
    },
    {
      title: "24/7 Pharmacies",
      desc: "Find late-night medical supplies or a safe, lit place.",
      icon: <Pill size={28} />,
      color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      query: "24 hour Pharmacy"
    },
    {
      title: "Safe Transit Zones",
      desc: "Major Metro stations or bus terminals with security presence.",
      icon: <Train size={28} />,
      color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      query: "Metro Station Bus Terminal"
    },
    {
      title: "24/7 Petrol Pumps",
      desc: "Well-lit public spaces with CCTV and staff. Safe areas if you are being followed.",
      icon: <Fuel size={28} />,
      color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      query: "24 hour Petrol Pump"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#020617] p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-2">
            <MapPin size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Find Nearby <span className="text-pink-600">Safe Zones</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            We use your device's GPS to instantly locate the closest emergency services, safe spaces, and medical help around you.
          </p>
        </div>

        {/* GPS Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : error ? (
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                <AlertCircle size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                <Navigation size={24} className="fill-current" />
              </div>
            )}
            
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {loading ? "Locating you..." : error ? "Location Access Denied" : "Location Secured"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {loading ? "Please wait while we acquire your GPS coordinates." : 
                 error ? error : 
                 `GPS Active: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
              </p>
            </div>
          </div>
          
          <button 
            onClick={getLocation}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <MapPin size={16} /> Retry GPS
          </button>
        </div>

        {/* Emergency Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyCategories.map((cat, index) => (
            <button
              key={index}
              onClick={() => searchNearby(cat.query)}
              disabled={!location}
              className={`text-left p-6 rounded-2xl border transition-all duration-300 group
                ${!location 
                  ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border ${cat.color} group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{cat.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}