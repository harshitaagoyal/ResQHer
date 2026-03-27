'use client';
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from 'lucide-react';

const steps = [
  'Fill out the form',
  'Review and Generate Image',
  'Submit report',
  'Submission complete',
];

export default function HorizontalLinearStepper({ activeStep, stepContent }) {
  const [poem, setPoem] = useState(null);

  useEffect(() => {
    // Generate the supportive poem once the last step is reached
    if (activeStep === 3 && !poem) {
      const generatePoem = async () => {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
              userInput: 'Provide a short, 5-line empowering and supportive message for a woman reporting an incident to ResQHer.',
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const result = await response.json();
          if (result.reply) {
            setPoem(result.reply);
          }
        } catch (e) {
          console.error("Poem Generation Error:", e);
        }
      };
      generatePoem();
    }
  }, [activeStep, poem]);

  return (
    <div className="max-w-4xl mx-auto w-full mt-10 px-4">
      {/* Custom Stepper Header */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((label, index) => (
          <div key={label} className="flex flex-col items-center flex-1 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
              activeStep >= index 
                ? 'bg-pink-600 border-pink-600 text-white' 
                : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-400 dark:text-slate-500'
            }`}>
              {activeStep > index ? '✓' : index + 1}
            </div>
            <span className={`text-xs mt-2 font-medium text-center ${
              activeStep >= index 
                ? 'text-pink-700 dark:text-pink-500' 
                : 'text-gray-400 dark:text-slate-500'
            }`}>
              {label}
            </span>
            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 transition-colors duration-300 ${
                activeStep > index ? 'bg-pink-600' : 'bg-gray-200 dark:bg-slate-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Content Area */}
      {activeStep === steps.length - 1 ? (
        <div className="flex flex-col items-center justify-center mt-12 animate-in fade-in duration-700">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Incident Successfully Reported</h2>
          </div>
          
          {poem && (
            <div className="mt-6 p-8 bg-pink-50 dark:bg-pink-950/20 border-l-4 border-pink-500 rounded-r-lg text-center max-w-xl shadow-sm italic text-gray-700 dark:text-slate-300 font-serif text-lg leading-relaxed">
              {poem}
            </div>
          )}
        </div>
      ) : (
        // THE FIX: Added dark:bg-slate-950 and dark:border-slate-800
        <div className="mt-4 p-6 bg-white dark:bg-slate-950 rounded-xl border dark:border-slate-800 shadow-sm transition-colors duration-300">
          {stepContent[activeStep]}
        </div>
      )}
    </div>
  );
}