'use client';
import Image from 'next/image';
import React from 'react';

function Header() {
  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-4">
      <div className="flex flex-col md:flex-row items-center mt-12 gap-12 md:gap-32 text-center md:text-left">
        <div className="flex flex-col gap-5">
          <h1 className="font-extrabold text-[40px] text-gray-800 leading-tight">
            Empower Your Safety and Rights with{' '}
            <span className="text-pink-600">ResQHer</span>
          </h1>
          <p className="text-[20px] text-gray-600 leading-relaxed">
            At ResQHer, we provide women with the tools they 
            need for safety and justice. Access legal guidance, 
            report incidents securely, and find support. 
            Your journey starts here, and we are with you every step! 🛡️
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-lg text-white rounded-lg shadow-md transform hover:scale-105 transition duration-200 font-semibold">
              Get Started
            </button>
            <button className="px-6 py-3 text-lg text-pink-700 rounded-lg border border-pink-700 shadow-md transform hover:scale-105 hover:bg-pink-700 hover:text-white transition duration-200 font-semibold">
              Report Now
            </button>
          </div>
        </div>
        
        <div className="relative shrink-0">
          {/* Using a high-quality pink illustration as a dummy banner */}
          <Image
            src="https://illustrations.popsy.co/pink/woman-taking-a-photo.svg" 
            width={500}
            height={500}
            alt="ResQHer Banner"
            className="scale-x-[-1] object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Header;