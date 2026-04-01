'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Paperclip } from "lucide-react";

export default function AdminIncidentTable({ incidents, onViewDetails, onDeleteSuccess }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortDirection, setSortDirection] = useState(null); 

  useEffect(() => {
    const closeDropdown = () => setOpenDropdown(null);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  if (!incidents || incidents.length === 0) {
    return <div className="text-center p-10 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800">No incidents found matching your criteria.</div>;
  }

  const handleSort = () => {
    if (sortDirection === null) setSortDirection('desc'); 
    else if (sortDirection === 'desc') setSortDirection('asc'); 
    else setSortDirection(null); 
  };

  const severityRank = { "Very High": 4, "High": 3, "Medium": 2, "Low": 1 };

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (!sortDirection) return 0; 
    
    const rankA = severityRank[a.severity || "Medium"] || 0;
    const rankB = severityRank[b.severity || "Medium"] || 0;
    
    if (sortDirection === 'desc') return rankB - rankA;
    return rankA - rankB;
  });

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this report? This cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/delete-incident?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        if (onDeleteSuccess) onDeleteSuccess(); 
      } else {
        alert("Failed to delete the report.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-visible shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">S.No</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">
                <button 
                  onClick={handleSort}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors outline-none cursor-pointer"
                >
                  Severity 
                  {sortDirection === 'desc' ? <ArrowDown size={14} /> : sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowUpDown size={14} className="opacity-50" />}
                </button>
              </th>
              <th className="px-6 py-4 font-medium text-center">Issue</th>
              <th className="px-6 py-4 font-medium">Status</th>
              
              {/* 🚨 NEW: Evidence Column Header */}
              <th className="px-6 py-4 font-medium text-center">Evidence</th>
              
              <th className="px-6 py-4 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedIncidents.map((incident, index) => (
              <tr key={incident._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900">
                
                <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  <button 
                    onClick={() => onViewDetails(incident)}
                    className="hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus:outline-none transition-colors text-left font-bold cursor-pointer"
                  >
                    {incident.name || incident.userName || "Anonymous"}
                  </button>
                </td>

                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  {typeof incident.location === 'object' ? "GPS Logged" : incident.location || "Location Unknown"}
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${
                    incident.severity === 'Very High' ? 'bg-red-600' :
                    incident.severity === 'High' ? 'bg-red-500' : 
                    incident.severity === 'Low' ? 'bg-emerald-500' :
                    'bg-blue-500'
                  }`}>
                    {incident.severity || "Medium"}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-center">
                  <p className="max-w-[150px] truncate mx-auto">
                    {incident.currentSituation || incident.other_info || "Not provided"}
                  </p>
                </td>

                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{incident.status || "Pending"}</td>
                
                {/* 🚨 NEW: Evidence Column Data */}
                <td className="px-6 py-4 text-center">
                  {incident.attachments && incident.attachments.length > 0 ? (
                    <div className="flex items-center justify-center gap-1.5 text-pink-600 font-bold bg-pink-50 dark:bg-pink-900/20 px-2.5 py-1 rounded-md w-max mx-auto border border-pink-100 dark:border-pink-900/50">
                      <Paperclip size={14} /> 
                      <span>{incident.attachments.length}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-700 font-medium">-</span>
                  )}
                </td>

                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setOpenDropdown(openDropdown === incident._id ? null : incident._id); 
                    }} 
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-500 cursor-pointer"
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {openDropdown === incident._id && (
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="absolute right-6 top-10 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border-b dark:border-slate-700">Actions</div>
                      <button onClick={() => { navigator.clipboard.writeText(incident._id); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Copy ID</button>
                      <button onClick={() => { onViewDetails(incident); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-b dark:border-slate-700 cursor-pointer">View Details</button>
                      <button 
                        onClick={() => handleDelete(incident._id)}
                        disabled={isDeleting}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                      >
                        Delete <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}