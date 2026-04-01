'use client';

import React, { useState, useEffect } from 'react';
import { HeartHandshake, UserPlus, Trash2, Edit2, Check, X, Mail, User } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 

export default function EmergencyContactsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); 
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const savedContacts = user.unsafeMetadata?.emergencyContacts || [];
      setContacts(savedContacts);
    }
  }, [isLoaded, isSignedIn, user]);

  const saveContacts = async (newContacts) => {
    setContacts(newContacts); 
    if (user) {
      await user.update({
        unsafeMetadata: { ...user.unsafeMetadata, emergencyContacts: newContacts }
      });
    }
  };

  const addContact = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone || !email.trim()) return;
    if (!isValidPhoneNumber(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    const newContact = { id: Date.now(), name, phone, email };
    saveContacts([...contacts, newContact]);
    setName(''); setPhone(''); setEmail('');
  };

  const deleteContact = (id) => {
    const filtered = contacts.filter(c => c.id !== id);
    saveContacts(filtered);
  };

  const startEditing = (contact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditEmail(contact.email || ''); 
  };

  const saveEdit = (id) => {
    if (!editName.trim() || !editPhone || !editEmail.trim() || !isValidPhoneNumber(editPhone)) return;
    const updatedContacts = contacts.map(c => 
      c.id === id ? { ...c, name: editName, phone: editPhone, email: editEmail } : c
    );
    saveContacts(updatedContacts);
    setEditingId(null); 
  };

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-[#020617] px-6">
        <div className="text-center space-y-4 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 max-w-md">
          <HeartHandshake size={40} className="mx-auto text-pink-500" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h1>
          <SignInButton mode="modal">
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
              Log In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    // Reduced pt-8 to pt-4 to move content up
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#020617] pt-4 pb-10 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6"> {/* Reduced space-y-8 to space-y-6 */}
        
        {/* Compact Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-pink-50 dark:bg-pink-900/10 text-pink-600 dark:text-pink-400 mb-3 border border-pink-100 dark:border-pink-900/30 shadow-sm">
            <HeartHandshake size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">Trust Circle</span>
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Add contacts to receive your GPS location during emergencies.
          </p>
        </div>

        {/* Add Contact Form - Compact Padding */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-pink-600" /> Add New Contact
          </h2>
          
          <form onSubmit={addContact} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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

        {/* Contacts List - Compact Padding */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contacts ({contacts.length})</h2>
            <div className="h-1 w-12 bg-pink-100 dark:bg-pink-900/30 rounded-full"></div>
          </div>
          
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              Your trust circle is empty.
            </div>
          ) : (
            <ul className="space-y-3">
              {contacts.map((contact) => (
                <li key={contact.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 gap-3 shadow-sm transition-all hover:border-pink-100">
                  {editingId === contact.id ? (
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-pink-500" />
                      <div className="px-3 py-2 rounded-lg border border-slate-200 bg-white flex items-center focus-within:ring-2 focus-within:ring-pink-500"><PhoneInput value={editPhone} onChange={setEditPhone} defaultCountry="IN" /></div>
                      <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                  ) : (
                    <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <p className="font-bold text-slate-900 dark:text-white text-base min-w-[100px]">{contact.name}</p>
                      <div className="text-pink-700 dark:text-pink-300 font-mono text-xs bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md border border-pink-100">
                        {contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail size={12} className="text-pink-400" /> {contact.email}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {editingId === contact.id ? (
                      <><button onClick={() => saveEdit(contact.id)} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-rose-500 bg-rose-50 rounded-lg"><X size={18} /></button></>
                    ) : (
                      <><button onClick={() => startEditing(contact)} className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg border border-slate-50"><Edit2 size={16} /></button>
                      <button onClick={() => deleteContact(contact.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-50"><Trash2 size={16} /></button></>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}2