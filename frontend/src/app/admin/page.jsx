'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, HeartHandshake, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-[#020617] p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Text and Buttons */}
        <div className="space-y-6 z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1]">
            Empower Your Safety <br className="hidden lg:block" />
            and Rights with <span className="text-pink-600">ResQHer</span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
            At ResQHer, we provide women with the tools they need for safety and justice. Access legal guidance, report incidents securely, and find support. Your journey starts here, and we are with you every step! 🛡️
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              href="/create-post" 
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link 
              href="/create-post" 
              className="border-2 border-pink-600 text-pink-600 dark:text-pink-400 dark:border-pink-500 font-bold py-3 px-8 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
            >
              Report Now
            </Link>
          </div>
        </div>

        {/* Right Side: Modern Bento Box Feature Grid */}
        <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
          
          {/* Decorative blurred background blobs */}
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-300 dark:bg-pink-900/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-20 -right-10 w-72 h-72 bg-blue-300 dark:bg-blue-900/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            
            {/* Box 1: AI Legal Aid */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-200 dark:hover:border-pink-900/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Scale size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">AI Legal Aid</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Instant, reliable guidance on IPC sections and women's rights.</p>
            </div>

            {/* Box 2: Therapy Bot */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300 group sm:translate-y-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <HeartHandshake size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Therapy Bot</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Compassionate emotional support and grounding exercises, 24/7.</p>
            </div>

            {/* Box 3: Live Tracking */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 group sm:-translate-y-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Live Tracking</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Direct GPS routing to authorities for immediate intervention.</p>
            </div>

            {/* Box 4: 100% Secure */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-300 group sm:translate-y-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">100% Secure</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">End-to-end encrypted reporting to protect your identity.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}