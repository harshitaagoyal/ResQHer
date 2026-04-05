'use client';
import { Filter, X } from 'lucide-react';

export default function AdminFilters({ 
  searchQuery, setSearchQuery, 
  filterSeverity, setFilterSeverity, 
  filterStatus, setFilterStatus,
  showFilters, setShowFilters 
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full">
      
      <div className="relative w-full sm:w-96">
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
        />
      </div>

      <div className="relative">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Filter size={16} /> Filters
          {(filterSeverity !== 'All' || filterStatus !== 'All') && (
            <span className="w-2 h-2 rounded-full bg-pink-600 ml-1"></span>
          )}
        </button>

        {showFilters && (
          <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-14 sm:top-12 w-full sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Filter Incidents</h3>
              <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16}/></button>
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
  );
}