'use client';
import { useState, useEffect } from 'react';
import { Check, X, Edit2, Loader2 } from 'lucide-react';

export default function IncidentCulpritInfoModal({ 
  isOpen, onClose, incident, 
  isEditing, setIsEditing, onSaveEdit, isSaving
}) {
  const [editName, setEditName] = useState(incident.finalCulpritName || '');
  const [editInfo, setEditInfo] = useState(incident.finalCulpritInfo || '');

  useEffect(() => {
    if (isEditing) {
      setEditName(incident.finalCulpritName || '');
      setEditInfo(incident.finalCulpritInfo || '');
    }
  }, [isEditing, incident]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border dark:border-slate-700 animate-in zoom-in-95">
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <Check size={20} className="text-green-500"/> Final Culprit Report
            </h2>
            <p className="text-xs text-slate-500">Details recorded when case was closed.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        
        <div className="p-6 space-y-4">
          {isEditing ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Name</label>
                <input 
                  type="text" 
                  className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Info</label>
                <textarea 
                  className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm h-32 focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={editInfo}
                  onChange={(e) => setEditInfo(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-3 gap-4 border-b dark:border-slate-800 pb-4">
                <span className="font-bold text-slate-500">Name</span>
                <span className="col-span-2 font-medium dark:text-white text-lg">
                  {incident.finalCulpritName || "Unknown"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="font-bold text-slate-500">Info</span>
                <span className="col-span-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {incident.finalCulpritInfo || "No additional information recorded."}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition">Cancel</button>
              <button 
                onClick={() => onSaveEdit(editName, editInfo)}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Save Updates"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2">
                <Edit2 size={16}/> Edit Details
              </button>
              <button onClick={onClose} className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition">
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}