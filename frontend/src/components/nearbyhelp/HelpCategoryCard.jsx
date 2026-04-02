'use client';

export default function HelpCategoryCard({ category, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-left p-6 rounded-2xl border transition-all duration-300 group
        ${disabled 
          ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
        }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl border ${category.color} group-hover:scale-110 transition-transform`}>
          {category.icon}
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{category.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{category.desc}</p>
        </div>
      </div>
    </button>
  );
}