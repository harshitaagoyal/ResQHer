'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import AdminIncidentTableRow from './AdminIncidentTableRow'; // Import the new row component

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
              <th className="px-6 py-4 font-medium text-center">Evidence</th>
              <th className="px-6 py-4 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedIncidents.map((incident, index) => (
              <AdminIncidentTableRow 
                key={incident._id}
                incident={incident}
                index={index}
                onViewDetails={onViewDetails}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                isDropdownOpen={openDropdown === incident._id}
                onToggleDropdown={() => setOpenDropdown(openDropdown === incident._id ? null : incident._id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}