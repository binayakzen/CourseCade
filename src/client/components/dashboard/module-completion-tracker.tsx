'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { sanitizeStorage, type EnrolledCourseItem } from '@/lib/api'

export function ModuleCompletionTracker({ missions }: { missions?: EnrolledCourseItem[] }) {
  const [activeList, setActiveList] = useState<EnrolledCourseItem[]>([])

  const loadMissions = () => {
    sanitizeStorage()
    let name = 'binay'
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('coursecade_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.username) name = parsed.username
        }
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      try {
        const savedMissions = localStorage.getItem('coursecade_missions_' + name)
        if (savedMissions) {
          const missions: any[] = JSON.parse(savedMissions)
          let sanitized = false
          missions.forEach((m: any) => {
            if ((!m.watchSeconds || m.watchSeconds < 5) && m.progressPct === 25) {
              m.progressPct = 0
              m.watchSeconds = 0
              sanitized = true
            }
          })
          if (sanitized) {
            localStorage.setItem('coursecade_missions_' + name, JSON.stringify(missions))
          }
          setActiveList(missions.slice(0, 3))
        } else {
          setActiveList(missions && missions.length > 0 ? missions.slice(0, 3) : [])
        }
      } catch (e) {
        setActiveList(missions && missions.length > 0 ? missions.slice(0, 3) : [])
      }
    }
  }

  useEffect(() => {
    loadMissions()
    window.addEventListener('missionsUpdated', loadMissions)
    window.addEventListener('authChange', loadMissions)
    return () => {
      window.removeEventListener('missionsUpdated', loadMissions)
      window.removeEventListener('authChange', loadMissions)
    }
  }, [missions])

  const gridColsClass =
    activeList.length === 1
      ? 'grid-cols-1 max-w-sm mx-auto w-full'
      : activeList.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-3'

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-lg font-black text-gray-900 tracking-tight">Active Course Missions</h3>
        <Link href="/courses" className="text-xs font-bold text-gray-500 underline hover:text-black">
          See Catalog
        </Link>
      </div>

      {activeList.length === 0 ? (
        <div className="my-auto flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-black mb-3 shadow-inner">
            📚
          </div>
          <h4 className="font-sans font-black text-gray-900 text-base mb-1">No Active Course Missions</h4>
          <p className="text-xs text-gray-500 max-w-sm mb-4 font-medium leading-relaxed">
            You haven&apos;t started any active course missions yet. Choose a course from our catalog to start watching and earning XP!
          </p>
          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-xl bg-[#121318] text-[#a3e635] font-sans font-black text-xs tracking-wide shadow-md hover:scale-105 transition-transform"
          >
            Start Your First Mission →
          </Link>
        </div>
      ) : (
        <div className={`grid ${gridColsClass} gap-3 my-auto min-h-[240px]`}>
          {activeList.map((m, idx) => {
            if (m.completed || m.progressPct >= 100) {
              return (
                <Link
                  key={m.id}
                  href={`/watch/${m.id}`}
                  className="rounded-2xl bg-[#121318] text-white flex flex-col justify-between overflow-hidden relative p-3 text-center shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <p className="font-sans font-bold text-xs text-white z-10 truncate" title={m.title}>{m.title}</p>
                  <div className="my-auto flex items-center justify-center py-6">
                    <span className="font-sans font-bold text-xs text-gray-300 tracking-widest uppercase -rotate-90">Completed</span>
                  </div>
                  <p className="font-mono text-[9px] text-[#a3e635] z-10 mt-auto bg-black/80 border border-white/10 py-0.5 px-2 rounded-full mx-auto font-black">+{m.xpReward} XP</p>
                </Link>
              )
            }

            const isSecond = idx % 2 !== 0
            const barColor = isSecond ? 'bg-[#a3e635]' : 'bg-[#111827]'
            const textColor = isSecond ? 'text-black' : 'text-white'

            return (
              <Link
                key={m.id}
                href={`/watch/${m.id}`}
                className="rounded-2xl bg-[#F3F4F6] border border-gray-200/80 flex flex-col justify-between overflow-hidden relative p-3 text-center hover:border-gray-300 transition-all"
              >
                <p className="font-sans font-bold text-xs text-gray-800 z-10 truncate" title={m.title}>{m.title}</p>
                <div
                  className={`absolute inset-x-0 bottom-8 ${barColor} rounded-t-2xl flex items-center justify-center transition-all shadow-sm`}
                  style={{ height: `${Math.max(25, m.progressPct * 0.75)}%` }}
                >
                  <span className={`font-sans font-black text-xl ${textColor}`}>{m.progressPct}%</span>
                </div>
                <p className="font-mono text-[9px] text-gray-600 z-10 mt-auto bg-white/90 backdrop-blur py-0.5 px-2 rounded-full mx-auto shadow-sm font-bold">{m.timeLeftHours}h Left</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
