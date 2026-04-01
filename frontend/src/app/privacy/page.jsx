'use client';
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pb-20 px-8">
      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">Privacy <span className="text-[#ed0b70]">Policy.</span></h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 italic">Updated: April 2026</p>

        <div className="bg-pink-50 rounded-[1.5rem] p-6 mb-10 border border-pink-100 flex items-start gap-4">
          <ShieldCheck size={24} className="text-[#ed0b70] shrink-0" />
          <p className="text-sm font-bold text-slate-700 leading-snug">
            We prioritize your safety. Your location is only tracked during active SOS triggers, and your chat logs with AI bots are end-to-end encrypted.
          </p>
        </div>

        <div className="space-y-10">
          <section className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 uppercase">01. Data Collection</h2>
            <p className="text-base font-bold text-slate-600 leading-relaxed">We collect your contact details and emergency list only to facilitate safety features. GPS data is stored only for incident validation.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 uppercase">02. Third-Party Sharing</h2>
            <p className="text-base font-bold text-slate-600 leading-relaxed">We do not sell data. Information is only shared with law enforcement when you explicitly trigger an emergency alert.</p>
          </section>
        </div>
      </div>
    </div>
  );
}