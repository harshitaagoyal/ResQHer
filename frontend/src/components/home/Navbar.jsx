'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useUser, UserButton } from '@clerk/nextjs';
import { Menu, MapPin, ShieldAlert, X } from 'lucide-react';

import FakeCall from '../fakecall/FakeCall'; 
import Sidebar from './Sidebar';
import ThemeToggle from '../theme/ThemeToggle';
import AlertButton from './AlertButton';

export default function Navbar() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); 

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Side: Hamburger Menu & Logo */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="cursor-pointer p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Open Menu"
              >
                <Menu size={24} />
              </button>
              
              <Link href="/" className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  ResQ<span className="text-pink-600">Her</span>
                </span>
              </Link>
            </div>

            {/* Right Side: The Safety Toolkit */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              
              {/* 1. Nearby Help - 🚨 HIDDEN ON MOBILE to save space */}
              <Link href="/nearby-help" className="hidden md:flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 text-slate-600 dark:text-slate-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all font-medium">
                <MapPin size={18} />
                <span className="hidden lg:block">Nearby Help</span>
              </Link>

              {/* 2. Fake Call Module */}
              <div className="cursor-pointer scale-90 sm:scale-100">
                <FakeCall />
              </div>

              {/* 3. Alert Contacts Module */}
              <div className="cursor-pointer scale-90 sm:scale-100">
                <AlertButton />
              </div>

              {/* 4. SOS 112 - 🚨 ESSENTIAL: Keep visible but scale slightly on tiny screens */}
              <a href="tel:112" className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold p-1.5 sm:px-3 sm:py-1.5 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95">
                <ShieldAlert size={18} />
                <span className="hidden md:block">SOS</span>
              </a>

              {/* 5. Quick Exit - 🚨 HIDDEN ON MOBILE (Available in Google default behaviors / Sidebar) */}
              <button 
                onClick={handleQuickExit}
                className="hidden sm:flex cursor-pointer items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-bold ml-1"
                title="Quick Exit to Google"
              >
                <span className="hidden md:block">Quick Exit</span>
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* 6. Theme Toggle Module */}
              <ThemeToggle />

              {/* User Profile / Login */}
              <div className="pl-1 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
                {user ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <Link href="/select-role" className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-pink-600 transition-colors">
                    Log In
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}