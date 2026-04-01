'use client';
import React, { useState } from 'react';
import { ArrowLeft, Phone, Calendar, User, FileText, MapPin, Activity, X, Check, Loader2, Edit2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const SingleIncidentMap = dynamic(() => import('@/components/SingleIncidentMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
});

export default function IncidentDetailView({ incident, onBack, onUpdate }) {
  const [localIncident, setLocalIncident] = useState(incident);
  
  // Modal States
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCulpritInfoModal, setShowCulpritInfoModal] = useState(false);
  
  // Close Issue Form States
  const [culpritName, setCulpritName] = useState('');
  const [culpritInfo, setCulpritInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚨 NEW: Edit Culprit Info States
  const [isEditingCulpritInfo, setIsEditingCulpritInfo] = useState(false);
  const [editableCulpritName, setEditableCulpritName] = useState('');
  const [editableCulpritInfo, setEditableCulpritInfo] = useState('');
  const [isSavingCulpritEdit, setIsSavingCulpritEdit] = useState(false);

  // Function to save the closed case to MongoDB
  const handleCloseIssue = async () => {
    if (!culpritName || !culpritInfo) {
      return alert("Please fill in both the Culprit Name and Information.");
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/close-incident', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: localIncident._id,
          culpritName: culpritName,
          culpritInfo: culpritInfo
        })
      });

      if (response.ok) {
        setLocalIncident({
          ...localIncident, 
          status: 'Closed',
          finalCulpritName: culpritName,
          finalCulpritInfo: culpritInfo
        });
        setShowCloseModal(false);
        if (onUpdate) onUpdate(); // Refreshes table in background
      } else {
        alert("Failed to close the issue.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚨 NEW: Function to initiate the edit mode
  const handleEditCulpritClick = () => {
    setEditableCulpritName(localIncident.finalCulpritName || '');
    setEditableCulpritInfo(localIncident.finalCulpritInfo || '');
    setIsEditingCulpritInfo(true);
  };

  // 🚨 NEW: Function to cancel the edit mode
  const handleCancelCulpritEdit = () => {
    setIsEditingCulpritInfo(false);
  };

  // 🚨 NEW: Function to save the EDITED culprit details to MongoDB
  const handleSaveCulpritEdit = async () => {
    if (!editableCulpritName || !editableCulpritInfo) {
        return alert("Culprit Name and Information cannot be empty.");
    }

    setIsSavingCulpritEdit(true);
    try {
        const response = await fetch('/api/update-culprit', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: localIncident._id,
                finalCulpritName: editableCulpritName,
                finalCulpritInfo: editableCulpritInfo
            })
        });

        if (response.ok) {
            // Update local state instantly
            setLocalIncident({
                ...localIncident,
                finalCulpritName: editableCulpritName,
                finalCulpritInfo: editableCulpritInfo
            });
            setIsEditingCulpritInfo(false);
            if (onUpdate) onUpdate(); // Refresh parent table quietly
        } else {
            alert("Failed to update culprit details.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong while saving updates.");
    } finally {
        setIsSavingCulpritEdit(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{localIncident.name}</h1>
        </div>
        
        {localIncident.status === 'Closed' ? (
          <div className="flex gap-3 animate-in slide-in-from-right-4 duration-500">
            <button 
              onClick={() => {
                setIsEditingCulpritInfo(false); // Reset edit state when opening modal
                setShowCulpritInfoModal(true);
              }}
              className="bg-white dark:bg-slate-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition shadow-sm"
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
              onClick={() => setShowCloseModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              <X size={16} /> Close Issue
            </button>
          </div>
        )}
      </div>

      {/* Grid Layout (Unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Preferred way of contact</h3>
            <Phone size={18} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 mb-1">
            {localIncident.preferredContact?.length > 0 ? localIncident.preferredContact.join(', ') : 'Not specified'}
          </p>
          <p className="font-medium dark:text-white">
            {localIncident.phone || localIncident.email || "No details provided"}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Frequency & Duration</h3>
            <Calendar size={18} className="text-slate-400" />
          </div>
          <p className="font-medium dark:text-white">
            Frequency: {localIncident.frequency || "Not specified"}
          </p>
          {localIncident.occurrenceDuration && (
            <p className="text-sm text-slate-500 mt-1">
              Duration: {localIncident.occurrenceDuration} months
            </p>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Situation Summary</h3>
            <User size={18} className="text-slate-400" />
          </div>
          <p className="font-medium dark:text-white text-sm leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {localIncident.currentSituation || localIncident.ai_summary || localIncident.other_info || "No details provided."}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Initial Culprit details</h3>
            <FileText size={18} className="text-slate-400" />
          </div>
          <p className="font-medium text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {localIncident.culprit || localIncident.culprit_description || "Further details withheld for safety."}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Current Status</h3>
            <Activity size={18} className="text-slate-400" />
          </div>
          <p className={`font-bold uppercase mb-2 ${localIncident.status === 'Closed' ? 'text-green-500' : 'text-pink-600'}`}>
            {localIncident.status || "Pending"}
          </p>
          <p className="text-xs text-slate-500">
            {localIncident.status === 'Closed' ? "This case has been resolved and closed." : "Resolve this issue by contacting the person and providing necessary aid."}
          </p>
        </div>

        <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 md:col-span-3 h-[300px] relative overflow-hidden">
          <div className="absolute top-4 left-6 z-[1] bg-white/90 dark:bg-slate-900/90 p-3 rounded-lg shadow-md backdrop-blur-sm pointer-events-none">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MapPin size={16} className="text-pink-600" /> GPS Coordinates
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {localIncident.location?.lat 
                ? `${localIncident.location.lat.toFixed(6)}, ${localIncident.location.lng.toFixed(6)}` 
                : "Tracking unavailable"}
            </p>
          </div>
          {localIncident.location?.lat ? (
            <div className="h-full w-full rounded-lg overflow-hidden">
              <SingleIncidentMap lat={localIncident.location.lat} lng={localIncident.location.lng} />
            </div>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 text-slate-400 rounded-lg">
              <MapPin size={32} className="mb-2 opacity-20" />
              <p>Location data not provided for this report.</p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: Close Issue Form */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border dark:border-slate-700 animate-in zoom-in-95">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold dark:text-white">Close Issue</h2>
                <p className="text-xs text-slate-500">Record final culprit details to close this case.</p>
              </div>
              <button onClick={() => setShowCloseModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Name</label>
                <input 
                  type="text" 
                  className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="E.g., John Doe"
                  value={culpritName}
                  onChange={(e) => setCulpritName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Info</label>
                <textarea 
                  className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Physical description, tattoos, known aliases..."
                  value={culpritInfo}
                  onChange={(e) => setCulpritInfo(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleCloseIssue}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Confirm Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚨 UPDATED MODAL 2: View & EDIT Saved Culprit Info */}
      {showCulpritInfoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border dark:border-slate-700 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  <Check size={20} className="text-green-500"/> Final Culprit Report
                </h2>
                <p className="text-xs text-slate-500">Details recorded when case was closed.</p>
              </div>
              <button onClick={() => setShowCulpritInfoModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {isEditingCulpritInfo ? (
                // 🚨 Edit View
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Name</label>
                        <input 
                            type="text" 
                            className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={editableCulpritName}
                            onChange={(e) => setEditableCulpritName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Culprit Info</label>
                        <textarea 
                            className="w-full border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-sm h-32 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={editableCulpritInfo}
                            onChange={(e) => setEditableCulpritInfo(e.target.value)}
                        />
                    </div>
                </div>
              ) : (
                // 🚨 Static View (Same as before)
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-3 gap-4 border-b dark:border-slate-800 pb-4">
                    <span className="font-bold text-slate-500">Name</span>
                    <span className="col-span-2 font-medium dark:text-white text-lg">
                      {localIncident.finalCulpritName || "Unknown"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-bold text-slate-500">Info</span>
                    <span className="col-span-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {localIncident.finalCulpritInfo || "No additional information recorded."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                {isEditingCulpritInfo ? (
                    // 🚨 Buttons for Edit Mode
                    <>
                        <button 
                            onClick={handleCancelCulpritEdit}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveCulpritEdit}
                            disabled={isSavingCulpritEdit}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            {isSavingCulpritEdit ? <Loader2 size={16} className="animate-spin" /> : "Save Updates"}
                        </button>
                    </>
                ) : (
                    // 🚨 Buttons for Static Mode
                    <>
                        <button 
                            onClick={handleEditCulpritClick}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2"
                        >
                            <Edit2 size={16}/> Edit Details
                        </button>
                        <button 
                            onClick={() => setShowCulpritInfoModal(false)}
                            className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition"
                        >
                            Close Window
                        </button>
                    </>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}