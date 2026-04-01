'use client';
import React, { useState } from 'react';
import { FileSearch, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthorityDecoder() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDecode = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/decompose', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data.hiddenMessage || "No hidden data found.");
    } catch (err) {
      setResult("Error decoding image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-xl max-w-2xl mx-auto">
      <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
        <FileSearch className="text-pink-600" /> Steganography Decoder
      </h2>
      
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center mb-6">
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          className="hidden" 
          id="decoder-upload"
        />
        <label htmlFor="decoder-upload" className="cursor-pointer flex flex-col items-center">
          <Lock size={40} className="text-slate-400 mb-2" />
          <span className="text-slate-500">Click to upload report image</span>
          {file && <span className="text-pink-600 font-bold mt-2">{file.name}</span>}
        </label>
      </div>

      <Button 
        onClick={handleDecode} 
        disabled={!file || loading}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Extract Secret Report"}
      </Button>

      {result && (
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border dark:border-slate-800 animate-in fade-in">
          <p className="text-xs uppercase font-bold text-pink-600 mb-2">Decoded Message:</p>
          <p className="text-gray-800 dark:text-slate-200 font-serif italic">{result}</p>
        </div>
      )}
    </div>
  );
}