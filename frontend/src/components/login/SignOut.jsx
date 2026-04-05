'use client'
import { UserButton } from "@clerk/nextjs";

function SignOut() {
  return (
    <div className="flex items-center gap-4">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default SignOut;