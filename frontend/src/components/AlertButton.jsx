'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Radio } from 'lucide-react';
import axios from 'axios'; // Make sure axios is installed

export default function AlertButton() {
  const { user } = useUser();
  const [isAlerting, setIsAlerting] = useState(false);

  const triggerAlert = () => {
    if (!user) {
      alert("You must be logged in to use the Alert Contacts feature.");
      return;
    }

    const savedContacts = user.unsafeMetadata?.emergencyContacts || [];
    if (savedContacts.length === 0) {
      alert("Please add at least one contact in your Trust Circle first!");
      window.location.href = '/emergency-contacts'; 
      return;
    }

    setIsAlerting(true);
    
    // 1. Get Location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // 🚨 2. ACTUALLY SEND DATA TO THE BACKEND API 🚨
          await axios.post('/api/alert', {
            contacts: savedContacts,
            latitude: latitude,
            longitude: longitude,
            userName: user.fullName || "A ResQHer User"
          });

          alert("🚨 Real Alert Emails sent successfully to your Trust Circle!");
        } catch (error) {
          console.error("API Error:", error);
          alert("Failed to send alerts. Please try again.");
        } finally {
          setIsAlerting(false);
        }
      },
      (error) => {
        alert("Failed to get your location. Please enable GPS.");
        setIsAlerting(false);
      }
    );
  };

  return (
    <button 
      onClick={triggerAlert}
      disabled={isAlerting}
      className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all font-bold text-sm sm:text-base disabled:opacity-50"
      title="Alert Trust Circle"
    >
      <Radio size={18} className={isAlerting ? 'animate-ping text-red-600' : ''} />
      <span className="hidden lg:block">{isAlerting ? 'Sending...' : 'Alert Contacts'}</span>
    </button>
  );
}