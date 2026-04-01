'use client';
import { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { X, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminGatekeeperModal({ onClose }) {
  const [adminKey, setAdminKey] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [isKeyVerified, setIsKeyVerified] = useState(false);

  // Note: Ensure this matches your environment setup
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
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
                  setKeyError(false); 
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
  );
}