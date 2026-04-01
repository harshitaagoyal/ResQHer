'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { ModeToggle } from './ModeToggle';
import { usePathname } from 'next/navigation';
import { useClerk, SignInButton, UserButton } from '@clerk/nextjs';
import { ShieldAlert, User, X, Lock, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

function Navbar() {
  const pathname = usePathname();
  const { user } = useClerk();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [authStep, setAuthStep] = useState('selection'); 
  const [adminKey, setAdminKey] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  
  // 🚨 NEW: Loading state for the database check
  const [isVerifying, setIsVerifying] = useState(false);

  const isActive = (href) => pathname === href;

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setTimeout(() => {
      setAuthStep('selection');
      setAdminKey('');
      setKeyError(false);
      setIsKeyVerified(false);
    }, 300);
  };

  // 🚨 UPDATED: Now queries MongoDB to check the dynamic key!
  const handleVerifyKey = async () => {
    if (!adminKey.trim()) return;
    
    setIsVerifying(true);
    setKeyError(false);

    try {
      const response = await fetch('/api/verify-admin-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey })
      });

      if (response.ok) {
        setIsKeyVerified(true);
      } else {
        setKeyError(true);
      }
    } catch (error) {
      console.error("Verification failed", error);
      setKeyError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <nav className="w-full h-16 p-4 flex items-center justify-between border-b shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Link
          href={'/'}
          className="font-bold text-2xl tracking-wide hover:text-pink-500 transition-colors duration-200 dark:text-white"
        >
          ResQ<span className="text-pink-600">Her</span>
        </Link>
        
        <div className="flex items-center justify-center gap-10 font-medium text-gray-600 dark:text-slate-300">
          <Link
            href="/"
            className={`${isActive('/') ? 'text-pink-700 dark:text-pink-500 font-semibold' : 'hover:text-pink-700 dark:hover:text-pink-400'} transition-colors duration-200`}
          >
            Home
          </Link>
          
          {!user?.unsafeMetadata?.isAdmin && (
            <Link
              href="/create-post"
              className={`${isActive('/create-post') ? 'text-pink-700 dark:text-pink-500 font-semibold' : 'hover:text-pink-700 dark:hover:text-pink-400'} transition-colors duration-200`}
            >
              Report Incident
            </Link>
          )}
          
          {user?.unsafeMetadata?.isAdmin && (
            <Link
              href="/admin"
              className={`${isActive('/admin') ? 'text-pink-700 dark:text-pink-500 font-semibold' : 'hover:text-pink-700 dark:hover:text-pink-400'} transition-colors duration-200`}
            >
              Admin Dashboard
            </Link>
          )}
          
          <Link
            href="/lawbot"
            className={`${isActive('/lawbot') ? 'text-pink-700 dark:text-pink-500 font-semibold' : 'hover:text-pink-700 dark:hover:text-pink-400'} transition-colors duration-200`}
          >
            Law Bot
          </Link>
          
          <Link
            href="/therapybot"
            className={`${isActive('/therapybot') ? 'text-pink-700 dark:text-pink-500 font-semibold' : 'hover:text-pink-700 dark:hover:text-pink-400'} transition-colors duration-200`}
          >
            Therapy Bot
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {!user ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="border-2 border-pink-600 text-pink-600 dark:border-pink-500 dark:text-pink-400 px-5 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors font-semibold"
            >
              Login
            </button>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </nav>

      {/* Role Selection Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border dark:border-slate-700 animate-in zoom-in-95">
            
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center relative bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                {authStep === 'secret' && (
                  <button onClick={() => setAuthStep('selection')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {authStep === 'selection' ? 'Welcome Back' : 'Authority Access'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {authStep === 'selection' ? 'Select your account type.' : 'Enter your unique admin key.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              
              {authStep === 'selection' ? (
                <>
                  <SignInButton mode="modal" forceRedirectUrl="/">
                    <button 
                      onClick={handleCloseModal}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-pink-500 hover:bg-pink-50 dark:hover:border-pink-500/50 dark:hover:bg-pink-900/20 transition-all group text-left"
                    >
                      <div className="bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Citizen / User</h3>
                        <p className="text-xs text-slate-500">Access resources and your dashboard.</p>
                      </div>
                    </button>
                  </SignInButton>

                  <button 
                    onClick={() => setAuthStep('secret')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/20 transition-all group text-left"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Authority</h3>
                      <p className="text-xs text-slate-500">Access the secure management dashboard.</p>
                    </div>
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  {!isKeyVerified ? (
                    <>
                      <div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="password" 
                            placeholder="Enter your unique key" 
                            value={adminKey}
                            onChange={(e) => {
                              setAdminKey(e.target.value);
                              setKeyError(false);
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleVerifyKey()}
                            disabled={isVerifying}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                              keyError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        {keyError && <p className="text-red-500 text-xs font-bold mt-2 ml-1 animate-in fade-in">Invalid or inactive key. Please try again.</p>}
                      </div>
                      
                      <button 
                        onClick={handleVerifyKey}
                        disabled={isVerifying || !adminKey.trim()}
                        className="w-full flex justify-center items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors disabled:opacity-70"
                      >
                        {isVerifying ? <Loader2 size={20} className="animate-spin" /> : "Verify Key"}
                      </button>
                    </>
                  ) : (
                    <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-300">
                      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center rounded-full mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verification Successful</h3>
                      
                      <SignInButton mode="modal" forceRedirectUrl="/admin">
                        <button 
                          onClick={handleCloseModal}
                          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-2"
                        >
                          Proceed to Authority Login
                        </button>
                      </SignInButton>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;