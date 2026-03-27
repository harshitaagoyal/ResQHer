// TODO: Add component logic
'use client'
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function LoginDropdown() {
  return (
    <SignInButton mode="modal">
      <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
        Login
      </Button>
    </SignInButton>
  );
}