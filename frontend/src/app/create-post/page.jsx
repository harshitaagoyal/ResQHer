'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import HorizontalLinearStepper from '@/components/MultiStep';

// These components will be built next
import { InputForm } from '@/components/InputForm'; 
import ImageGen from '@/components/ImageGen';
import Share from '@/components/Share';

function CreatePostPage() {
  const { user, isLoaded } = useUser();
  const [resImage, setResImage] = useState(null);
  const [resText, setText] = useState(null);
  const [resTextGemma, setTextGemma] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [shared, setShared] = useState(false);

  // Step 1 -> Step 2: Form Submitted
  useEffect(() => {
    if (resText && resTextGemma) {
      setActiveStep(1);
    }
  }, [resText, resTextGemma]);

  // Step 2 -> Step 3: Image Generated
  useEffect(() => {
    if (resImage) {
      setActiveStep(2);
    }
  }, [resImage]);

  // Step 3 -> Step 4: Final Submission
  useEffect(() => {
    if (shared) {
      setActiveStep(3);
    }
  }, [shared]);

  if (!isLoaded) return null; // Wait for Clerk to load

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        {/* FIX: Added dark mode support for the sign-in prompt */}
        <div className="text-center p-10 border rounded-2xl bg-gray-50 dark:bg-slate-900 dark:border-slate-800 shadow-inner">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Please sign in to report an incident</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">To ensure safety and follow-up, an account is required.</p>
        </div>
      </div>
    );
  }

  const stepContent = [
    <InputForm key="step1" setText={setText} setTextGemma={setTextGemma} userEmail={user?.primaryEmailAddress?.emailAddress}/>,
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
    />,
  ];

  return (
    /* FINAL FIX: Added dark:bg-[#020617] to the main background */
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-10 transition-colors duration-300">
      <HorizontalLinearStepper
        activeStep={activeStep}
        stepContent={stepContent}
      />
    </div>
  );
}

export default CreatePostPage;