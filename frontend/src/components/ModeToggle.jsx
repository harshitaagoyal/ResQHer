// TODO: Add component logic
'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  return (
    <Button variant="ghost" size="icon" onClick={() => alert("Theme switching coming soon!")}>
      🌙
    </Button>
  )
}