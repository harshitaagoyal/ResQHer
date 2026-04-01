'use client';
import { ArrowLeft, Check, X } from 'lucide-react';

export default function IncidentDetailHeader({ 
  incident, 
  onBack, 
  onOpenCloseModal, 
  onOpenCulpritModal 
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {incident.name || incident.userName || "Anonymous"}
        </h1>
      </div>
      
      {incident.status === 'Closed' ? (
        <div className="flex gap-3 animate-in slide-in-from-right-4 duration-500">
          <button 
            onClick={onOpenCulpritModal}
            className="bg-white dark:bg-slate-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition shadow-sm cursor-pointer"
          >
            Culprit Info
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm cursor-default">
            <Check size={18} /> Issue Closed
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button 
            onClick={onOpenCloseModal} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <X size={16} /> Close Issue
          </button>
        </div>
      )}
    </div>
  );
}