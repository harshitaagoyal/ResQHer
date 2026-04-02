'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, User, FileText, CalendarClock, Camera, Edit3, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function IncidentCulpritInfoModal({ 
  isOpen, 
  onClose, 
  incident, 
  isEditing, 
  setIsEditing, 
  onSaveEdit, 
  isSaving 
}) {
  const [editName, setEditName] = useState('');
  const [editInfo, setEditInfo] = useState('');
  const [editCaughtAt, setEditCaughtAt] = useState('');
  const [editPicture, setEditPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (incident) {
      setEditName(incident.finalCulpritName || '');
      setEditInfo(incident.finalCulpritInfo || '');
      if (incident.finalCulpritCaughtAt) {
        const date = new Date(incident.finalCulpritCaughtAt);
        setEditCaughtAt(date.toISOString().slice(0, 16));
      }
      setPreview(incident.finalCulpritPicture || null);
    }
  }, [incident, isOpen]);

  if (!isOpen) return null;

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveEdit(editName, editInfo, editCaughtAt, editPicture);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl w-full max-w-lg border dark:border-slate-800 overflow-hidden">
        
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {isEditing ? <Edit3 size={20} className="text-pink-600"/> : <User size={20} className="text-pink-600"/>}
              Final Culprit Report
            </h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Verified Details</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center justify-center space-y-3">
            {isEditing ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 overflow-hidden"
              >
                {preview ? (
                  <img src={preview} alt="Culprit" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={24} className="text-slate-400" />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] py-1 text-center">Change Photo</div>
                <input type="file" ref={fileInputRef} onChange={handlePictureChange} className="hidden" accept="image/*" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Culprit" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-300" />
                )}
              </div>
            )}
          </div>

          <div className="grid gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Culprit Name</label>
              {isEditing ? (
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="font-bold dark:bg-slate-900" />
              ) : (
                <p className="text-lg font-bold text-slate-900 dark:text-white">{incident.finalCulpritName || 'Not Recorded'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <CalendarClock size={12}/> Date & Time Caught
              </label>
              {isEditing ? (
                <input 
                  type="datetime-local" 
                  value={editCaughtAt} 
                  onChange={(e) => setEditCaughtAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {incident.finalCulpritCaughtAt 
                    ? new Date(incident.finalCulpritCaughtAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                    : 'Date not logged'}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <FileText size={12}/> Detailed Info
              </label>
              {isEditing ? (
                <Textarea value={editInfo} onChange={(e) => setEditInfo(e.target.value)} className="min-h-[100px] dark:bg-slate-900" />
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border dark:border-slate-800">
                  {incident.finalCulpritInfo || 'No additional details provided.'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t dark:border-slate-800 flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="ghost" className="flex-1" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
              <Button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white gap-2 font-bold" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                Save Updates
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1 font-bold gap-2 dark:border-slate-700" onClick={() => setIsEditing(true)}>
                <Edit3 size={18}/> Edit Details
              </Button>
              <Button className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold" onClick={onClose}>
                Close Window
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}