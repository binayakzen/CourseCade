'use client'

import { useState, useEffect } from 'react'
import { sanitizeStorage, type XPSourceItem } from '@/lib/api'

export function XPSourceBreakdown({ breakdown }: { breakdown?: XPSourceItem[] }) {
  const [sources, setSources] = useState<XPSourceItem[]>([
    { label: 'Frontend Mastery', value: 40, color: '#121318' },
    { label: 'AI & Data Science', value: 30, color: '#a3e635' },
    { label: 'Backend & Cloud', value: 20, color: '#dcfce7' },
    { label: 'Web3 & Blockchain', value: 10, color: '#86efac' },
  ])

  const loadBreakdown = () => {
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
          let front = 0, ai = 0, back = 0, web3 = 0
          missions.forEach((m) => {
            const earned = (m.progressPct / 100) * (m.xpReward || 500)
            const t = (m.title + ' ' + m.id).toLowerCase()
            if (t.includes('ai') || t.includes('python') || t.includes('data') || t.includes('machine')) {
              ai += earned
            } else if (t.includes('web3') || t.includes('blockchain') || t.includes('contract') || t.includes('solidity')) {
              web3 += earned
            } else if (t.includes('backend') || t.includes('cloud') || t.includes('node') || t.includes('sql') || t.includes('docker') || t.includes('go')) {
              back += earned
            } else {
              front += earned
            }
          })
          setSources([
            { label: 'Frontend Mastery', value: Math.min(100, Math.round((front / 2500) * 100)), color: '#121318' },
            { label: 'AI & Data Science', value: Math.min(100, Math.round((ai / 2500) * 100)), color: '#a3e635' },
            { label: 'Backend & Cloud', value: Math.min(100, Math.round((back / 2500) * 100)), color: '#dcfce7' },
            { label: 'Web3 & Blockchain', value: Math.min(100, Math.round((web3 / 2500) * 100)), color: '#86efac' },
          ])
          return
        }
      } catch (e) {}
    }
    if (breakdown && breakdown.length > 0) {
      setSources(breakdown)
    } else {
      setSources([
        { label: 'Frontend Mastery', value: 0, color: '#121318' },
        { label: 'AI & Data Science', value: 0, color: '#a3e635' },
        { label: 'Backend & Cloud', value: 0, color: '#dcfce7' },
        { label: 'Web3 & Blockchain', value: 0, color: '#86efac' },
      ])
    }
  }

  useEffect(() => {
    loadBreakdown()
    window.addEventListener('missionsUpdated', loadBreakdown)
    window.addEventListener('tokensEarned', loadBreakdown)
    window.addEventListener('authChange', loadBreakdown)
    return () => {
      window.removeEventListener('missionsUpdated', loadBreakdown)
      window.removeEventListener('tokensEarned', loadBreakdown)
      window.removeEventListener('authChange', loadBreakdown)
    }
  }, [breakdown])

  const val0 = sources[0]?.value || 0
  const val1 = sources[1]?.value || 0
  const val2 = sources[2]?.value || 0
  const val3 = sources[3]?.value || 0

  const circ = 219.9 // 2 * pi * 35

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-lg font-black text-gray-900 tracking-tight">XP Mining Sources</h3>
        <button className="text-xs font-bold text-gray-500 border border-gray-200 rounded-xl px-3 py-1 hover:bg-gray-50 flex items-center gap-1">
          Last Month <span className="text-[10px]">▼</span>
        </button>
      </div>

      <div className="flex items-center justify-around gap-6 my-auto">
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-40 h-40">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#F3F4F6" strokeWidth="18" />
            <circle
              cx="50" cy="50" r="35" fill="none"
              stroke={sources[0]?.color || '#121318'} strokeWidth="18"
              strokeDasharray={`${(val0 / 100) * circ} ${circ}`}
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50" cy="50" r="35" fill="none"
              stroke={sources[1]?.color || '#a3e635'} strokeWidth="18"
              strokeDasharray={`${(val1 / 100) * circ} ${circ}`}
              strokeDashoffset={-((val0 / 100) * circ)}
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50" cy="50" r="35" fill="none"
              stroke={sources[2]?.color || '#dcfce7'} strokeWidth="18"
              strokeDasharray={`${(val2 / 100) * circ} ${circ}`}
              strokeDashoffset={-(((val0 + val1) / 100) * circ)}
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50" cy="50" r="35" fill="none"
              stroke={sources[3]?.color || '#86efac'} strokeWidth="18"
              strokeDasharray={`${(val3 / 100) * circ} ${circ}`}
              strokeDashoffset={-(((val0 + val1 + val2) / 100) * circ)}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>

        <div className="space-y-3 flex-1 min-w-[160px]">
          {sources.map((src) => (
            <div key={src.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 truncate">
                <span className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: src.color }} />
                <span className="text-xs font-bold text-gray-700 font-sans tracking-tight truncate">{src.label}</span>
              </div>
              <span className="font-mono text-xs font-black text-gray-900">{src.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
