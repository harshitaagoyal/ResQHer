'use client';
import { MoreHorizontal, Trash2, Paperclip } from "lucide-react";

export default function AdminIncidentTableRow({ 
  incident, 
  index, 
  onViewDetails, 
  onDelete, 
  isDeleting,
  isDropdownOpen,
  onToggleDropdown 
}) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900">
      <td className="px-6 py-4 text-slate-500">{index + 1}</td>
      
      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
        <button 
          onClick={() => onViewDetails(incident)}
          className="hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus:outline-none transition-colors text-left font-bold cursor-pointer"
        >
          {incident.name || incident.userName || "Anonymous"}
        </button>
      </td>
<td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
  {incident.createdAt ? new Date(incident.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
  <div className="text-xs text-slate-400">
    {incident.createdAt ? new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
  </div>
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

      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
        {incident.status || "Pending"}
      </td>
      
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
            onToggleDropdown(); 
          }} 
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-500 cursor-pointer"
        >
          <MoreHorizontal size={20} />
        </button>

        {isDropdownOpen && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="absolute right-6 top-10 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2"
          >
            <div className="px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border-b dark:border-slate-700">Actions</div>
            <button onClick={() => { navigator.clipboard.writeText(incident._id); onToggleDropdown(); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Copy ID</button>
            <button onClick={() => { onViewDetails(incident); onToggleDropdown(); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-b dark:border-slate-700 cursor-pointer">View Details</button>
            <button 
              onClick={() => onDelete(incident._id)}
              disabled={isDeleting}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              Delete <Trash2 size={14} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}