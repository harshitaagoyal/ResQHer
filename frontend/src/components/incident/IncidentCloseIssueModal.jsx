'use client';
import React, { useState, useRef } from 'react';
import { X, Loader2, Camera, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function IncidentCloseIssueModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [culpritName, setCulpritName] = useState('');
  const [culpritInfo, setCulpritInfo] = useState('');
  const [caughtAt, setCaughtAt] = useState(''); 
  const [culpritPicture, setCulpritPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCulpritPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setPicturePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const clearPicture = () => {
    setCulpritPicture(null);
    setPicturePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!culpritName || !culpritInfo || !caughtAt) {
      alert("Please provide the Culprit Name, Information, and the Date/Time they were caught.");
      return;
    }
    onSubmit(culpritName, culpritInfo, caughtAt, culpritPicture);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl w-full max-w-xl border dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b dark:border-slate-800 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Close Issue & Finalize Case</h2>
            <p className="text-slate-500 mt-1">Record the final details, including capture data and imagery.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Final Culprit Name</label>
              <Input placeholder="E.g., Johnathan 'Viper' Doe" value={culpritName} onChange={(e) => setCulpritName(e.target.value)} className="dark:bg-slate-900" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Final Culprit Description/Info</label>
              <Textarea placeholder="Physical description, tattoos, known aliases, details of confrontation..." value={culpritInfo} onChange={(e) => setCulpritInfo(e.target.value)} className="min-h-[120px] dark:bg-slate-900" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><Camera size={16}/> Culprit Picture (Optional)</label>
                {picturePreview ? (
                  <div className="relative border-2 border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-900">
                    <img src={picturePreview} alt="Culprit preview" className="h-32 w-full object-cover rounded-lg" />
                    <button type="button" onClick={clearPicture} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg"><X size={14}/></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="h-36 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-all text-slate-500">
                    <Camera size={32} className="mb-2 opacity-50" />
                    <span className="text-xs font-semibold text-pink-700 dark:text-pink-400">Click to upload photo</span>
                    <input type="file" ref={fileInputRef} onChange={handlePictureChange} accept="image/*" className="hidden" />
                  </div>
                )}
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><CalendarClock size={16}/> Date & Time Caught</label>
                <input 
                  type="datetime-local" 
                  value={caughtAt} 
                  onChange={(e) => setCaughtAt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all dark:text-white"
                />
              </div>

            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-pink-600 hover:bg-pink-700 text-white font-bold gap-2 rounded-xl">
              {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Finalizing...</> : 'Confirm & Close Case'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}