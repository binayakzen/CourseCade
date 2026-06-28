import React, { useState, useEffect } from 'react'
import { Flame, Target, Trophy } from 'lucide-react'
import type { XpStatus } from '@/lib/api'

export function ActiveChallengesCard({ xp }: { xp: XpStatus | null }) {
  const [currentHours, setCurrentHours] = useState<number>(xp?.dailyQuest?.current ?? 0)

  const loadQuest = () => {
    let hrs = xp?.dailyQuest?.current ?? 0
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
          if (typeof parsed.hoursWatched === 'number') {
            hrs = parsed.hoursWatched
          }
        }
      } catch (e) {}
    }
    setCurrentHours(Number(hrs.toFixed(1)))
  }

  useEffect(() => {
    loadQuest()
    window.addEventListener('tokensEarned', loadQuest)
    window.addEventListener('missionsUpdated', loadQuest)
    window.addEventListener('authChange', loadQuest)
    return () => {
      window.removeEventListener('tokensEarned', loadQuest)
      window.removeEventListener('missionsUpdated', loadQuest)
      window.removeEventListener('authChange', loadQuest)
    }
  }, [xp])

  const target = xp?.dailyQuest?.target ?? 2
  const pct = Math.round((currentHours / target) * 100)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-black fill-[#a3e635]" aria-hidden="true" />
          <h2 className="font-sans text-sm font-black uppercase tracking-wider text-gray-900">
            Active Challenges
          </h2>
        </div>
        <span className="rounded-full bg-[#a3e635] px-3 py-1 font-mono text-xs font-black text-black shadow-sm">
          +{xp?.dailyQuest?.reward ?? 50} Tokens
        </span>
      </div>

      <div className="py-2">
        <p className="text-sm font-bold text-gray-700">{xp?.dailyQuest?.label ?? 'Watch 2 hours of coding courses today'}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 border border-gray-200/60 p-0.5">
            <div
              className="h-full rounded-full bg-[#111827] transition-all duration-700"
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <span className="font-mono text-xs font-black text-gray-900">
            {currentHours}/{target} Hrs
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-2xl bg-[#F3F4F6] border border-gray-200 p-3.5 text-xs font-bold text-gray-600">
        <Trophy className="size-4 text-black flex-shrink-0" aria-hidden="true" />
        Complete daily quests to mine bonus tokens and climb the leaderboard.
      </div>
    </div>
  )
}

export function StreakCard({ xp }: { xp: XpStatus | null }) {
  const streak = xp?.streak

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="size-5 text-black fill-[#a3e635]" aria-hidden="true" />
        <h2 className="font-sans text-sm font-black uppercase tracking-wider text-gray-900">
          Streak Tracker
        </h2>
      </div>

      <div className="my-auto flex items-center gap-4 py-2">
        <div className="grid size-16 place-items-center rounded-2xl border border-gray-200 bg-[#F3F4F6] shadow-inner">
          <Flame className="size-8 text-black fill-[#a3e635]" aria-hidden="true" />
        </div>
        <div>
          <p className="font-sans text-3xl font-black text-gray-900 tracking-tight">
            {streak?.current ?? 7} Days
          </p>
          <p className="text-xs font-black text-[#65a30d] uppercase tracking-wider">Active Mining Roll!</p>
        </div>
      </div>

      <p className="border-t border-gray-100 pt-3 font-mono text-xs text-gray-400 font-bold">
        Longest streak:{' '}
        <span className="font-black text-gray-800">{streak?.longest ?? 23} days</span>
      </p>
    </div>
  )
}
