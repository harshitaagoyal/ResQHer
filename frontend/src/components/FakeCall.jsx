'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 🚨 NEW: Imported createPortal
import { PhoneOutgoing, PhoneOff, Phone, Timer, X } from 'lucide-react';

export default function FakeCall() {
  const [mounted, setMounted] = useState(false); // 🚨 NEW: To prevent hydration errors
  const [fakeCallStatus, setFakeCallStatus] = useState('idle'); 
  const [callerName, setCallerName] = useState('Dad');
  
  const [customTime, setCustomTime] = useState('');
  const [customUnit, setCustomUnit] = useState('min'); 
  
  const timerRef = useRef(null);

  // 🚨 NEW: Wait for component to mount before using Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const openFakeCallMenu = () => setFakeCallStatus('configuring');
  const closeFakeCallMenu = () => setFakeCallStatus('idle');

  const startFakeCall = (seconds) => {
    setFakeCallStatus('counting');
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setFakeCallStatus('ringing');
    }, seconds * 1000);
  };

  const cancelFakeCall = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFakeCallStatus('idle');
  };

  const handleAcceptCall = () => setFakeCallStatus('answered');
  const handleEndCall = () => setFakeCallStatus('idle');

  return (
    <>
      {/* 🚨 1. THE NAVBAR BUTTON (Stays in the Navbar) 🚨 */}
      {fakeCallStatus === 'counting' ? (
        <button 
          onClick={cancelFakeCall}
          className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-bold text-sm sm:text-base animate-pulse"
        >
          <Timer size={18} />
          <span className="hidden lg:block text-red-500">Cancel Timer</span>
        </button>
      ) : (
        <button 
          onClick={openFakeCallMenu}
          disabled={fakeCallStatus !== 'idle'}
          className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all font-bold text-sm sm:text-base disabled:opacity-50"
        >
          <PhoneOutgoing size={18} />
          <span className="hidden lg:block">Fake Call</span>
        </button>
      )}

      {/* 🚨 2. THE MODALS (Teleported to the main document body) 🚨 */}
      {mounted && createPortal(
        <>
          {fakeCallStatus === 'configuring' && (
            <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PhoneOutgoing className="text-pink-600" /> Fake Call Setup
                  </h3>
                  <button onClick={closeFakeCallMenu} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Caller ID Name</label>
                    <input 
                      type="text" 
                      value={callerName}
                      onChange={(e) => setCallerName(e.target.value)}
                      placeholder="e.g., Mom, Boss, Uber"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => startFakeCall(3)} 
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md mb-3"
                    >
                      Call Right Now (3s)
                    </button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                      <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or schedule timer</span>
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <button onClick={() => startFakeCall(10)} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm">10 Sec</button>
                      <button onClick={() => startFakeCall(60)} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm">1 Min</button>
                      <button onClick={() => startFakeCall(300)} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm">5 Min</button>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input 
                        type="number" 
                        min="1"
                        placeholder="Custom time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="flex-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                      />
                      <select
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        className="px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-sm cursor-pointer"
                      >
                        <option value="sec">Sec</option>
                        <option value="min">Min</option>
                        <option value="hr">Hrs</option>
                      </select>
                      <button 
                        onClick={() => {
                          const val = parseInt(customTime, 10);
                          if(val && val > 0) {
                            let totalSeconds = val;
                            if (customUnit === 'min') totalSeconds = val * 60;
                            if (customUnit === 'hr') totalSeconds = val * 3600;
                            startFakeCall(totalSeconds); 
                            setCustomTime(''); 
                          }
                        }}
                        disabled={!customTime || customTime <= 0}
                        className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm disabled:opacity-50"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(fakeCallStatus === 'ringing' || fakeCallStatus === 'answered') && (
            <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col items-center justify-between py-24 px-8 animate-in slide-in-from-bottom-8 duration-500">
              <div className="text-center space-y-6 mt-12">
                <div className="text-xl text-slate-400 font-medium">Mobile</div>
                <h2 className="text-5xl sm:text-6xl font-light tracking-wide truncate px-4 max-w-sm">
                  {callerName || 'Unknown'}
                </h2>
                <p className="text-2xl text-slate-300 font-light mt-4">
                  {fakeCallStatus === 'ringing' ? 'Incoming Call...' : '00:03'}
                </p>
              </div>
              <div className="flex w-full max-w-sm justify-between pb-12">
                {fakeCallStatus === 'ringing' ? (
                  <>
                    <button onClick={handleEndCall} className="flex flex-col items-center gap-3 group">
                      <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform">
                        <PhoneOff size={36} className="text-white fill-current" />
                      </div>
                      <span className="text-lg">Decline</span>
                    </button>
                    <button onClick={handleAcceptCall} className="flex flex-col items-center gap-3 group">
                      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-bounce group-hover:scale-105 transition-transform">
                        <Phone size={36} className="text-white fill-current" />
                      </div>
                      <span className="text-lg">Accept</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full flex justify-center">
                    <button onClick={handleEndCall} className="flex flex-col items-center gap-3 group">
                      <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform">
                        <PhoneOff size={36} className="text-white fill-current" />
                      </div>
                      <span className="text-lg">End Call</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>, 
        document.body
      )}
    </>
  );
}