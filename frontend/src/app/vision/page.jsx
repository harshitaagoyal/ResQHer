'use client';

import React from 'react';

export default function OurVision() {
  return (
    <div className="min-h-screen bg-white pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto pt-8">
        
        {/* Main Title - Exact match to Privacy/Terms */}
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight mb-4">
          Our Vision
        </h1>
        
        {/* Divider line */}
        <div className="w-10 h-1 bg-slate-800 mb-10"></div>

        <div className="space-y-8">
          
          {/* Hero Statement */}
          <section>
            <p className="text-[17px] font-bold text-slate-800 leading-relaxed mb-4">
              Engineering a world where technology is the ultimate equalizer for personal safety.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4 uppercase">
              The Core Philosophy
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              ResQHer was born from a simple belief: safety should not be a privilege. As developers, we have a responsibility to build digital infrastructures that actively protect vulnerable populations. We envision a platform that bridges the gap between sudden danger and immediate assistance, using advanced web capabilities to create a frictionless safety net.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4 uppercase">
              Systems-Level Precision
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              True safety applications cannot afford latency or failure. We approach our web engineering with the rigor of low-level systems design. By implementing highly optimized algorithms and robust control loops for our emergency triggers, we ensure that every SOS alert and GPS sync executes with zero-fail reliability. Performance and architecture are not just metrics here; they are lifelines.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4 uppercase">
              Beyond the Browser
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              While ResQHer begins as a comprehensive web application, our long-term roadmap extends into the physical world. We envision integrating this software infrastructure with low-cost, accessible hardware—creating affordable wearable safety devices that communicate seamlessly with our servers. By combining robust physical engineering with scalable software, we aim to provide universal protection.
            </p>
          </section>

          {/* Developer Sign-off in official style */}
          <section className="border-t border-slate-200 pt-8 mt-12">
            <p className="text-[15px] leading-relaxed text-slate-600">
              <span className="font-bold text-slate-800 uppercase tracking-widest text-[11px] block mb-1">Architected By</span>
              <span className="text-[#ed0b70] font-bold text-[17px]">Harshita Goyal</span><br/>
              <span className="italic text-sm">Lead Engineer & Full Stack Developer</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}