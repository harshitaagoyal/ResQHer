'use client';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';

export default function InputFormEvidenceField({ attachments, setAttachments }) {
  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (indexToRemove) => {
    setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3 pt-2">
      <FormLabel className="text-base font-semibold">Attach Evidence (Photos)</FormLabel>
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors relative">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="text-pink-600 font-semibold">Click to upload</span> or drag and drop
        </p>
      </div>
      
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {attachments.map((file, idx) => (
            <div key={idx} className="relative flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 overflow-hidden">
                <ImageIcon className="h-4 w-4 text-pink-600 shrink-0" />
                <span className="text-xs font-medium truncate dark:text-slate-200">{file.name}</span>
              </div>
              <button 
                type="button" 
                onClick={() => removeFile(idx)} 
                className="p-1 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-500 rounded-md transition-colors shrink-0 ml-2 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}