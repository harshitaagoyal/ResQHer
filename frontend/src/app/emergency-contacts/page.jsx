'use client';

import React, { useState, useEffect } from 'react';
import { HeartHandshake } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { isValidPhoneNumber } from 'react-phone-number-input';

// Custom Components
import ContactForm from '@/components/ContactForm';
import ContactItem from '@/components/ContactItem';

// Styles for PhoneInput
import 'react-phone-number-input/style.css'; 

export default function EmergencyContactsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // State for List
  const [contacts, setContacts] = useState([]);
  
  // State for Add Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); 
  const [email, setEmail] = useState('');
  
  // State for Editing
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Sync with Clerk Metadata on Load
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const savedContacts = user.unsafeMetadata?.emergencyContacts || [];
      setContacts(savedContacts);
    }
  }, [isLoaded, isSignedIn, user]);

  // Persistent Save Function
  const saveContacts = async (newContacts) => {
    setContacts(newContacts); 
    if (user) {
      try {
        await user.update({
          unsafeMetadata: { 
            ...user.unsafeMetadata, 
            emergencyContacts: newContacts 
          }
        });
      } catch (error) {
        console.error("Failed to sync contacts with Clerk:", error);
      }
    }
  };

  // Create
  const addContact = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone || !email.trim()) return;
    
    if (!isValidPhoneNumber(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    const newContact = { id: Date.now(), name, phone, email };
    saveContacts([...contacts, newContact]);
    
    // Reset Form
    setName(''); 
    setPhone(''); 
    setEmail('');
  };

  // Delete
  const deleteContact = (id) => {
    const filtered = contacts.filter(c => c.id !== id);
    saveContacts(filtered);
  };

  // Edit Logic
  const startEditing = (contact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditEmail(contact.email || ''); 
  };

  const saveEdit = (id) => {
    if (!editName.trim() || !editPhone || !editEmail.trim() || !isValidPhoneNumber(editPhone)) {
      alert("Please ensure all fields are valid.");
      return;
    }

    const updatedContacts = contacts.map(c => 
      c.id === id ? { ...c, name: editName, phone: editPhone, email: editEmail } : c
    );

    saveContacts(updatedContacts);
    setEditingId(null); 
  };

  if (!isLoaded) return null;

  // Auth Guard UI
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
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#020617] pt-4 pb-10 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
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

        {/* Add Contact Component */}
        <ContactForm 
          name={name} setName={setName}
          phone={phone} setPhone={setPhone}
          email={email} setEmail={setEmail}
          onSubmit={addContact}
        />

        {/* Contacts List Section */}
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
                <ContactItem 
                  key={contact.id}
                  contact={contact}
                  isEditing={editingId === contact.id}
                  onStartEdit={startEditing}
                  onCancelEdit={() => setEditingId(null)}
                  onSaveEdit={saveEdit}
                  onDelete={deleteContact}
                  editName={editName} setEditName={setEditName}
                  editPhone={editPhone} setEditPhone={setEditPhone}
                  editEmail={editEmail} setEditEmail={setEditEmail}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}