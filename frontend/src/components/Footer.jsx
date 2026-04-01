'use client';

import React, { useState } from 'react';
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
  Check,
  Copy
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Separate function ONLY for copying — no interference with the mailto link
  const handleCopyEmail = (e) => {
    e.preventDefault(); // Prevent the <a> from firing when clicking the copy button
    e.stopPropagation();
    navigator.clipboard.writeText('resqher80@gmail.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
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

              <div className="relative">
  <button 
    type="button"
    onClick={handleShare}
    className="cursor-pointer p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-[#ed0b70] hover:bg-pink-50 transition-all border border-slate-100 dark:border-slate-800 flex items-center justify-center"
  >
    {copied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
  </button>
  
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
              <li><Link href="/create-post" className="text-slate-500 font-bold hover:text-[#ed0b70]">Report Now</Link></li>
              <li><Link href="/lawbot" className="text-slate-500 font-bold hover:text-[#ed0b70]">Law Bot</Link></li>
              <li><Link href="/therapybot" className="text-slate-500 font-bold hover:text-[#ed0b70]">Therapy Bot</Link></li>
              <li><Link href="/emergency-contacts" className="text-slate-500 font-bold hover:text-[#ed0b70]">Trust Circle</Link></li>
              <li><Link href="/nearby-help" className="text-slate-500 font-bold hover:text-[#ed0b70]">Nearby Help</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/about-us" className="text-slate-500 font-bold hover:text-[#ed0b70]">About Us</Link></li>
              <li><Link href="/vision" className="text-slate-500 font-bold hover:text-[#ed0b70]">Our Vision</Link></li>
              <li><Link href="/privacy" className="text-slate-500 font-bold hover:text-[#ed0b70]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 font-bold hover:text-[#ed0b70]">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">

              {/* Email row: mailto link + separate copy button */}
              <li className="flex items-center gap-2">
                {/* This <a> has NO onClick — pure native mailto, always works */}
                <a 
                  href="https://mail.google.com/mail/?view=cm&to=resqher80@gmail.com"
target="_blank"
rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold hover:text-[#ed0b70] transition-colors group"
                >
                  <Mail size={20} className="text-[#ed0b70] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>resqher80@gmail.com</span>
                </a>

                {/* Separate copy button that doesn't interfere with mailto */}
                <button
                  onClick={handleCopyEmail}
                  className="ml-1 p-1 rounded-md text-slate-400 hover:text-[#ed0b70] transition-colors shrink-0"
                  title="Copy email"
                >
                  {emailCopied 
                    ? <Check size={14} className="text-green-500" /> 
                    : <Copy size={14} />
                  }
                </button>
              </li>

              <li>
                <a 
                  href="tel:+910000000000" 
                  className="flex items-start gap-3 text-slate-500 dark:text-slate-400 font-bold hover:text-[#ed0b70] transition-colors group"
                >
                  <Phone size={20} className="text-[#ed0b70] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+91 0000000000</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.google.com/maps?q=Bangalore,+India" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-slate-500 dark:text-slate-400 font-bold hover:text-[#ed0b70] transition-colors group"
                >
                  <MapPin size={20} className="text-[#ed0b70] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Bangalore, India</span>
                </a>
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