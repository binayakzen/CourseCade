'use client'

import { MoreVertical } from 'lucide-react'
import { RANK_TIERS, type Profile } from '@/lib/api'

export function ProfileSidebar({ profile }: { profile: Profile | null }) {
  if (!profile) return null

  const rankTier = RANK_TIERS[profile.rankTier]

  return (
    <aside
      className="flex flex-col gap-6 rounded-2xl p-6 backdrop-blur-md border border-white/15 shadow-lg"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-white">
          My Profile
        </h3>
        <button
          type="button"
          className="text-gray-300 hover:text-white transition-colors"
        >
          <MoreVertical className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Avatar and user info section */}
      <div className="flex flex-col items-center gap-3">
        {/* Blue rounded avatar */}
        <div className="size-20 rounded-3xl bg-blue-500 flex items-center justify-center font-heading text-4xl font-extrabold text-white shadow-lg">
          {profile.username.charAt(0).toUpperCase()}
        </div>

        {/* Username and online status */}
        <div className="text-center">
          <p className="font-heading text-base font-bold text-white">
            {profile.username}
          </p>
          <p className="flex items-center justify-center gap-1 text-xs text-gray-300 mt-1">
            <span className="size-2 rounded-full bg-neon-green" aria-hidden="true" />
            @{profile.username.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Stats grid - 2x2 with one neon green accent */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg p-4 text-center backdrop-blur-sm border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="font-heading text-2xl font-bold text-white">
            12
          </p>
          <p className="text-xs text-gray-300 font-mono mt-1">Courses Done</p>
        </div>

        <div className="rounded-lg bg-neon-green p-4 text-center shadow-lg">
          <p className="font-heading text-2xl font-bold text-black">
            27
          </p>
          <p className="text-xs text-black font-mono mt-1 font-semibold">Hours Watched</p>
        </div>

        <div
          className="rounded-lg p-4 text-center backdrop-blur-sm border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="font-heading text-2xl font-bold text-white">
            1,410
          </p>
          <p className="text-xs text-neon-green font-mono mt-1">Tokens Earned</p>
        </div>

        <div
          className="rounded-lg p-4 text-center backdrop-blur-sm border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="font-heading text-2xl font-bold text-white">
            7
          </p>
          <p className="text-xs text-gray-300 font-mono mt-1">Day Streak</p>
        </div>
      </div>
    </aside>
  )
}
