'use client';
import { PhoneOutgoing, X } from 'lucide-react';

export default function FakeCallConfigModal({ 
  callerName, 
  setCallerName, 
  onClose, 
  onStartCall, 
  customTime, 
  setCustomTime, 
  customUnit, 
  setCustomUnit 
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PhoneOutgoing className="text-pink-600" /> Fake Call Setup
          </h3>
          <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Caller ID Name</label>
            <input 
              type="text" 
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="e.g., Mom, Boss, Uber"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onStartCall(0)} 
              className="cursor-pointer w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md mb-3"
            >
              Call Right Now
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or schedule timer</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <button onClick={() => onStartCall(10)} className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm">10 Sec</button>
              <button onClick={() => onStartCall(60)} className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm">1 Min</button>
              <button onClick={() => onStartCall(300)} className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm">5 Min</button>
            </div>

            <div className="mt-3 flex gap-2">
              <input 
                type="number" 
                min="1"
                placeholder="Custom time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="flex-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-sm"
              />
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="cursor-pointer px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-sm"
              >
                <option value="sec">Sec</option>
                <option value="min">Min</option>
                <option value="hr">Hrs</option>
              </select>
              <button 
                onClick={() => {
                  const val = parseInt(customTime, 10);
                  if(val && val > 0) {
                    let totalSeconds = val;
                    if (customUnit === 'min') totalSeconds = val * 60;
                    if (customUnit === 'hr') totalSeconds = val * 3600;
                    onStartCall(totalSeconds); 
                    setCustomTime(''); 
                  }
                }}
                disabled={!customTime || customTime <= 0}
                className="cursor-pointer disabled:cursor-not-allowed bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm disabled:opacity-50"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}