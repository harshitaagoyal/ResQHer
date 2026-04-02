'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Phone, Calendar, User, FileText, MapPin, Activity } from 'lucide-react';

import IncidentCloseIssueModal from './IncidentCloseIssueModal';
import IncidentCulpritInfoModal from './IncidentCulpritInfoModal';
import IncidentDetailHeader from './IncidentDetailHeader';
import IncidentDataCard from './IncidentDataCard';
import IncidentEvidenceGallery from './IncidentEvidenceGallery';

const SingleIncidentMap = dynamic(() => import('@/components/incident/SingleIncidentMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
});

export default function IncidentDetailView({ incident, onBack, onUpdate }) {
  const [localIncident, setLocalIncident] = useState(incident);
  
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCulpritInfoModal, setShowCulpritInfoModal] = useState(false);
  
  const [isSubmittingClose, setIsSubmittingClose] = useState(false);
  const [isEditingCulpritInfo, setIsEditingCulpritInfo] = useState(false);
  const [isSavingCulpritEdit, setIsSavingCulpritEdit] = useState(false);

  // --- REOPEN FUNCTION ---
  const handleReopen = async () => {
    const confirmed = window.confirm("Are you sure you want to reopen this case?");
    if (!confirmed) return;

    try {
      const response = await fetch('/api/reopen-incident', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: localIncident._id })
      });

      if (response.ok) {
        setLocalIncident({ ...localIncident, status: 'Pending' });
        if (onUpdate) onUpdate();
        alert("Case has been reopened and set to Pending.");
      } else {
        alert("Failed to reopen case. Check your API route.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // --- CLOSE ISSUE FUNCTION ---
  const handleCloseIssueSubmit = async (name, info, caughtAt, pictureFile) => {
    if (!name || !info || !caughtAt) return alert("Please fill in the Culprit Name, Information, and Caught Date.");
    
    setIsSubmittingClose(true);
    try {
      const formData = new FormData();
      formData.append('id', localIncident._id);
      formData.append('culpritName', name);
      formData.append('culpritInfo', info);
      formData.append('culpritCaughtAt', caughtAt);
      
      if (pictureFile) {
        formData.append('culpritPicture', pictureFile);
      }

      const response = await fetch('/api/close-incident', {
        method: 'PATCH',
        body: formData 
      });

      if (response.ok) {
        const result = await response.json();
        
        setLocalIncident({ 
          ...localIncident, 
          status: 'Closed', 
          finalCulpritName: name, 
          finalCulpritInfo: info,
          finalCulpritCaughtAt: caughtAt, 
          ...(result.finalCulpritPicture && { finalCulpritPicture: result.finalCulpritPicture })
        });
        
        setShowCloseModal(false);
        if (onUpdate) onUpdate(); 
      } else {
        alert("Failed to close the issue.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmittingClose(false);
    }
  };

  // --- EDIT CULPRIT INFO FUNCTION ---
  const handleSaveCulpritEditSubmit = async (name, info, caughtAt, pictureFile) => {
    if (!name || !info) return alert("Culprit Name and Information cannot be empty.");
    setIsSavingCulpritEdit(true);
    try {
      const formData = new FormData();
      formData.append('id', localIncident._id);
      formData.append('finalCulpritName', name);
      formData.append('finalCulpritInfo', info);
      if (caughtAt) formData.append('finalCulpritCaughtAt', caughtAt);
      if (pictureFile) formData.append('finalCulpritPicture', pictureFile);

      const response = await fetch('/api/update-culprit', {
        method: 'PATCH',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setLocalIncident({ 
          ...localIncident, 
          finalCulpritName: name, 
          finalCulpritInfo: info,
          finalCulpritCaughtAt: caughtAt,
          ...(result.finalCulpritPicture && { finalCulpritPicture: result.finalCulpritPicture })
        });
        setIsEditingCulpritInfo(false);
        if (onUpdate) onUpdate();
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
      
      {/* 🚨 HEADER: onReopen is properly passed here */}
      <IncidentDetailHeader 
        incident={localIncident}
        onBack={onBack}
        onOpenCloseModal={() => setShowCloseModal(true)}
        onOpenCulpritModal={() => { setIsEditingCulpritInfo(false); setShowCulpritInfoModal(true); }}
        onReopen={handleReopen} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <IncidentDataCard title="Date & Time Submitted" icon={Calendar} colSpan="col-span-1">
          <p className="text-xl font-bold dark:text-white mb-1">
            {localIncident.createdAt 
              ? new Date(localIncident.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) 
              : "Date Unknown"}
          </p>
          <p className="text-sm text-slate-500 font-medium">
            {localIncident.createdAt 
              ? new Date(localIncident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : "Time Unknown"}
          </p>
        </IncidentDataCard>

        {/* Dynamic Contact Card */}
        <IncidentDataCard title="Preferred way of contact" icon={Phone} colSpan="col-span-1">
          <p className="text-xs text-slate-500 mb-3 italic">
            {localIncident.preferredContact?.length > 0 
              ? `Requested via: ${localIncident.preferredContact.join(', ')}` 
              : 'No preference set'}
          </p>

          <div className="flex flex-col gap-3">
            {localIncident.phone && localIncident.preferredContact?.includes('Phone') && (
              <a 
                href={`tel:${localIncident.phone}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
              >
                Call {localIncident.phone}
              </a>
            )}

            {localIncident.phone && localIncident.preferredContact?.includes('Text message') && (
              <a 
                href={`sms:${localIncident.phone}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 rounded-xl text-sm font-bold border-2 border-pink-100 dark:border-pink-900/30 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all active:scale-95"
              >
                Send Message
              </a>
            )}

            {localIncident.email && localIncident.preferredContact?.includes('Email') && (
              <a 
                href={`mailto:${localIncident.email}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              >
                Email: {localIncident.email}
              </a>
            )}

            {(!localIncident.preferredContact || localIncident.preferredContact.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-2">No contact method selected.</p>
            )}
          </div>
        </IncidentDataCard>

        <IncidentDataCard title="Current Status" icon={Activity} colSpan="col-span-1">
          <p className={`font-bold uppercase mb-2 ${localIncident.status === 'Closed' ? 'text-green-500' : 'text-pink-600'}`}>
            {localIncident.status || "Pending"}
          </p>
          <p className="text-xs text-slate-500">
            {localIncident.status === 'Closed' ? "Case resolved." : "Action required."}
          </p>
        </IncidentDataCard>

        <IncidentDataCard title="Duration" icon={Calendar} colSpan="col-span-1">
          {localIncident.occurrenceDuration && (
            <p className="text-sm text-slate-500 mt-1">Duration: {localIncident.occurrenceDuration}</p>
          )}
        </IncidentDataCard>

        <IncidentDataCard title="Situation Summary" icon={User} colSpan="col-span-1 md:col-span-2">
          <p className="font-medium dark:text-white text-sm leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {localIncident.currentSituation || localIncident.ai_summary || localIncident.other_info || "No details provided."}
          </p>
        </IncidentDataCard>

        <IncidentDataCard title="Initial Culprit details" icon={FileText} colSpan="col-span-1 md:col-span-3">
          <p className="font-medium text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {localIncident.culprit || localIncident.culprit_description || "Further details withheld for safety."}
          </p>
        </IncidentDataCard>

        <div className="col-span-1 md:col-span-3">
          <IncidentEvidenceGallery attachments={localIncident.attachments} />
        </div>

        <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 md:col-span-3 h-[300px] relative overflow-hidden">
          <div className="absolute top-4 left-6 z-[1] bg-white/90 dark:bg-slate-900/90 p-3 rounded-lg shadow-md backdrop-blur-sm pointer-events-none">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MapPin size={16} className="text-pink-600" /> GPS Coordinates
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {localIncident.location?.lat ? `${localIncident.location.lat.toFixed(6)}, ${localIncident.location.lng.toFixed(6)}` : "Tracking unavailable"}
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

      <IncidentCloseIssueModal 
        isOpen={showCloseModal} 
        onClose={() => setShowCloseModal(false)} 
        onSubmit={handleCloseIssueSubmit}
        isSubmitting={isSubmittingClose}
      />

      {/* 🚨 MODAL: onReopen removed from here, properly hooked up to edit data */}
      <IncidentCulpritInfoModal 
        isOpen={showCulpritInfoModal} 
        onClose={() => setShowCulpritInfoModal(false)}
        incident={localIncident}
        isEditing={isEditingCulpritInfo}
        setIsEditing={setIsEditingCulpritInfo}
        onSaveEdit={handleSaveCulpritEditSubmit}
        isSaving={isSavingCulpritEdit}
      />

    </div>
  );
}