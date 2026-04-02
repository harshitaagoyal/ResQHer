'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HomePageFlashcards from './HomePageFlashcards';
import { useUser } from '@clerk/nextjs';

function Header() {
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

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`SENDING SMS TO ${savedContacts.length} CONTACTS:`, savedContacts);
        console.log(`MESSAGE: I feel unsafe. Please check on me. My live location: http://googleusercontent.com/maps.google.com/?q=${lat},${lng}`);

        setTimeout(() => {
          setIsAlerting(false);
          alert("Alert sent successfully to your Trust Circle!");
        }, 1500);
      },
      (error) => {
        alert("Failed to get your location. Please enable GPS.");
        setIsAlerting(false);
      }
    );
  };

  return (
    <div className="py-8 md:py-16 flex items-center justify-center bg-white dark:bg-[#020617] overflow-hidden">
      {/* 🚨 CHANGED: Adjusted padding (px-4 on mobile, px-8 on desktop) and gap spacing */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center px-4 md:px-8"> 
        
        {/* 🚨 CHANGED: Centered text on mobile, left-aligned on desktop. Tighter spacing on mobile (space-y-4) */}
        <div className="space-y-4 md:space-y-6 z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
          
          {/* 🚨 CHANGED: Smoothly scales text from 3xl (mobile) -> 4xl (tablet) -> 5xl (desktop) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.2] lg:leading-[1.15]">
            Empower Your Safety <br className="hidden lg:block" />
            and Rights with <span className="text-pink-600">ResQHer</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
            At ResQHer, we provide women with the tools they need for safety and justice. Access legal guidance, report incidents securely, and find support. Your journey starts here, and we are with you every step! 🛡️
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto">
            <Link
              href="/about-us"
              // 🚨 CHANGED: Button goes full width on tiny phones, auto width on bigger screens
              className="w-full sm:w-auto text-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1 text-base"
            >
              About Us
            </Link>
          </div>
        </div>

        {/* Right Side: Local Hero Image / Flashcards */}
        {/* 🚨 CHANGED: Tighter max-width for tiny phones, increased top margin to separate from text */}
        <div className="relative w-full max-w-[320px] sm:max-w-md mx-auto lg:mx-0 lg:ml-auto mt-10 lg:mt-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-pink-300 to-blue-300 dark:from-pink-900/40 dark:to-blue-900/40 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
          
          <div className="relative w-full flex justify-center lg:justify-end">
            {/* Decorative Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            
            {/* THE FLASHCARDS COMPONENT */}
            <HomePageFlashcards />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Header;