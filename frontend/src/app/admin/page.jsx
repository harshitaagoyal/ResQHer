'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // 🚨 NEW: Imported Link for the logo
import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Filter, X } from 'lucide-react';

import AdminIncidentTable from '@/components/AdminIncidentTable';
import IncidentDetailView from '@/components/IncidentDetailView';
import { ModeToggle } from '@/components/ModeToggle'; 

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

  if (selectedIncident) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* 🚨 LOGO FOR DETAILS VIEW 🚨 */}
          <div className="flex items-center pb-2">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                ResQ<span className="text-pink-600">Her</span>
              </span>
            </Link>
          </div>

          <IncidentDetailView 
            incident={selectedIncident} 
            onBack={() => setSelectedIncident(null)} 
            onUpdate={fetchIncidents} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 🚨 ADMIN LOGO / BRANDING 🚨 */}
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              ResQ<span className="text-pink-600">Her</span>
            </span>
            <span className="ml-2 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              Admin Hub
            </span>
          </Link>
        </div>

        {/* HEADER: Live Updates + User Controls */}
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Updates</h1>
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Filter size={16} /> Filters
              {(filterSeverity !== 'All' || filterStatus !== 'All') && (
                <span className="w-2 h-2 rounded-full bg-pink-600 ml-1"></span>
              )}
            </button>

            {/* Filter Dropdown Menu */}
            {showFilters && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Filter Incidents</h3>
                  <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Severity</label>
                    <select 
                      value={filterSeverity} 
                      onChange={(e) => setFilterSeverity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="All">All Severities</option>
                      <option value="Very High">Very High</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Status</label>
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => { setFilterSeverity('All'); setFilterStatus('All'); }}
                    className="w-full text-xs font-bold text-pink-600 hover:text-pink-700 py-1"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Component */}
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
    </div>
  );
}