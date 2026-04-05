'use client';

import React, { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { ShieldAlert, UserCircle } from 'lucide-react';

import RoleCard from '@/components/login/RoleCard';
import AdminGatekeeperModal from '@/components/admin/AdminGatekeeperModal';

export default function SelectRole() {
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-6 relative">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <SignInButton mode="modal" fallbackRedirectUrl="/">
          <div className="w-full h-full"> 
            <RoleCard 
              icon={<UserCircle size={40} />}
              title="User Portal"
              description="Access safety tools, legal aid, and your Trust Circle."
              actionText="Log In as User"
              colorTheme="pink"
            />
          </div>
        </SignInButton>
        <RoleCard 
          icon={<ShieldAlert size={40} />}
          title="Authority Portal"
          description="Monitor live SOS alerts, manage incidents, and coordinate response."
          actionText="Requires Access Key"
          colorTheme="indigo"
          onClick={() => setShowAdminModal(true)}
        />

      </div>
      {showAdminModal && (
        <AdminGatekeeperModal onClose={() => setShowAdminModal(false)} />
      )}
    </div>
  );
}