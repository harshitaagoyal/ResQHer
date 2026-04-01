'use client';

export default function IncidentDataCard({ title, icon: Icon, children, colSpan = "col-span-1" }) {
  return (
    <div className={`p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${colSpan}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300">{title}</h3>
        {Icon && <Icon size={18} className="text-slate-400" />}
      </div>
      {children}
    </div>
  );
}