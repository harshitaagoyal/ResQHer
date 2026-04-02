'use client';
import { ArrowRight } from 'lucide-react';

export default function RoleCard({ 
  icon, 
  title, 
  description, 
  actionText, 
  onClick, 
  colorTheme = 'pink' 
}) {
  const themeClasses = {
    pink: {
      borderHover: 'hover:border-pink-500',
      shadowHover: 'hover:shadow-pink-500/10',
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconText: 'text-pink-600',
      actionTextClasses: 'text-pink-600 font-bold',
    },
    indigo: {
      borderHover: 'hover:border-indigo-500',
      shadowHover: 'hover:shadow-indigo-500/10',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconText: 'text-indigo-600',
      actionTextClasses: 'text-indigo-600 font-bold text-[11px] sm:text-xs uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full',
    }
  };

  const currentTheme = themeClasses[colorTheme];

  return (
    <button 
      onClick={onClick}
      className="w-full h-full text-left outline-none group relative cursor-pointer transition-transform hover:-translate-y-1"
    >
      <div className={`h-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-transparent ${currentTheme.borderHover} transition-all duration-300 shadow-xl ${currentTheme.shadowHover} flex flex-col items-center text-center`}>
        <div className={`w-20 h-20 ${currentTheme.iconBg} ${currentTheme.iconText} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
          {description}
        </p>
        <div className={`mt-auto flex items-center gap-2 ${currentTheme.actionTextClasses}`}>
          {actionText} {colorTheme === 'pink' && <ArrowRight size={20} />}
        </div>
      </div>
    </button>
  );
}