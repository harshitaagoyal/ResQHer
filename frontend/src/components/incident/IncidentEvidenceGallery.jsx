'use client';
import { Paperclip, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function IncidentEvidenceGallery({ attachments }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 md:col-span-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Paperclip className="text-pink-600" size={18} /> Attached Evidence ({attachments.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {attachments.map((attachment, idx) => {
          const fileUrl = typeof attachment === 'string' ? attachment : attachment?.url;
          return (
            <a 
              key={idx} 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative block rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 aspect-square bg-slate-100 dark:bg-slate-950 flex items-center justify-center cursor-pointer"
            >
              {fileUrl && (
                <img 
                  src={fileUrl} 
                  alt={`Evidence ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-2 text-center" style={{ display: fileUrl ? 'none' : 'flex' }}>
                <ImageIcon size={24} className="mb-2" />
                <span className="text-[10px] font-bold uppercase">View File</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}