'use client';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/theme/ModeToggle';

export default function AdminHeader() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Logo Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 cursor-default">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            ResQ<span className="text-pink-600">Her</span>
          </span>
          <span className="ml-2 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            Admin Hub
          </span>
        </div>
      </div>

      {/* Live Updates Bar */}
      {/* 🚨 CHANGED: flex-col on mobile, sm:flex-row on desktop. Added gap-4 for mobile spacing. */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 shadow-sm">
        
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Live Updates</h1>
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>
        
        {/* Aligning controls to the right on desktop, left on mobile */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t border-slate-100 dark:border-slate-800 sm:border-0">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
        
      </div>
    </div>
  );
}