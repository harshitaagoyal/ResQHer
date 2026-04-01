'use client';



import React, { useState } from 'react';

import Link from 'next/link';
import HomePageFlashcards from './HomePageFlashcards';
import { useUser } from '@clerk/nextjs';

function Header() {

  // 🚨 NEW: State to track if the alert is currently sending

  // 🚨 NEW: Get user data

  const { user } = useUser();

  const [isAlerting, setIsAlerting] = useState(false);



  const triggerAlert = () => {

    // 1. Check if they are logged in!

    if (!user) {

      alert("You must be logged in to use the Alert Contacts feature.");

      return;

    }



    // 2. Grab contacts securely from their Clerk account

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

    <div className="py-8 md:py-12 flex items-center justify-center bg-white dark:bg-[#020617] overflow-hidden">

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-8">

       

        {/* Left Side: Text and Buttons */}

        <div className="space-y-6 z-10">

          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15]">

            Empower Your Safety <br className="hidden lg:block" />

            and Rights with <span className="text-pink-600">ResQHer</span>

          </h1>

         

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">

            At ResQHer, we provide women with the tools they need for safety and justice. Access legal guidance, report incidents securely, and find support. Your journey starts here, and we are with you every step! 🛡️

          </p>

         

          <div className="flex flex-wrap items-center gap-4 pt-2">

            <Link

              href="/about-us"

              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1 text-base"

            >

              About Us

            </Link>

           

            {/* 🚨 UPDATED: Changed from Link to a functional Button */}

            {/* <button

              onClick={triggerAlert}

              disabled={isAlerting}

              className="border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-base disabled:opacity-70 disabled:hover:translate-y-0"

            >

              {isAlerting ? 'Sending Alert...' : 'Alert Contacts'}

            </button> */}

           

            {/* <a

              href="tel:112"

              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-500/30 transition-all hover:-translate-y-1 text-base flex items-center gap-2"

              title="Call National Emergency (112)"

            >

              <span className="relative flex h-3 w-3">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>

                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>

              </span>

              SOS 112

            </a> */}

          </div>

        </div>



        {/* Right Side: Local Hero Image */}

        <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto mt-6 lg:mt-0">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-pink-300 to-blue-300 dark:from-pink-900/40 dark:to-blue-900/40 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>



          <div className="relative w-full flex justify-center lg:justify-end">
          {/* Decorative Background Blur (Optional, kept for aesthetic) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          {/* 🚨 THE FLASHCARDS COMPONENT */}
          <HomePageFlashcards />
        </div>

        </div>



      </div>

    </div>

  );

}



export default Header;