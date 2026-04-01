'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import HorizontalLinearStepper from '@/components/MultiStep';

import { InputForm } from '@/components/InputForm'; 
import ImageGen from '@/components/ImageGen';
import Share from '@/components/Share';

export default function CreatePostPage() {
  const { user, isLoaded } = useUser();
  const [resImage, setResImage] = useState(null);
  const [resText, setText] = useState(null);
  const [resTextGemma, setTextGemma] = useState(null);
  
  // NEW: State to hold the actual form data for the database
  const [formData, setFormData] = useState({}); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [shared, setShared] = useState(false);

  // Step 1 -> Step 2
  useEffect(() => {
    if (resText && resTextGemma) {
      setActiveStep(1);
    }
  }, [resText, resTextGemma]);

  // Step 2 -> Step 3
  useEffect(() => {
    if (resImage) {
      setActiveStep(2);
    }
  }, [resImage]);

  // Step 3 -> Step 4
  useEffect(() => {
    if (shared) {
      setActiveStep(3);
    }
  }, [shared]);

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

  const stepContent = [
    <InputForm 
      key="step1" 
      setText={setText} 
      setTextGemma={setTextGemma} 
      userEmail={user?.primaryEmailAddress?.emailAddress}
      setFormData={setFormData} // NEW: Pass this down to capture input
    />,
    <ImageGen
      key="step2"
      text={resText || ''}
      setResImage={setResImage}
      textGemma={resTextGemma || ''}
    />,
    <Share
      key="step3"
      imageURL={resImage || ''}
      setShared={setShared}
      resText={resText || ''}
      formData={formData} // NEW: Pass the captured data to the final step
    />,
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-10 transition-colors duration-300">
      <HorizontalLinearStepper
        activeStep={activeStep}
        stepContent={stepContent}
      />
    </div>
  );
}