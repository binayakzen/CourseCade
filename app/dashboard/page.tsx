'use client'

import { useEffect, useRef, useState } from 'react'
import {
  fetchDashboardSummary,
  fetchProfile,
  fetchXpStatus,
  RANK_TIERS,
  type DashboardSummary,
  type Profile,
  type XpStatus,
} from '@/lib/api'
import { LeftNavPill } from '@/components/dashboard/left-nav-pill'
import { StudyPeersStrip } from '@/components/dashboard/study-peers-strip'
import { FeaturedCourseHero } from '@/components/dashboard/featured-course-hero'
import { EnrolledCoursesList } from '@/components/dashboard/enrolled-courses-list'
import { ProfileXPGrid } from '@/components/dashboard/profile-xp-grid'
import { ModuleCompletionTracker } from '@/components/dashboard/module-completion-tracker'
import { XPSourceBreakdown } from '@/components/dashboard/xp-source-breakdown'
import { RankUpCelebration } from '@/components/dashboard/rank-up-celebration'
import { ActiveChallengesCard, StreakCard } from '@/components/dashboard/engagement-cards'
import { RankTimeline } from '@/components/dashboard/rank-timeline'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [xp, setXp] = useState<XpStatus | null>(null)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [celebrateTier, setCelebrateTier] = useState<number | null>(null)
  const prevTierRef = useRef<number | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [profileData, xpData, summaryData] = await Promise.all([
          fetchProfile(),
          fetchXpStatus(),
          fetchDashboardSummary(),
        ])
        if (!active) return
        setProfile(profileData)
        setXp(xpData)
        setSummary(summaryData)
      } catch (err) {
        console.error('Dashboard load error:', err)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  // Detect rank increases and celebrate.
  useEffect(() => {
    if (!profile) return
    const tier = profile.rankTier
    if (prevTierRef.current !== null && tier > prevTierRef.current) {
      setCelebrateTier(tier)
    }
    prevTierRef.current = tier
  }, [profile])

  return (
    <div className="min-h-screen pt-20 pl-4 md:pl-20 pb-20 bg-[#ebecef] text-[#111827]">
      <LeftNavPill />

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Anti-Cheat & Monitoring Engine Uptime Banner */}
        {summary && (
          <div className="flex items-center justify-between rounded-2xl bg-[#121318] px-5 py-3 text-white shadow-md border border-[#a3e635]/30">
            <div className="flex items-center gap-3">
              <span className="relative flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75"></span>
                <span className="relative inline-flex rounded-full size-3 bg-[#a3e635]"></span>
              </span>
              <span className="font-mono text-xs font-bold tracking-tight">
                {summary.monitoringStatus.engine} ({summary.monitoringStatus.status})
              </span>
            </div>
            <span className="font-mono text-xs text-[#a3e635] font-black">
              🔒 Anti-Cheat Sync Active [{summary.monitoringStatus.activeHeartbeats} Peers Live]
            </span>
          </div>
        )}

        {/* Main Command Center Bento Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <StudyPeersStrip peers={summary?.peers} />
            <FeaturedCourseHero xp={xp} featured={summary?.featuredCourse} />
            <ModuleCompletionTracker missions={summary?.activeMissions} />
          </div>

          {/* Right Column (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Top Right: Collection + Profile HUD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              <div className="h-full">
                <EnrolledCoursesList courses={summary?.enrolledCourses} />
              </div>
              <div className="h-full">
                <ProfileXPGrid profile={profile} xp={xp} />
              </div>
            </div>

            <XPSourceBreakdown breakdown={summary?.xpBreakdown} />
          </div>
        </div>

        {/* Secondary Quests & Trajectory Deck */}
        <div className="pt-4 border-t border-gray-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4">
              <ActiveChallengesCard xp={xp} />
            </div>
            <div className="lg:col-span-3">
              <StreakCard xp={xp} />
            </div>
            <div className="lg:col-span-5">
              <RankTimeline profile={profile} celebrateTier={celebrateTier} />
            </div>
          </div>
        </div>
      </main>

      <RankUpCelebration
        show={celebrateTier !== null}
        rankName={
          celebrateTier !== null ? RANK_TIERS[celebrateTier]?.name ?? '' : ''
        }
        color={
          celebrateTier !== null
            ? RANK_TIERS[celebrateTier]?.color ?? 'var(--neon-gold)'
            : 'var(--neon-gold)'
        }
        onDone={() => setCelebrateTier(null)}
      />
    </div>
  )
}
