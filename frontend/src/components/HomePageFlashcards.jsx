'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Gavel, 
  BrainCircuit, 
  HeartHandshake, 
  MapPin, 
  PhoneIncoming, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const flashcardData = [
  { 
    icon: ShieldAlert, 
    title: 'Report Incident', 
    desc: 'Securely report incidents to authorities with optional end-to-end encryption.' 
  },
  { 
    icon: Gavel, 
    title: 'Law Bot', 
    desc: 'Access legal guidance and understand your rights with our specialized AI assistant.' 
  },
  { 
    icon: BrainCircuit, 
    title: 'Therapy Bot', 
    desc: 'Find emotional support and professional mental health guidance securely.' 
  },
  { 
    icon: HeartHandshake, 
    title: 'Trust Circle', 
    desc: 'Create a safe network of contacts to alert instantly during any emergency.' 
  },
  { 
    icon: MapPin, 
    title: 'Nearby Help', 
    desc: 'Instantly find and navigate to the nearest safe locations and authorities.' 
  },
  { 
    icon: PhoneIncoming, 
    title: 'Fake Call', 
    desc: 'Discreetly trigger a realistic incoming call to excuse yourself from uncomfortable situations.' 
  },
];

export default function HomePageFlashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => { 
    if (currentIndex < flashcardData.length - 1) setCurrentIndex(currentIndex + 1); 
  };
  
  const prevSlide = () => { 
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1); 
  };

  const currentCard = flashcardData[currentIndex];
  const IconComponent = currentCard.icon;

  return (
    <div className="relative w-full max-w-md mx-auto select-none p-4">
      <div className="relative overflow-hidden rounded-[3rem] bg-white aspect-square flex flex-col p-10 shadow-[0_50px_100px_-20px_rgba(237,11,112,0.15),0_30px_60px_-30px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02]">
        
        {/* Floating Icon */}
        <div className="mb-8">
          <div className="inline-flex p-5 rounded-3xl bg-pink-50 text-pink-600 shadow-sm border border-pink-100 transition-all duration-300">
            <IconComponent size={44} strokeWidth={2} />
          </div>
        </div>

        {/* Content - Extra Bold */}
        <div className="flex-1">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-4">
            {currentCard.title}
          </h3>
          <p className="text-lg font-bold text-slate-500 leading-relaxed max-w-xs">
            {currentCard.desc}
          </p>
        </div>

        {/* Bottom Nav Section */}
        <div className="flex items-center justify-between mt-auto">
          {/* Progress Indicators (Dots) */}
          <div className="flex gap-1.5">
            {flashcardData.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-pink-600' : 'w-2 bg-pink-100'
                }`} 
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`p-3 rounded-2xl bg-white border border-slate-100 shadow-lg text-slate-400 transition-all ${
                currentIndex === 0 ? 'opacity-0 scale-50 pointer-events-none' : 'hover:text-pink-600 hover:border-pink-200 active:scale-95'
              }`}
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentIndex === flashcardData.length - 1}
              className={`p-3 rounded-2xl bg-white border border-slate-100 shadow-lg text-slate-400 transition-all ${
                currentIndex === flashcardData.length - 1 ? 'opacity-0 scale-50 pointer-events-none' : 'hover:text-pink-600 hover:border-pink-200 active:scale-95'
              }`}
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}