'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, ShieldAlert, Zap, Play, Pause } from 'lucide-react'
import { fetchCourse, sendMonitoringHeartbeat, type Course } from '@/lib/api'
import { SessionStats } from '@/components/watch/session-stats'
import { LeftNavPill } from '@/components/dashboard/left-nav-pill'

const FALLBACK_YOUTUBE_IDS: Record<string, string> = {
  'react-mastery': 'bMknfKXIFA8',
  'python-ai': '_uQrJ0TkZlc',
  'web3-blockchain': 'gyMwXuJrbJQ',
  'design-systems': 'c9Wg6Cb_YlU',
  'devops-cloud': 'hQcFE0RD0cQ',
  'cybersecurity': '3Kq1MIfTWCE',
}

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [course, setCourse] = useState<Course | null>(null)
  const [liveTokens, setLiveTokens] = useState(0)
  const [focused, setFocused] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSuspended, setIsSuspended] = useState(false)
  const [telemetryLog, setTelemetryLog] = useState('Initializing Anti-Cheat monitoring engine...')

  // Mock playback speed
  const [playbackSpeed] = useState(1.25)

  const activeYoutubeId = course?.youtubeId || FALLBACK_YOUTUBE_IDS[id] || 'bMknfKXIFA8'

  // Keep mutable refs
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const focusedRef = useRef(focused)
  const isPlayingRef = useRef(isPlaying)
  const isSuspendedRef = useRef(isSuspended)
  const playheadRef = useRef(0)
  const prevPlayheadRef = useRef(0)
  const maxWatchedRef = useRef(0)
  const ytPlayerRef = useRef<any>(null)
  focusedRef.current = focused
  isPlayingRef.current = isPlaying
  isSuspendedRef.current = isSuspended

  // Load course details
  useEffect(() => {
    let active = true
    fetchCourse(id).then((data) => {
      if (active && data) {
        let savedLast = data.lastPlayheadTime || 0
        let savedMax = data.maxPlayheadTime || 0
        if (typeof window !== 'undefined') {
          try {
            const loc = localStorage.getItem('coursecade_progress_' + id)
            if (loc) {
              const parsedLoc = JSON.parse(loc)
              if (parsedLoc.last > savedLast) savedLast = parsedLoc.last
              if (parsedLoc.max > savedMax) savedMax = parsedLoc.max
            }
          } catch (e) {}
        }
        playheadRef.current = savedLast
        prevPlayheadRef.current = savedLast
        maxWatchedRef.current = Math.max(savedMax, savedLast)
        setCourse({ ...data, lastPlayheadTime: savedLast, maxPlayheadTime: savedMax })
        if (typeof window !== 'undefined') {
          try {
            const storedUser = localStorage.getItem('coursecade_user')
            if (storedUser) {
              const u = JSON.parse(storedUser)
              if (u.totalTokens >= 12480) {
                u.totalTokens -= 12480
                if (u.xp >= 12480) u.xp -= 12480
                if (u.hoursWatched >= 86) u.hoursWatched = Number((u.hoursWatched - 86).toFixed(1))
                if (u.coursesCompleted >= 14) u.coursesCompleted -= 14
                localStorage.setItem('coursecade_user', JSON.stringify(u))
              }
              if (u.username) {
                const key = 'coursecade_missions_' + u.username
                const existingStr = localStorage.getItem(key)
                let missions: any[] = existingStr ? JSON.parse(existingStr) : []
                const foundIdx = missions.findIndex((m: any) => m.id === data.id)
                let existingWatchSecs = foundIdx >= 0 ? (missions[foundIdx].watchSeconds || 0) : 0
                let existingPct = foundIdx >= 0 ? missions[foundIdx].progressPct : 0
                if (existingWatchSecs < 5 && existingPct === 25) {
                  existingPct = 0
                  existingWatchSecs = 0
                }
                const newMission = {
                  id: data.id,
                  title: data.title,
                  image: data.thumbnail || '/courses/react-mastery.png',
                  completed: foundIdx >= 0 ? missions[foundIdx].completed : false,
                  progressPct: existingPct,
                  watchSeconds: existingWatchSecs,
                  timeLeftHours: foundIdx >= 0 ? missions[foundIdx].timeLeftHours : Number((data.durationHours || 10).toFixed(1)),
                  xpReward: Math.round((data.durationHours || 10) * 50 * (data.multiplier || 1.2))
                }
                if (foundIdx >= 0) {
                  missions[foundIdx] = newMission
                } else {
                  missions.unshift(newMission)
                }
                localStorage.setItem(key, JSON.stringify(missions.slice(0, 3)))
                window.dispatchEvent(new Event('missionsUpdated'))
              }
            }
          } catch (e) {}
        }
      } else if (active) {
        setCourse(null)
      }
    })
    return () => {
      active = false
    }
  }, [id])

  // Anti-Cheat Focus Detection
  useEffect(() => {
    const handleVisibility = () => setFocused(!document.hidden)
    const handleBlur = () => {
      // Prevent false alarms when user clicks inside the YouTube player iframe
      if (document.activeElement && document.activeElement.tagName.toLowerCase() === 'iframe') {
        return
      }
      setFocused(false)
    }
    const handleFocus = () => setFocused(!document.hidden)

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Listen to YouTube iframe events automatically for instant Anti-Cheat sync
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.origin === 'string' && !event.origin.includes('youtube.com') && !event.origin.includes('youtube-nocookie.com')) return
      let data = event.data
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) { return }
      }
      if (!data || typeof data !== 'object') return

      // Universal player state extraction covering onStateChange, infoDelivery, initialDelivery
      let stateCode: number | undefined = undefined
      if (typeof data.info === 'number') {
        stateCode = data.info
      } else if (data.info && typeof data.info === 'object' && typeof data.info.playerState === 'number') {
        stateCode = data.info.playerState
      } else if (typeof data.playerState === 'number') {
        stateCode = data.playerState
      }

      if (stateCode !== undefined) {
        // 1: PLAYING, 3: BUFFERING
        if (stateCode === 1 || stateCode === 3) {
          setIsPlaying(true)
        } else if (stateCode === 2 || stateCode === 0 || stateCode === 5) {
          setIsPlaying(false)
        }
      }

      if (data.info && typeof data.info.currentTime === 'number') {
        playheadRef.current = Math.round(data.info.currentTime)
      } else if (typeof data.currentTime === 'number') {
        playheadRef.current = Math.round(data.currentTime)
      }
    }
    window.addEventListener('message', handleMessage)

    // Send all standard YouTube JS API handshake signals every 500ms
    const handshakeInterval = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        const win = iframeRef.current.contentWindow
        win.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*')
        win.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*')
        win.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onReady'] }), '*')
      }
    }, 500)

    // Also initialize official YouTube Iframe Player API hook if script is present or load it
    let ytPlayer: any = null
    const setupYT = () => {
      const YT = (window as any).YT
      if (YT && YT.Player && iframeRef.current) {
        try {
          ytPlayer = new YT.Player(iframeRef.current, {
            events: {
              onReady: (e: any) => {
                if (playheadRef.current > 0) {
                  try { e.target.seekTo(playheadRef.current, true) } catch (err) {}
                }
              },
              onStateChange: (e: any) => {
                if (e.data === 1 || e.data === 3) {
                  setIsPlaying(true)
                } else if (e.data === 2 || e.data === 0 || e.data === 5) {
                  setIsPlaying(false)
                }
              }
            }
          })
          ytPlayerRef.current = ytPlayer
        } catch (err) {}
      }
    }

    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        document.head.appendChild(tag)
      }
      ;(window as any).onYouTubeIframeAPIReady = () => setupYT()
    } else {
      setupYT()
    }

    const handleVisibility = () => {
      const isVisible = typeof document !== 'undefined' && !document.hidden
      setFocused(isVisible)
      focusedRef.current = isVisible
    }
    const handleBlur = () => {
      setTimeout(() => {
        if (typeof document !== 'undefined' && !document.hasFocus()) {
          setFocused(false)
          focusedRef.current = false
        }
      }, 50)
    }
    const handleFocus = () => {
      setFocused(true)
      focusedRef.current = true
    }

    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', handleVisibility)
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', handleBlur)
      window.addEventListener('focus', handleFocus)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', handleVisibility)
      if (typeof window !== 'undefined') {
        window.removeEventListener('blur', handleBlur)
        window.removeEventListener('focus', handleFocus)
      }
      clearInterval(handshakeInterval)
      if (ytPlayer && typeof ytPlayer.destroy === 'function') {
        try { ytPlayer.destroy() } catch (e) {}
      }
    }
  }, [activeYoutubeId])

  // Heartbeat POST to Backend Telemetry (fires every 5 seconds for instant mining demo)
  const sendHeartbeat = useCallback(async () => {
    // Direct real-time browser visibility check to immediately catch tab switches without state lag
    const isTabVisible = typeof document !== 'undefined' && !document.hidden
    const isWindowFocused = typeof document !== 'undefined' && document.hasFocus()
    const activeAndFocused = isTabVisible && isWindowFocused

    if (activeAndFocused !== focusedRef.current) {
      setFocused(activeAndFocused)
      focusedRef.current = activeAndFocused
    }

    const attentionScore = activeAndFocused ? 1.0 : 0.0
    const isMiningActive = focusedRef.current && isPlayingRef.current && isTabVisible

    let currentRealTime = playheadRef.current
    if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
      try {
        const time = ytPlayerRef.current.getCurrentTime()
        if (typeof time === 'number' && time > 0) {
          currentRealTime = Math.round(time)
        }
      } catch (e) {}
    } else if (isMiningActive) {
      currentRealTime += 5
    }
    playheadRef.current = currentRealTime

    const currentPlayhead = playheadRef.current
    const prevPlayhead = prevPlayheadRef.current
    prevPlayheadRef.current = currentPlayhead

    // Detect Rapid/Long Skipping Malpractice (jump > 15s forward beyond verified max)
    if (currentPlayhead - prevPlayhead > 15 && currentPlayhead > maxWatchedRef.current + 15) {
      if (!isSuspendedRef.current) {
        isSuspendedRef.current = true
        setIsSuspended(true)
      }
    } else if (currentPlayhead <= maxWatchedRef.current + 5) {
      if (isSuspendedRef.current) {
        isSuspendedRef.current = false
        setIsSuspended(false)
      }
    }

    if (!isSuspendedRef.current && currentPlayhead > maxWatchedRef.current) {
      maxWatchedRef.current = currentPlayhead
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('coursecade_progress_' + id, JSON.stringify({ last: currentPlayhead, max: maxWatchedRef.current }))
      } catch (e) {}
    }

    const payload = {
      userId: 'user_1',
      sessionId: 'session_active',
      videoId: id,
      currentPlayheadTime: currentPlayhead,
      prevPlayheadTime: prevPlayhead,
      maxPlayheadTime: maxWatchedRef.current,
      timeDeltaSeconds: 5,
      focusStatus: isSuspendedRef.current ? 'suspended' : (!isTabVisible || !focusedRef.current ? 'hidden' : (!isPlayingRef.current ? 'paused' : 'active')),
      attentionScore: isSuspendedRef.current ? 0.0 : attentionScore,
    }

    try {
      const res = await sendMonitoringHeartbeat(payload)
      setTelemetryLog(res.monitoringLog)
      if (res.tokensAwarded > 0) {
        setLiveTokens((t) => t + res.tokensAwarded)
        if (typeof window !== 'undefined') {
          try {
            const storedUser = localStorage.getItem('coursecade_user')
            if (storedUser) {
              const u = JSON.parse(storedUser)
              if (u.totalTokens >= 12480) {
                u.totalTokens -= 12480
                if (u.xp >= 12480) u.xp -= 12480
                if (u.hoursWatched >= 86) u.hoursWatched = Number((u.hoursWatched - 86).toFixed(1))
                if (u.coursesCompleted >= 14) u.coursesCompleted -= 14
              }
              u.totalTokens = (u.totalTokens || 0) + res.tokensAwarded
              u.xp = (u.xp || 0) + res.tokensAwarded
              u.hoursWatched = Number(((u.hoursWatched || 0) + (5 / 3600)).toFixed(3))
              localStorage.setItem('coursecade_user', JSON.stringify(u))
              if (u.username) {
                localStorage.setItem('coursecade_stats_' + u.username, JSON.stringify(u))
                const key = 'coursecade_missions_' + u.username
                const existingStr = localStorage.getItem(key)
                if (existingStr) {
                  let missions: any[] = JSON.parse(existingStr)
                  const foundIdx = missions.findIndex((m: any) => m.id === id)
                  if (foundIdx >= 0) {
                    missions[foundIdx].watchSeconds = (missions[foundIdx].watchSeconds || 0) + 5
                    const courseDurationSec = (course?.durationHours || 12) * 3600
                    missions[foundIdx].progressPct = Math.min(100, Math.round((missions[foundIdx].watchSeconds / courseDurationSec) * 100))
                    missions[foundIdx].timeLeftHours = Math.max(0, Number(((course?.durationHours || 12) - missions[foundIdx].watchSeconds / 3600).toFixed(1)))
                    if (missions[foundIdx].progressPct >= 100) missions[foundIdx].completed = true
                    localStorage.setItem(key, JSON.stringify(missions))
                  }
                }
                window.dispatchEvent(new Event('missionsUpdated'))
              }
            }
          } catch (e) {}
        }
        window.dispatchEvent(new CustomEvent('tokensEarned', { detail: res.tokensAwarded }))
      }
    } catch (err) {
      setTelemetryLog('Heartbeat sync paused. Reconnecting to telemetry daemon...')
    }
  }, [id])

  // Fire heartbeat every 5 seconds
  useEffect(() => {
    const interval = setInterval(sendHeartbeat, 5_000)
    return () => clearInterval(interval)
  }, [sendHeartbeat])

  return (
    <div className="min-h-screen pt-24 pl-4 md:pl-20 pb-20 px-4 sm:px-6 bg-[#ebecef] text-[#111827]">
      <LeftNavPill />
      <div className="flex flex-col gap-6 mx-auto w-full max-w-7xl">
        <Link
        href="/courses"
        className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to catalog
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {isSuspended && (
            <div className="rounded-2xl border-2 border-red-500 bg-red-950/90 p-4 text-white shadow-2xl animate-pulse flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="warning">🚨</span>
                <div>
                  <h4 className="font-bold text-red-400 font-heading">Anti-Cheat Suspension Active</h4>
                  <p className="text-xs text-red-200">
                    Rapid or long skipping detected! Token mining and progress updates are paused. Please seek back to your verified progress timestamp (<span className="font-mono font-bold text-white">{Math.floor(maxWatchedRef.current / 60)}:{String(maxWatchedRef.current % 60).padStart(2, '0')}</span>) to automatically lift suspension.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Playable Embedded YouTube Course Player */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-gray-800 bg-black shadow-2xl">
            <iframe
              ref={iframeRef}
              onLoad={() => {
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*')
                }
              }}
              src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&enablejsapi=1&start=${course?.lastPlayheadTime || 0}&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
              title={course?.title || 'Course Tutorial Video'}
              className="size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 bg-[#14151A] text-white border border-gray-800">
            <div>
              <h1 className="font-heading text-xl font-bold text-white text-balance">
                {course?.title || 'Advanced Tutorial Course'}
              </h1>
              <p className="text-sm text-gray-400">
                {course?.author || 'Coursecade Verified Educator'}
              </p>
            </div>
            {course && (
              <span className="flex items-center gap-1.5 rounded-full border border-[#a3e635]/50 bg-[#a3e635]/10 px-4 py-1.5 font-mono text-sm font-black text-[#a3e635] shadow-sm">
                <Zap className="size-4 fill-[#a3e635]" aria-hidden="true" />
                {course.multiplier}x Token Boost
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Live Anti-Cheat Monitoring HUD Card */}
          <div className={`rounded-3xl p-5 border shadow-lg transition-colors ${isSuspended ? 'bg-red-950 border-red-500 text-red-200 animate-pulse' : focused && isPlaying ? 'bg-[#121318] border-[#a3e635]/40 text-white' : !focused ? 'bg-red-950/40 border-red-500/50 text-red-200 animate-pulse' : 'bg-amber-950/40 border-amber-500/50 text-amber-200'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {isSuspended || !focused ? <ShieldAlert className="size-5 text-red-400" /> : isPlaying ? <ShieldCheck className="size-5 text-[#a3e635]" /> : <ShieldAlert className="size-5 text-amber-400" />}
                <span className="font-sans text-xs font-black uppercase tracking-wider">
                  Anti-Cheat Daemon
                </span>
              </div>
              <span className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full ${isSuspended ? 'bg-red-600 text-white animate-bounce' : focused && isPlaying ? 'bg-[#a3e635] text-black' : !focused ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'}`}>
                {isSuspended ? 'SKIPPING SUSPENDED' : focused && isPlaying ? 'FOCUS ACTIVE' : !focused ? 'TAB SUSPENDED' : 'PLAYBACK PAUSED'}
              </span>
            </div>
            <p className="font-mono text-xs mt-3 text-gray-300 leading-relaxed min-h-[40px]">
              {isSuspended ? `🚨 Anti-Cheat Suspended: Fast/long skipping detected beyond verified timestamp (${Math.floor(maxWatchedRef.current / 60)}:${String(maxWatchedRef.current % 60).padStart(2, '0')}). Seek back to resume.` : telemetryLog}
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>Sync Rate: 5s</span>
              <span className={!isSuspended && focused && isPlaying ? "text-[#a3e635] font-bold" : "text-red-400 font-bold"}>
                {!isSuspended && focused && isPlaying ? '+15 Tokens / tick' : 'Mining Suspended'}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-300">Playback Signal:</span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${isSuspended ? 'bg-red-500/20 text-red-300 border border-red-500/40' : isPlaying ? 'bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                <span className={`size-2 rounded-full ${isSuspended ? 'bg-red-500' : isPlaying ? 'bg-[#a3e635] animate-pulse' : 'bg-amber-400'}`} />
                {isSuspended ? 'Malpractice: SKIPPING' : isPlaying ? 'Auto-Detected: PLAYING' : 'Auto-Detected: PAUSED'}
              </span>
            </div>
          </div>

          <SessionStats
            liveTokens={liveTokens}
            playbackSpeed={playbackSpeed}
            focused={focused}
            isPlaying={isPlaying}
          />
        </div>
      </div>
      </div>
    </div>
  )
}
