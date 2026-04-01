'use client';

import React, { useState } from 'react'; // Added useState
import Link from 'next/link';
import { 
  Globe, 
  MessageCircle, 
  Share2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Check // Added Check icon for the success state
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    // Copies the current website URL to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      // Reset the "Copied" message after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer className="bg-white dark:bg-[#020617] border-t border-slate-100 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              ResQ<span className="text-[#ed0b70]">Her</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Empowering women with technology-driven safety tools, legal guidance, and emotional support. Because every woman deserves to feel secure.
            </p>
            
            <div className="flex gap-4 items-center">
              <Link href="#" className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-[#ed0b70] hover:bg-pink-50 transition-all border border-slate-100 dark:border-slate-800">
                <Globe size={20} />
              </Link>
              <Link href="#" className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-[#ed0b70] hover:bg-pink-50 transition-all border border-slate-100 dark:border-slate-800">
                <MessageCircle size={20} />
              </Link>
              <Link href="#" className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-[#ed0b70] hover:bg-pink-50 transition-all border border-slate-100 dark:border-slate-800">
                <Users size={20} />
              </Link>

              {/* Share Button with Clipboard Logic */}
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-[#ed0b70] hover:bg-pink-50 transition-all border border-slate-100 dark:border-slate-800 flex items-center justify-center"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
                </button>
                
                {/* Tooltip message */}
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest animate-bounce">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4">
              {['Safety Features', 'Law Bot', 'Therapy Bot', 'Trust Circle', 'Fake Call'].map((item) => (
                <li key={item}>
                  <Link href="/about" className="text-slate-500 dark:text-slate-400 font-bold hover:text-[#ed0b70] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-500 font-bold hover:text-[#ed0b70]">About Us</Link></li>
              <li><Link href="/blog" className="text-slate-500 font-bold hover:text-[#ed0b70]">Safety Blog</Link></li>
              <li><Link href="/privacy" className="text-slate-500 font-bold hover:text-[#ed0b70]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 font-bold hover:text-[#ed0b70]">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 font-bold">
                <Mail size={20} className="text-[#ed0b70] mt-1 shrink-0" />
                <span>resqher80@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 font-bold">
                <Phone size={20} className="text-[#ed0b70] mt-1 shrink-0" />
                <span>+91 0000000000</span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 font-bold">
                <MapPin size={20} className="text-[#ed0b70] mt-1 shrink-0" />
                <span>Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-slate-400 font-bold text-sm">
            © {currentYear} <span className="text-slate-900 dark:text-white font-black">ResQHer</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400 font-bold text-sm">
            Made with <Heart size={16} className="text-[#ed0b70] fill-[#ed0b70]" /> for a Safer World
          </p>
        </div>
      </div>
    </footer>
  );
}