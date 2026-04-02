'use client';

import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto pt-8">
        
        {/* Main Title */}
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight mb-4">
          About Us
        </h1>
        
        {/* Divider line */}
        <div className="w-10 h-1 bg-slate-800 dark:bg-slate-400 mb-10"></div>

        <div className="space-y-8">
          
          {/* Hero Statement */}
          <section>
            <p className="text-[17px] font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-4">
              Empowering every woman through an advanced, technology-driven safety suite.
            </p>
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              ResQHer is a comprehensive digital framework built to bridge the gap between danger and immediate assistance. By combining artificial intelligence, real-time geolocation tracking, and secure communication protocols, we provide tools that prioritize user safety, privacy, and peace of mind.
            </p>
          </section>

          {/* Core Platform Features */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 dark:text-white mb-4 uppercase">
              Core Platform Features
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 mb-6">
              Our platform is engineered with a multi-layered approach to personal security, offering both preventative measures and emergency response systems:
            </p>
            
            <ul className="space-y-6">
              <li className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">Trust Circle (Real-time SOS):</span> A mesh-network inspired feature that instantly syncs real-time GPS coordinates with trusted contacts via secure API integration during an emergency.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">Law Bot:</span> An AI-powered legal advisor trained on IPC (Indian Penal Code) sections to provide instant, simplified guidance on women’s rights and legal recourse.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">Therapy Bot:</span> A sentiment-aware AI companion designed to provide immediate emotional de-escalation and professional mental health routing during high-stress situations.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">Incident Reporting:</span> A sophisticated reporting system utilizing end-to-end encryption to securely store sensitive data and submit official reports.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">Discreet Fake Call:</span> A customizable UI simulation that triggers a realistic incoming call, providing a safe and unquestionable exit from socially uncomfortable or escalating situations.
              </li>
              <li className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">Nearby Help Mapping:</span> Geolocation-based integration that filters and maps verified hospitals, shelters, and police stations within an immediate radius.
              </li>
            </ul>
          </section>

          {/* Technical Commitment */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 dark:text-white mb-4 uppercase">
              Our Technical Commitment
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              We understand that a safety application is only as reliable as its underlying code. ResQHer is developed with a strict privacy-first architecture. We employ zero-knowledge principles where applicable, ensuring that sensitive location data and AI chat logs remain entirely under the user's control.
            </p>
          </section>

          {/* Developer Sign-off */}
          <section className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-12">
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[11px] block mb-1">Architected By</span>
              <span className="text-[#ed0b70] dark:text-[#ff4794] font-bold text-[17px]">Harshita Goyal</span><br/>
              <span className="italic text-sm">Lead Engineer & Full Stack Developer</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}