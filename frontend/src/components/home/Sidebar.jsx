'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, FileText, Scale, HeartHandshake, Users } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 left-0 z-[60] w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-[100dvh] flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ResQ<span className="text-pink-600">Her</span>
            </span>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <Link href="/" onClick={onClose} className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-colors ${isActive('/') ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <Home size={20} /> Home
            </Link>
            <Link href="/create-post" onClick={onClose} className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-colors ${isActive('/create-post') ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <FileText size={20} /> Report Incident
            </Link>
            <Link href="/lawbot" onClick={onClose} className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-colors ${isActive('/lawbot') ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <Scale size={20} /> Law Bot
            </Link>
            <Link href="/therapybot" onClick={onClose} className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-colors ${isActive('/therapybot') ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <HeartHandshake size={20} /> Therapy Bot
            </Link>
            <Link href="/emergency-contacts" onClick={onClose} className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-colors ${isActive('/emergency-contacts') ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <Users size={20} /> Trust Circle
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}