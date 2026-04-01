'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function FooterSocialIcon({ href, icon: Icon, onClick, isCopied }) {
  return (
    <div className="relative">
      {onClick ? (
        <button 
          type="button" 
          onClick={onClick}
          className="cursor-pointer p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-[#ed0b70] hover:bg-pink-50 transition-all border border-slate-100 dark:border-slate-800 flex items-center justify-center"
        >
          {isCopied ? <Check size={20} className="text-green-500" /> : <Icon size={20} />}
        </button>
      ) : (
        <Link href={href || '#'} className="flex p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-[#ed0b70] hover:bg-pink-50 transition-all border border-slate-100 dark:border-slate-800">
          <Icon size={20} />
        </Link>
      )}
      {isCopied && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest animate-bounce">
          Copied!
        </span>
      )}
    </div>
  );
}