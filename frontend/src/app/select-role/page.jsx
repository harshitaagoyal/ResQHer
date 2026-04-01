'use client';

import React, { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { ShieldAlert, UserCircle, ArrowRight, Lock, X, CheckCircle2 } from 'lucide-react';

export default function SelectRole() {
  // --- STATE FOR ADMIN GATEKEEPER ---
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [isKeyVerified, setIsKeyVerified] = useState(false);

  // The Master Secret Key (In production, put this in your .env.local file)
  const MASTER_ADMIN_KEY = "RESQ-AUTH-2026"; 

  const handleVerifyKey = (e) => {
    e.preventDefault();
    if (adminKey === MASTER_ADMIN_KEY) {
      setIsKeyVerified(true);
      setKeyError(false);
    } else {
      setKeyError(true);
      setAdminKey('');
    }
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminKey('');
    setKeyError(false);
    setIsKeyVerified(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-6 relative">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 🚨 USER LOGIN CARD (Stays exactly the same) 🚨 */}
        <SignInButton mode="modal" fallbackRedirectUrl="/">
          <button className="w-full h-full text-left outline-none group relative cursor-pointer transition-transform hover:-translate-y-1">
            <div className="h-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-pink-500 transition-all duration-300 shadow-xl hover:shadow-pink-500/10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">User Portal</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                Access safety tools, legal aid, and your Trust Circle.
              </p>
              <div className="mt-auto flex items-center gap-2 text-pink-600 font-bold">
                Log In as User <ArrowRight size={20} />
              </div>
            </div>
          </button>
        </SignInButton>

        {/* 🚨 AUTHORITY LOGIN CARD (Now triggers the Custom Modal) 🚨 */}
        <button 
          onClick={() => setShowAdminModal(true)}
          className="w-full h-full text-left outline-none group relative cursor-pointer transition-transform hover:-translate-y-1"
        >
          <div className="h-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-500 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Authority Portal</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Monitor live SOS alerts, manage incidents, and coordinate response.
            </p>
            <div className="mt-auto flex items-center gap-2 text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full">
              Requires Access Key
            </div>
          </div>
        </button>

      </div>

      {/* 🚨 THE ADMIN GATEKEEPER MODAL 🚨 */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            
            {/* Close Button */}
            <button 
              onClick={closeAdminModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isKeyVerified ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {isKeyVerified ? <CheckCircle2 size={32} /> : <Lock size={32} />}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {isKeyVerified ? "Access Granted" : "Restricted Access"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                {isKeyVerified 
                  ? "Identity confirmed. You may now proceed to the secure login." 
                  : "Please enter the master Authority Access Key to continue."}
              </p>
            </div>

            {/* Form Logic */}
            {!isKeyVerified ? (
              <form onSubmit={handleVerifyKey} className="space-y-4">
                <div>
                  <input 
                    type="password" 
                    placeholder="Enter Access Key..."
                    value={adminKey}
                    onChange={(e) => {
                      setAdminKey(e.target.value);
                      setKeyError(false); // Clear error when typing
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 transition-all text-center tracking-[0.2em] font-mono ${
                      keyError 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' 
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                    }`}
                    autoFocus
                  />
                  {keyError && (
                    <p className="text-red-500 text-xs font-bold text-center mt-2 animate-pulse">
                      Invalid Access Key. Please try again.
                    </p>
                  )}
                </div>
                <button 
                  type="submit"
                  disabled={!adminKey}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify Key
                </button>
              </form>
            ) : (
              // The Actual Clerk Login Button is revealed!
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <SignInButton mode="modal" forceRedirectUrl="/admin">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 text-lg">
                    Proceed to Authority Login <ArrowRight size={20} />
                  </button>
                </SignInButton>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}