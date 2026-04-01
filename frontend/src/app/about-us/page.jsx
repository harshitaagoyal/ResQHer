'use client';

import React from 'react';
import { ShieldCheck, PhoneCall, Scale, HeartPulse, Users, Navigation } from 'lucide-react';

const featureDetails = [
  { icon: ShieldCheck, title: 'Report Incident', desc: 'Secure encryption-based reporting system for sensitive data handling.' },
  { icon: PhoneCall, title: 'Fake Call', desc: 'Customizable UI simulation to provide a safe exit from social discomfort.' },
  { icon: Scale, title: 'Law Bot', desc: 'AI assistant providing simplified legal guidance on IPC sections for women.' },
  { icon: HeartPulse, title: 'Therapy Bot', desc: 'Sentiment-aware AI companion for immediate emotional de-escalation.' },
  { icon: Users, title: 'Trust Circle', desc: 'Real-time GPS syncing with emergency contacts via secure API integration.' },
  { icon: Navigation, title: 'Nearby Help', desc: 'Geolocation-based mapping for verified safe zones and police stations.' },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white pb-20 px-8">
      <div className="max-w-5xl mx-auto pt-16">
        <div className="max-w-2xl space-y-4 mb-16">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
            Empowering <span className="text-[#ed0b70]">Every Woman.</span>
          </h1>
          <p className="text-lg font-bold text-slate-500 leading-snug">
            ResQHer is a technical safety suite built to bridge the gap between danger and assistance using modern AI and real-time tracking.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureDetails.map((f, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all group">
              <div className="p-3 bg-white rounded-xl inline-block shadow-sm mb-4 text-[#ed0b70]">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{f.title}</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Developer Mission */}
        <div className="mt-16 p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black tracking-tight underline decoration-[#ed0b70] underline-offset-4">Developer Vision</h2>
            <p className="text-slate-400 font-bold text-base max-w-lg italic">
              "Building technology that serves as a shield in the real world."
            </p>
          </div>
          <div className="text-center md:text-right">
             <span className="text-pink-500 font-black text-xl italic block">Harshita Goyal</span>
             <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Full Stack Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}