'use client';
import React, { useState, useEffect } from 'react';
import { PhoneOff, Phone } from 'lucide-react';

export default function FakeCallScreen({ 
  status, 
  callerName, 
  onAccept, 
  onEnd 
}) {
  const [callDuration, setCallDuration] = useState(0);

  // 1. Attempt to go full screen as soon as it rings (May be blocked by browser until clicked)
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen waiting for user click...");
      }
    };
    enterFullScreen();

    // Cleanup: Exit fullscreen when component is closed
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // 2. Timer Effect
  useEffect(() => {
    let intervalId;
    if (status === 'answered') {
      intervalId = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 3. Guaranteed Fullscreen on "Accept" click
  const handleAcceptClick = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log(err);
    }
    onAccept(); // Trigger parent function
  };

  // 4. Guaranteed Exit Fullscreen on "End" click
  const handleEndClick = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.log(err);
    }
    onEnd(); // Trigger parent function
  };

  return (
    // Replaced h-[100dvh] w-screen with h-full w-full to prevent any scrollbars
    <div className="fixed inset-0 z-[9999] h-full w-full bg-[#0f172a] text-white flex flex-col items-center justify-between py-16 px-4 sm:py-24 sm:px-8 animate-in slide-in-from-bottom-full duration-500 overflow-hidden">
      
      <div className="text-center space-y-4 mt-16 sm:mt-12 w-full">
        <div className="text-lg sm:text-xl text-slate-400 font-medium tracking-wide">Mobile</div>
        <h2 className="text-5xl sm:text-6xl font-light tracking-wide truncate px-4 max-w-full">
          {callerName || 'Unknown'}
        </h2>
        
        <p className="text-xl sm:text-2xl text-slate-300 font-light mt-4 h-8 transition-all">
          {status === 'ringing' ? 'Incoming Call...' : formatTime(callDuration)}
        </p>
      </div>
      
      <div className="flex w-full max-w-sm justify-between pb-16 sm:pb-12 px-6">
        {status === 'ringing' ? (
          <>
            <button onClick={handleEndClick} className="cursor-pointer flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform active:scale-95">
                <PhoneOff size={36} className="text-white fill-current" />
              </div>
              <span className="text-lg tracking-wide">Decline</span>
            </button>
            
            {/* 🚨 Uses new handleAcceptClick to force fullscreen */}
            <button onClick={handleAcceptClick} className="cursor-pointer flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-[bounce_2s_infinite] group-hover:scale-105 transition-transform active:scale-95">
                <Phone size={36} className="text-white fill-current" />
              </div>
              <span className="text-lg tracking-wide">Accept</span>
            </button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            {/* 🚨 Uses new handleEndClick to exit fullscreen */}
            <button onClick={handleEndClick} className="cursor-pointer flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform active:scale-95">
                <PhoneOff size={36} className="text-white fill-current" />
              </div>
              <span className="text-lg tracking-wide">End Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}