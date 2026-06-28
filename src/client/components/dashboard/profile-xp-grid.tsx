'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { RANK_TIERS, type Profile, type XpStatus } from '@/lib/api'

type ProfileXPGridProps = {
  profile: Profile | null
  xp: XpStatus | null
}

export function ProfileXPGrid({ profile, xp }: ProfileXPGridProps) {
  const [displayName, setDisplayName] = useState('binay')
  const [coursesDone, setCoursesDone] = useState(0)
  const [hoursWatched, setHoursWatched] = useState(0)
  const [tokensEarned, setTokensEarned] = useState(0)

  useEffect(() => {
    let name = 'binay'
    let c = xp?.coursesCompleted ?? 0
    let h = xp?.hoursWatched ?? 0
    let t = xp?.tokensMined ?? 0

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('coursecade_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.totalTokens >= 12480) {
            parsed.totalTokens -= 12480
            if (parsed.xp >= 12480) parsed.xp -= 12480
            if (parsed.hoursWatched >= 86) parsed.hoursWatched = Number((parsed.hoursWatched - 86).toFixed(1))
            if (parsed.coursesCompleted >= 14) parsed.coursesCompleted -= 14
            localStorage.setItem('coursecade_user', JSON.stringify(parsed))
          }
          if (parsed.username) name = parsed.username
          if (typeof parsed.coursesCompleted === 'number') c = parsed.coursesCompleted
          if (typeof parsed.hoursWatched === 'number') h = parsed.hoursWatched
          if (typeof parsed.totalTokens === 'number') t = parsed.totalTokens
        }
      } catch (e) {}
    }
    if (profile?.username) name = profile.username
    setDisplayName(name)
    setCoursesDone(c)
    setHoursWatched(h)
    setTokensEarned(t)
  }, [profile, xp])

  const rankTier = profile ? RANK_TIERS[profile.rankTier] : null

  return (
    <div className="rounded-3xl p-6 bg-[#121318] border border-gray-800 shadow-xl flex flex-col justify-between h-full text-white">
      {/* Avatar HUD Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative size-14 rounded-2xl overflow-hidden bg-blue-500/20 border border-blue-400/30 flex-shrink-0 p-1">
          <div className="relative size-full rounded-xl overflow-hidden">
            <Image
              src="/avatars/profile-avatar.png"
              alt={displayName}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sans text-lg font-black truncate text-white">
            {displayName}
          </h3>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 font-mono mt-0.5">
            <span className="size-2 rounded-full bg-[#a3e635]" />
            @{displayName.toLowerCase()}
          </p>
        </div>
      </div>

      {/* XP Stats Bento HUD */}
      <div className="grid grid-cols-2 gap-2.5 my-auto pt-2">
        <div className="rounded-2xl p-3 flex flex-col justify-center bg-[#202127] border border-white/5 text-center">
          <p className="font-sans text-lg font-black text-white tracking-tight">
            {coursesDone}
          </p>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">Courses Done</p>
        </div>

        {/* Lime Green Card */}
        <div className="rounded-2xl p-3 flex flex-col justify-center bg-[#a3e635] text-black shadow-lg scale-105 z-10 text-center font-black transition-transform hover:scale-110 cursor-default">
          <p className="font-sans text-lg font-black text-black tracking-tight">
            {hoursWatched}h
          </p>
          <p className="text-[10px] text-black/90 font-black mt-0.5 leading-tight">Watched</p>
        </div>

        {/* Tokens Earned — Full Width Banner (col-span-2) guarantees 100% number visibility */}
        <div className="col-span-2 rounded-2xl py-2.5 px-4 flex items-center justify-between bg-[#202127] border border-[#a3e635]/30 shadow-inner mt-1">
          <span className="text-xs text-[#a3e635] font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#a3e635] animate-pulse" /> Tokens Earned
          </span>
          <span className="font-mono text-lg font-black text-white tracking-tight">
            {tokensEarned.toLocaleString()}
          </span>
        </div>

        {/* Day Streak — Full Width Banner (col-span-2) */}
        <div className="col-span-2 rounded-2xl py-2.5 px-4 flex items-center justify-between bg-[#202127] border border-white/5">
          <span className="text-xs text-gray-300 font-bold tracking-wide">Mining Streak</span>
          <span className="font-sans text-sm font-black text-[#a3e635] flex items-center gap-1">
            🔥 {displayName === 'binay' ? 7 : 1} Days
          </span>
        </div>
      </div>
    </div>
  )
}
