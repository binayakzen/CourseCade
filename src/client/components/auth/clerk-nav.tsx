'use client'

import React from 'react'
import { UserButton, useUser } from '@clerk/nextjs'

export function ClerkNavButtons() {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) return null

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline font-mono text-xs font-bold text-gray-700">
        {user?.username || user?.firstName || 'CHALLENGER'}
      </span>
      <UserButton
        afterSignOutUrl="/login"
        appearance={{ elements: { userButtonAvatarBox: 'size-8 border-2 border-[#a3e635]' } }}
      />
    </div>
  )
}
