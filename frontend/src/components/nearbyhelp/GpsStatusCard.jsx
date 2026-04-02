'use client';
import { Navigation, Loader2, AlertCircle, MapPin } from 'lucide-react';

export default function GpsStatusCard({ loading, error, location, onRetry }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
            <AlertCircle size={24} />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
            <Navigation size={24} className="fill-current" />
          </div>
        )}
        
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            {loading ? "Locating you..." : error ? "Location Access Denied" : "Location Secured"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? "Please wait while we acquire your GPS coordinates." : 
             error ? error : 
             `GPS Active: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}`}
          </p>
        </div>
      </div>
      
      <button 
        onClick={onRetry}
        className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
      >
        <MapPin size={16} /> Retry GPS
      </button>
    </div>
  );
}