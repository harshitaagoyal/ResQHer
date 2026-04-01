'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, MessageCircle, Share2, Users, Mail, Phone, MapPin, Heart } from 'lucide-react';

import FooterLinkGroup from './FooterLinkGroup';
import FooterSocialIcon from './FooterSocialIcon';
import FooterContactItem from './FooterContactItem';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyEmail = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    navigator.clipboard.writeText('resqher80@gmail.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  const platformLinks = [
    { label: 'Report Now', href: '/create-post' },
    { label: 'Law Bot', href: '/lawbot' },
    { label: 'Therapy Bot', href: '/therapybot' },
    { label: 'Trust Circle', href: '/emergency-contacts' },
    { label: 'Nearby Help', href: '/nearby-help' },
  ];

  const resourceLinks = [
    { label: 'About Us', href: '/about-us' },
    { label: 'Our Vision', href: '/vision' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-white dark:bg-[#020617] border-t border-slate-100 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              ResQ<span className="text-[#ed0b70]">Her</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Empowering women with technology-driven safety tools, legal guidance, and emotional support. Because every woman deserves to feel secure.
            </p>
            <div className="flex gap-4 items-center">
              <FooterSocialIcon href="#" icon={Globe} />
              <FooterSocialIcon href="#" icon={MessageCircle} />
              <FooterSocialIcon href="#" icon={Users} />
              <FooterSocialIcon icon={Share2} onClick={handleShare} isCopied={copied} />
            </div>
          </div>

          {/* Links */}
          <FooterLinkGroup title="Platform" links={platformLinks} />
          <FooterLinkGroup title="Resources" links={resourceLinks} />

          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <FooterContactItem 
                href="https://mail.google.com/mail/?view=cm&to=resqher80@gmail.com" 
                icon={Mail} 
                text="resqher80@gmail.com" 
                onCopy={handleCopyEmail} 
                isCopied={emailCopied} 
                external 
              />
              <FooterContactItem href="tel:+910000000000" icon={Phone} text="+91 0000000000" />
              <FooterContactItem href="https://www.google.com/maps?q=Bangalore,+India" icon={MapPin} text="Bangalore, India" external />
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