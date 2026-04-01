'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { InputForm } from '@/components/InputForm';
import { HeartPulse } from 'lucide-react'; // Swapped icon to match the pink theme

export default function CreatePostPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center p-10 border rounded-2xl bg-gray-50 dark:bg-slate-900 dark:border-slate-800 shadow-inner">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Please sign in to report an incident</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">To ensure safety and follow-up, an account is required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Updated Header with Pink Accents */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800/30">
             <HeartPulse className="w-5 h-5 text-pink-600 dark:text-pink-400 mr-2" />
             <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 px-2">
               ResQHer Secure Portal
             </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Report an <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 dark:from-pink-400 dark:to-rose-300">Incident</span>
          </h1>
          
          {/* Pink Accent Line */}
          <div className="h-1.5 w-20 bg-pink-600 dark:bg-pink-500 rounded-full mb-6"></div>

          <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Your safety is our priority. Your report is encrypted and handled with the utmost care and confidentiality.
          </p>
        </div>

        {/* The Form Container with subtle pink glow */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-pink-500/5 border border-slate-200 dark:border-slate-800">
          <InputForm />
        </div>

      </div>
    </div>
  );
}