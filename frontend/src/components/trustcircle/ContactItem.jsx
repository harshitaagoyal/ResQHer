'use client';
import { Mail, Edit2, Trash2, Check, X } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';

export default function ContactItem({ 
  contact, isEditing, onStartEdit, onCancelEdit, onSaveEdit, onDelete,
  editName, setEditName, editPhone, setEditPhone, editEmail, setEditEmail 
}) {
  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 gap-3 shadow-sm transition-all hover:border-pink-100">
      {isEditing ? (
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-900 dark:text-white" />
          <div className="px-3 py-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 flex items-center focus-within:ring-2 focus-within:ring-pink-500">
            <PhoneInput value={editPhone} onChange={setEditPhone} defaultCountry="IN" />
          </div>
          <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-900 dark:text-white" />
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <p className="font-bold text-slate-900 dark:text-white text-base min-w-[100px]">{contact.name}</p>
          <div className="text-pink-700 dark:text-pink-300 font-mono text-xs bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md border border-pink-100 w-fit">
            {contact.phone}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Mail size={12} className="text-pink-400" /> {contact.email}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {isEditing ? (
          <>
            <button onClick={() => onSaveEdit(contact.id)} className="p-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"><Check size={18} /></button>
            <button onClick={onCancelEdit} className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-900/20 rounded-lg"><X size={18} /></button>
          </>
        ) : (
          <>
            <button onClick={() => onStartEdit(contact)} className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg border border-slate-50 dark:border-slate-800"><Edit2 size={16} /></button>
            <button onClick={() => onDelete(contact.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-50 dark:border-slate-800"><Trash2 size={16} /></button>
          </>
        )}
      </div>
    </li>
  );
}