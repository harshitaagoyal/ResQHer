'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import AdminIncidentTable from '@/components/admin/AdminIncidentTable';
import IncidentDetailView from '@/components/incident/IncidentDetailView';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFilters from '@/components/admin/AdminFilters';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [incidents, setIncidents] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/select-role');
    }
  }, [isLoaded, user, router]);

  const fetchIncidents = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/get-incidents'); 
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchIncidents();
    }
  }, [isLoaded, user]);

  const filteredIncidents = incidents.filter(incident => {
    const nameToCheck = (incident.name || incident.userName || "Anonymous").toLowerCase();
    const locToCheck = (typeof incident.location === 'string' ? incident.location : "gps logged").toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = nameToCheck.includes(searchLower) || locToCheck.includes(searchLower);

    const matchesSeverity = filterSeverity === 'All' || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || (incident.status || 'Pending') === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  // --- RESTRUCTURED RETURN SECTION ---
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 🚨 HEADER NOW STAYS VISIBLE FOR BOTH VIEWS */}
        <AdminHeader />

        {selectedIncident ? (
          /* --- INCIDENT DETAIL VIEW --- */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IncidentDetailView 
              incident={selectedIncident} 
              onBack={() => setSelectedIncident(null)} 
              onUpdate={fetchIncidents} 
            />
          </div>
        ) : (
          /* --- MAIN DASHBOARD VIEW --- */
          <div className="space-y-6 animate-in fade-in duration-500">
            <AdminFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterSeverity={filterSeverity}
              setFilterSeverity={setFilterSeverity}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            <div className="mt-4">
              {isLoadingData ? (
                <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500">
                  <Loader2 className="animate-spin mb-4 text-indigo-500" size={32} />
                  <p>Loading active incidents...</p>
                </div>
              ) : (
                <AdminIncidentTable 
                  incidents={filteredIncidents} 
                  onViewDetails={(incident) => setSelectedIncident(incident)}
                  onDeleteSuccess={fetchIncidents}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}