'use client';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function IncidentCloseIssueModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border dark:border-slate-700 animate-in zoom-in-95">
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Close Issue</h2>
            <p className="text-xs text-slate-500">Record final culprit details to close this case.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Name</label>
            <input 
              type="text" 
              className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="E.g., John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Info</label>
            <textarea 
              className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Physical description, tattoos, known aliases..."
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition">
            Cancel
          </button>
          <button 
            onClick={() => onSubmit(name, info)}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Confirm Close"}
          </button>
        </div>
      </div>
    </div>
  );
}