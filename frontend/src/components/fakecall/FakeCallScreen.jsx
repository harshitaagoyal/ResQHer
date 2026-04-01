'use client';
import { PhoneOff, Phone } from 'lucide-react';

export default function FakeCallScreen({ 
  status, 
  callerName, 
  onAccept, 
  onEnd 
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col items-center justify-between py-24 px-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="text-center space-y-6 mt-12">
        <div className="text-xl text-slate-400 font-medium">Mobile</div>
        <h2 className="text-5xl sm:text-6xl font-light tracking-wide truncate px-4 max-w-sm">
          {callerName || 'Unknown'}
        </h2>
        <p className="text-2xl text-slate-300 font-light mt-4">
          {status === 'ringing' ? 'Incoming Call...' : '00:03'}
        </p>
      </div>
      
      <div className="flex w-full max-w-sm justify-between pb-12">
        {status === 'ringing' ? (
          <>
            <button onClick={onEnd} className="cursor-pointer flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform">
                <PhoneOff size={36} className="text-white fill-current" />
              </div>
              <span className="text-lg">Decline</span>
            </button>
            <button onClick={onAccept} className="cursor-pointer flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-bounce group-hover:scale-105 transition-transform">
                <Phone size={36} className="text-white fill-current" />
              </div>
              <span className="text-lg">Accept</span>
            </button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <button onClick={onEnd} className="cursor-pointer flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform">
                <PhoneOff size={36} className="text-white fill-current" />
              </div>
              <span className="text-lg">End Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}