'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PhoneOutgoing, Timer } from 'lucide-react';

import FakeCallConfigModal from './FakeCallConfigModal';
import FakeCallScreen from './FakeCallScreen';

export default function FakeCall() {
  const [mounted, setMounted] = useState(false);
  const [fakeCallStatus, setFakeCallStatus] = useState('idle'); 
  const [callerName, setCallerName] = useState('Dad');
  
  const [customTime, setCustomTime] = useState('');
  const [customUnit, setCustomUnit] = useState('min'); 
  
  const timerRef = useRef(null);

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
      {fakeCallStatus === 'counting' ? (
        <button 
          onClick={cancelFakeCall}
          className="cursor-pointer flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-bold text-sm sm:text-base animate-pulse"
        >
          <Timer size={18} />
          <span className="hidden lg:block text-red-500">Cancel Timer</span>
        </button>
      ) : (
        <button 
          onClick={openFakeCallMenu}
          disabled={fakeCallStatus !== 'idle'}
          className="cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all font-bold text-sm sm:text-base disabled:opacity-50"
        >
          <PhoneOutgoing size={18} />
          <span className="hidden lg:block">Fake Call</span>
        </button>
      )}

      {mounted && createPortal(
        <>
          {fakeCallStatus === 'configuring' && (
            <FakeCallConfigModal 
              callerName={callerName}
              setCallerName={setCallerName}
              onClose={closeFakeCallMenu}
              onStartCall={startFakeCall}
              customTime={customTime}
              setCustomTime={setCustomTime}
              customUnit={customUnit}
              setCustomUnit={setCustomUnit}
            />
          )}

          {(fakeCallStatus === 'ringing' || fakeCallStatus === 'answered') && (
            <FakeCallScreen 
              status={fakeCallStatus}
              callerName={callerName}
              onAccept={handleAcceptCall}
              onEnd={handleEndCall}
            />
          )}
        </>, 
        document.body
      )}
    </>
  );
}