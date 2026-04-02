'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react'; 

export default function IncidentDetailHeader({ 
  incident, 
  onBack, 
  onOpenCloseModal, 
  onOpenCulpritModal,
  onReopen 
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
        <div className="flex items-center gap-2">
          {/* Culprit Info Button */}
          <Button 
            variant="outline" 
            onClick={onOpenCulpritModal}
            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold"
          >
            Culprit Info
          </Button>

          {/* Reopen Case Toggle Button */}
          <Button 
            onClick={onReopen} 
            className="bg-emerald-500 hover:bg-amber-500 text-white font-bold gap-2 transition-all group"
            title="Click to Reopen Case"
          >
            <Check size={18} className="group-hover:hidden" />
            <RotateCcw size={18} className="hidden group-hover:block" />
            <span className="group-hover:hidden">Issue Closed</span>
            <span className="hidden group-hover:block">Reopen Case?</span>
          </Button>
        </div>
      ) : (
        <Button 
          onClick={onOpenCloseModal}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold"
        >
          Close Issue
        </Button>
      )}
    </div>
  );
}