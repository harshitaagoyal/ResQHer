'use client';
import { Check, Copy } from 'lucide-react';

export default function FooterContactItem({ href, icon: Icon, text, onCopy, isCopied, external }) {
  return (
    <li className="flex items-center gap-2">
      <a 
        href={href} 
        target={external ? "_blank" : "_self"}
        rel={external ? "noopener noreferrer" : ""}
        className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold hover:text-[#ed0b70] transition-colors group"
      >
        <Icon size={20} className="text-[#ed0b70] shrink-0 group-hover:scale-110 transition-transform" />
        <span>{text}</span>
      </a>
      {onCopy && (
        <button 
          onClick={onCopy} 
          className="ml-1 p-1 rounded-md text-slate-400 hover:text-[#ed0b70] transition-colors shrink-0 cursor-pointer" 
          title="Copy"
        >
          {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      )}
    </li>
  );
}