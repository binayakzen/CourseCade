'use client'

import React from 'react'
import Link from 'next/link'
import { LeftNavPill } from '@/components/dashboard/left-nav-pill'
import { TrendingUp, Sparkles, Wrench, ArrowLeft, Activity } from 'lucide-react'

export default function ProgressPage() {
  return (
    <div className="min-h-screen pt-16 pl-4 md:pl-20 pb-6 bg-[#ebecef] text-[#111827] flex flex-col justify-center">
      <LeftNavPill />

      <main className="p-4 max-w-4xl mx-auto w-full space-y-4 my-auto">
        {/* Top Status Banner */}
        <div className="flex items-center justify-between rounded-xl bg-[#121318] px-4 py-2.5 text-white shadow-md border border-[#a3e635]/30">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-[#a3e635]"></span>
            </span>
            <span className="font-mono text-xs font-bold tracking-tight">
              CourseCade Analytics Engine v3.0 (Preview)
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#a3e635] font-black uppercase tracking-wider">
            ⚡ Module Upgrade in Progress
          </span>
        </div>

        {/* Main Under Development Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200/80 text-center relative overflow-hidden flex flex-col items-center justify-center">
          {/* Subtle Decorative Background Glows */}
          <div className="absolute -top-24 -right-24 size-80 rounded-full bg-[#a3e635]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Animated Icon Container */}
          <div className="relative mb-4">
            <div className="grid size-16 place-items-center rounded-2xl border-2 border-gray-100 bg-[#F3F4F6] shadow-inner relative z-10">
              <TrendingUp className="size-8 text-black" aria-hidden="true" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 z-20 grid size-7 place-items-center rounded-xl bg-[#a3e635] text-black shadow-md animate-bounce">
              <Wrench className="size-3.5 font-black" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#14151A] text-[#a3e635] font-mono text-[11px] font-black uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="size-3" />
            Under Development
          </div>

          <h1 className="font-sans text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2 max-w-xl">
            Next-Gen Progress & Skill Heatmaps
          </h1>

          <p className="font-sans text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-6 leading-relaxed font-medium">
            We are currently building an advanced real-time analytics command center. Soon you will be able to visualize deep learning velocity, skill mastery graphs, and peer benchmark comparisons.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-6 text-left font-sans">
            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200/60 transition-all hover:border-gray-300">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 mb-1">
                <Activity className="size-3.5 text-[#65a30d]" />
                Velocity Graphs
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-normal">Track daily token mining rates & watch velocity.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200/60 transition-all hover:border-gray-300">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 mb-1">
                <Sparkles className="size-3.5 text-[#65a30d]" />
                Skill Trees
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-normal">Interactive node maps for React, Python & AI.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200/60 transition-all hover:border-gray-300">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 mb-1">
                <TrendingUp className="size-3.5 text-[#65a30d]" />
                Peer Leaderboards
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-normal">Compare multipliers and streaks against peers.</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#14151A] hover:bg-black text-white font-sans text-xs font-black transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="size-3.5 text-[#a3e635]" />
            Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
