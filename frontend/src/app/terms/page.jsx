'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white pb-20 px-8">
      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">Terms of <span className="text-[#ed0b70]">Service.</span></h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 italic">Version 1.0</p>

        <div className="bg-slate-50 border-l-8 border-[#ed0b70] rounded-r-2xl p-6 mb-10 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#ed0b70]">
            <AlertTriangle size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Legal Notice</span>
          </div>
          <p className="text-sm font-bold text-slate-800 italic">ResQHer AI Bots provide informational support and are NOT a substitute for professional legal or medical advice.</p>
        </div>

        <div className="space-y-10">
          <section className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 uppercase">01. Use of Service</h2>
            <p className="text-base font-bold text-slate-600 leading-relaxed">Misuse of the SOS system for fake alerts will result in immediate account termination. The Fake Call feature must be used responsibly.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 uppercase">02. Liability</h2>
            <p className="text-base font-bold text-slate-600 leading-relaxed">ResQHer is a safety tool. While we strive for accuracy, the final responsibility for personal safety remains with the user.</p>
          </section>
        </div>
      </div>
    </div>
  );
}