'use client';
import { User, Mail, UserPlus } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';

export default function ContactForm({ name, setName, phone, setPhone, email, setEmail, onSubmit }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 shadow-md">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <UserPlus size={20} className="text-pink-600" /> Add New Contact
      </h2>
      
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <User className="absolute left-3 top-3 text-pink-300" size={16} />
          <input 
            type="text" placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)} required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus-within:ring-2 focus-within:ring-pink-500 [&_input]:bg-transparent [&_input]:outline-none flex items-center">
          <PhoneInput
            placeholder="Phone" value={phone} onChange={setPhone}
            defaultCountry="IN" international className="w-full"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-pink-300" size={16} />
          <input 
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95"
        >
          Save Contact
        </button>
      </form>
    </div>
  );
}