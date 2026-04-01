'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Globe, Mail, Briefcase, Share2 } from 'lucide-react'; 
import Image from 'next/image';

// 🚨 ADDED formData to the props here so we have the user's input!
function Share({ imageURL, resText, setShared, formData }) {
  const [isSaving, setIsSaving] = useState(false);
  
  const displayImage = imageURL || "https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=1024&auto=format&fit=crop";

  const handleShare = (platform) => {
    const rawText = `Safety Report Update:\n\n"${resText}"\n\nReported via @ResQHer`;
    const encodedText = encodeURIComponent(rawText);
    const encodedUrl = encodeURIComponent(displayImage);
    const encodedSubject = encodeURIComponent("Safety Report via ResQHer");
    
    let shareUrl = '';
    
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedSubject}&summary=${encodedText}`;
    } else if (platform === 'email') {
      shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedText}%0A%0AView%20Image:%20${encodedUrl}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 🚨 THE REAL DATABASE SUBMISSION
  const handleFinalSubmit = async () => {
    setIsSaving(true);
    try {
      // 1. Combine the user's form answers with the AI generated text
      const payload = {
        ...formData, // name, location, phone, etc. from Step 1
        current_situation: resText, // The AI summary
        image_url: displayImage // The generated image
      };

      // 2. Send it to our API route to save in MongoDB
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to save to database");
      }

      console.log("✅ Report Successfully Saved to Database!");
      setShared(true); // Move to the success screen

    } catch (error) {
      console.error('Submission Error:', error);
      alert('Failed to save report to database. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-800">Finalize Your Report</h2>
      
      <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
        <Image
          src={displayImage}
          alt="Report Visual"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex items-end">
          <p className="text-white text-sm md:text-base italic leading-relaxed">"{resText}"</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
        <Button variant="outline" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => handleShare('telegram')}>
          <Send size={16} /> Telegram
        </Button>
        <Button variant="outline" className="gap-2 bg-slate-900 text-white hover:bg-slate-800" onClick={() => handleShare('twitter')}>
          <Globe size={16} /> X / Twitter
        </Button>
        <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50" onClick={() => handleShare('linkedin')}>
          <Briefcase size={16} /> LinkedIn
        </Button>
        <Button variant="outline" className="gap-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleShare('email')}>
          <Mail size={16} /> Email
        </Button>
      </div>

      <Button
        className="w-full max-w-md h-14 bg-pink-600 hover:bg-pink-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-95"
        onClick={handleFinalSubmit}
        disabled={isSaving}
      >
        {isSaving ? (
          <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Saving securely...</span>
        ) : "Confirm & Submit Report"}
      </Button>
    </div>
  );
}

export default Share;