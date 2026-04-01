'use client';

import React, { useEffect, useState, useRef } from 'react';
import AdminIncidentTable from '@/components/AdminIncidentTable';
import IncidentDetailView from '@/components/IncidentDetailView';
// 🚨 NEW: Imported Key, Copy, and Check icons
import { Search, Filter, Key, X, Copy, CheckCircle2, Loader2 } from 'lucide-react'; 

export default function AuthorityDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ location: 'All', severity: 'All', status: 'All' });
  const filterRef = useRef(null);

  // 🚨 NEW: States for the Key Manager Modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [generatedKey, setGeneratedKey] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-incidents');
      const data = await res.json();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚨 NEW: Function to generate the key via our new API
  const handleGenerateKey = async () => {
    if (!newOwnerName.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/create-admin-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: newOwnerName }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedKey(data.key);
      }
    } catch (error) {
      console.error("Failed to generate key", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeKeyModal = () => {
    setShowKeyModal(false);
    setTimeout(() => {
      setNewOwnerName('');
      setGeneratedKey(null);
      setCopied(false);
    }, 300);
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = incident.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'All' || incident.status === filters.status;
    const severityMap = incident.severity || "Medium";
    const matchesSeverity = filters.severity === 'All' || severityMap === filters.severity;
    let matchesLocation = true;
    if (filters.location !== 'All') {
      const hasGPS = typeof incident.location === 'object';
      if (filters.location === 'GPS Logged') matchesLocation = hasGPS;
      if (filters.location === 'Unknown') matchesLocation = !hasGPS;
    }
    return matchesSearch && matchesStatus && matchesSeverity && matchesLocation;
  });

  if (selectedIncident) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-8">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border dark:border-slate-800">
          <IncidentDetailView incident={selectedIncident} onBack={() => setSelectedIncident(null)} onUpdate={fetchIncidents} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Updates</h1>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          {/* 🚨 NEW: Key Manager Button */}
          <button 
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <Key size={16} /> Manage Access Keys
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex justify-between items-center pb-4 relative">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Filter size={16} /> Filters
            </button>
            {showFilters && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
                  <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none cursor-pointer">
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Severity</label>
                  <select value={filters.severity} onChange={(e) => setFilters({...filters, severity: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none cursor-pointer">
                    <option value="All">All Severities</option>
                    <option value="Very High">Very High</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Location</label>
                  <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm outline-none cursor-pointer">
                    <option value="All">All Locations</option>
                    <option value="GPS Logged">GPS Logged</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
        ) : (
          <AdminIncidentTable incidents={filteredIncidents} onViewDetails={(incident) => setSelectedIncident(incident)} onDeleteSuccess={fetchIncidents} />
        )}
      </div>

      {/* 🚨 NEW: The Key Manager Modal UI */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border dark:border-slate-700 animate-in zoom-in-95">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center relative">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key size={20} className="text-blue-500" /> Admin Access Keys
                </h2>
                <p className="text-sm text-slate-500 mt-1">Generate a secure login key for a new authority member.</p>
              </div>
              <button onClick={closeKeyModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-full transition">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              {!generatedKey ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Assignee Name / Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Officer Jane Doe" 
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleGenerateKey}
                    disabled={isGenerating || !newOwnerName.trim()}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 mt-2"
                  >
                    {isGenerating ? <Loader2 size={20} className="animate-spin" /> : "Generate Secure Key"}
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 animate-in slide-in-from-bottom-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center rounded-full mb-2">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Generated Successfully!</h3>
                    <p className="text-sm text-slate-500">Provide this exact key to {newOwnerName}.</p>
                  </div>
                  
                  <div className="relative group mt-4">
                    <div className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-2xl font-mono font-bold tracking-widest text-slate-900 dark:text-white break-all">
                      {generatedKey}
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-sm border dark:border-slate-700 transition text-slate-600 dark:text-slate-300 flex items-center gap-2 text-sm font-medium"
                    >
                      {copied ? <><CheckCircle2 size={16} className="text-green-500"/> Copied!</> : <><Copy size={16}/> Copy</>}
                    </button>
                  </div>
                  <button 
                    onClick={closeKeyModal}
                    className="w-full bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors mt-4"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}