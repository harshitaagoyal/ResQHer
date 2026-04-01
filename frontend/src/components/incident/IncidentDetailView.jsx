'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Phone, Calendar, User, FileText, MapPin, Activity } from 'lucide-react';

import IncidentCloseIssueModal from './IncidentCloseIssueModal';
import IncidentCulpritInfoModal from './IncidentCulpritInfoModal';
import IncidentDetailHeader from './IncidentDetailHeader';
import IncidentDataCard from './IncidentDataCard';
import IncidentEvidenceGallery from './IncidentEvidenceGallery';

const SingleIncidentMap = dynamic(() => import('@/components/SingleIncidentMap'), {
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

  const handleCloseIssueSubmit = async (name, info) => {
    if (!name || !info) return alert("Please fill in both the Culprit Name and Information.");
    setIsSubmittingClose(true);
    try {
      const response = await fetch('/api/close-incident', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: localIncident._id, culpritName: name, culpritInfo: info })
      });

      if (response.ok) {
        setLocalIncident({ ...localIncident, status: 'Closed', finalCulpritName: name, finalCulpritInfo: info });
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

  const handleSaveCulpritEditSubmit = async (name, info) => {
    if (!name || !info) return alert("Culprit Name and Information cannot be empty.");
    setIsSavingCulpritEdit(true);
    try {
      const response = await fetch('/api/update-culprit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: localIncident._id, finalCulpritName: name, finalCulpritInfo: info })
      });

      if (response.ok) {
        setLocalIncident({ ...localIncident, finalCulpritName: name, finalCulpritInfo: info });
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
      
      <IncidentDetailHeader 
        incident={localIncident}
        onBack={onBack}
        onOpenCloseModal={() => setShowCloseModal(true)}
        onOpenCulpritModal={() => { setIsEditingCulpritInfo(false); setShowCulpritInfoModal(true); }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <IncidentDataCard title="Preferred way of contact" icon={Phone}>
          <p className="text-sm text-slate-500 mb-1">{localIncident.preferredContact?.length > 0 ? localIncident.preferredContact.join(', ') : 'Not specified'}</p>
          <p className="font-medium dark:text-white">{localIncident.phone || localIncident.email || "No details provided"}</p>
        </IncidentDataCard>

        <IncidentDataCard title="Frequency & Duration" icon={Calendar}>
          <p className="font-medium dark:text-white">Frequency: {localIncident.frequency || "Not specified"}</p>
          {localIncident.occurrenceDuration && (
            <p className="text-sm text-slate-500 mt-1">Duration: {localIncident.occurrenceDuration}</p>
          )}
        </IncidentDataCard>

        <IncidentDataCard title="Situation Summary" icon={User}>
          <p className="font-medium dark:text-white text-sm leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {localIncident.currentSituation || localIncident.ai_summary || localIncident.other_info || "No details provided."}
          </p>
        </IncidentDataCard>

        <IncidentDataCard title="Initial Culprit details" icon={FileText} colSpan="col-span-1 md:col-span-2">
          <p className="font-medium text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {localIncident.culprit || localIncident.culprit_description || "Further details withheld for safety."}
          </p>
        </IncidentDataCard>

        <IncidentDataCard title="Current Status" icon={Activity}>
          <p className={`font-bold uppercase mb-2 ${localIncident.status === 'Closed' ? 'text-green-500' : 'text-pink-600'}`}>
            {localIncident.status || "Pending"}
          </p>
          <p className="text-xs text-slate-500">
            {localIncident.status === 'Closed' ? "This case has been resolved and closed." : "Resolve this issue by contacting the person and providing necessary aid."}
          </p>
        </IncidentDataCard>

        <IncidentEvidenceGallery attachments={localIncident.attachments} />

        {/* Location Map */}
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