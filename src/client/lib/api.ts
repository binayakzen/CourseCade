/**
 * ============================================================================
 *  COURSECADE — API LAYER + MOCK DATA
 * ----------------------------------------------------------------------------
 *  Backend developers: every exported `fetchX` function below currently returns
 *  mock data so the UI renders without a server. Each one contains a commented
 *  `fetch(...)` call showing the real endpoint to wire up. Swap the mock return
 *  for the real request and the UI will keep working unchanged.
 * ============================================================================
 */

export type Profile = {
  username: string
  rank: string
  rankTier: number // index into RANK_TIERS
  totalTokens: number
  xp: number
}

export type XpStatus = {
  coursesCompleted: number
  coursesTotal: number
  hoursWatched: number
  hoursGoal: number
  tokensMined: number
  tokensGoal: number
  dailyQuest: { label: string; current: number; target: number; reward: number }
  streak: { current: number; longest: number }
}

export type Course = {
  id: string
  title: string
  author: string
  thumbnail: string
  durationHours: number
  multiplier: number
  category: string
  youtubeId?: string
  lastPlayheadTime?: number
  maxPlayheadTime?: number
}

export type EnrolledCourseItem = {
  id: string
  title: string
  image: string
  completed: boolean
  progressPct: number
  timeLeftHours: number
  xpReward: number
}

export type StudyPeer = {
  id: number
  name: string
  avatar: string
  online: boolean
  monitoringStatus: string
}

export type XPSourceItem = {
  label: string
  value: number
  color: string
}

export type DashboardSummary = {
  enrolledCourses: EnrolledCourseItem[]
  featuredCourse: {
    id: string
    title: string
    desc: string
    image: string
    cta: string
  }
  activeMissions: EnrolledCourseItem[]
  xpBreakdown: XPSourceItem[]
  peers: StudyPeer[]
  monitoringStatus: {
    engine: string
    antiCheatEnabled: boolean
    activeHeartbeats: number
    status: string
  }
}

// Each tier carries its own metallic color so the UI tints to match the
// player's rank: Stone = gray, Iron = steel, Bronze = brown/copper,
// Silver = bright silver, Gold = gold.
export const RANK_TIERS = [
  { name: 'Stone', threshold: 0, color: 'oklch(0.62 0.01 250)' },
  { name: 'Iron', threshold: 500, color: 'oklch(0.68 0.03 235)' },
  { name: 'Bronze', threshold: 1500, color: 'oklch(0.65 0.12 55)' },
  { name: 'Silver', threshold: 3500, color: 'oklch(0.88 0.01 250)' },
  { name: 'Gold', threshold: 6500, color: 'oklch(0.84 0.18 85)' },
  { name: 'Platinum', threshold: 11500, color: 'oklch(0.86 0.1 195)' },
  { name: 'Diamond', threshold: 19500, color: 'oklch(0.82 0.16 230)' },
  { name: 'Legend', threshold: 31500, color: 'oklch(0.65 0.24 25)' },
  { name: 'Grand Master', threshold: 49500, color: 'oklch(0.7 0.22 300)' },
  { name: 'Immortal', threshold: 74500, color: 'oklch(0.82 0.2 150)' },
]

/* -------------------------------------------------------------------------- */
/* MOCK DATA — replace with real DB records on the backend                    */
/* -------------------------------------------------------------------------- */

const MOCK_PROFILE: Profile = {
  username: 'binay',
  rank: 'Platinum',
  rankTier: 5,
  totalTokens: 0,
  xp: 0,
}

const MOCK_XP_STATUS: XpStatus = {
  coursesCompleted: 0,
  coursesTotal: 22,
  hoursWatched: 0,
  hoursGoal: 120,
  tokensMined: 0,
  tokensGoal: 20000,
  dailyQuest: {
    label: 'Watch 2 hours of tutorials today',
    current: 1,
    target: 2,
    reward: 50,
  },
  streak: { current: 7, longest: 23 },
}

const MOCK_COURSES: Course[] = [
  {
    id: 'react-mastery',
    title: 'Advanced React Patterns',
    author: 'Vercel Academy',
    thumbnail: '/courses/react-mastery.png',
    durationHours: 12,
    multiplier: 1.5,
    category: 'Frontend',
  },
  {
    id: 'python-ai',
    title: 'Python for AI & Machine Learning',
    author: 'DeepLearn TV',
    thumbnail: '/courses/python-ai.png',
    durationHours: 18,
    multiplier: 2,
    category: 'AI / ML',
  },
  {
    id: 'web3-blockchain',
    title: 'Web3 & Smart Contract Dev',
    author: 'ChainBuilders',
    thumbnail: '/courses/web3-blockchain.png',
    durationHours: 9,
    multiplier: 1.75,
    category: 'Blockchain',
  },
  {
    id: 'design-systems',
    title: 'Design Systems Masterclass',
    author: 'PixelForge',
    thumbnail: '/courses/design-systems.png',
    durationHours: 7,
    multiplier: 1.25,
    category: 'Design',
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud Infrastructure',
    author: 'CloudOps Pro',
    thumbnail: '/courses/devops-cloud.png',
    durationHours: 14,
    multiplier: 1.5,
    category: 'DevOps',
  },
  {
    id: 'cybersecurity',
    title: 'Ethical Hacking & Security',
    author: 'SecureNode',
    thumbnail: '/courses/cybersecurity.png',
    durationHours: 11,
    multiplier: 2,
    category: 'Security',
  },
]

/* -------------------------------------------------------------------------- */
/* API FUNCTIONS                                                              */
/* -------------------------------------------------------------------------- */

export function sanitizeStorage(username: string = 'binay') {
  if (typeof window === 'undefined') return
  try {
    const userStr = localStorage.getItem('coursecade_user')
    let userObj = userStr ? JSON.parse(userStr) : null
    const name = userObj?.username || username || 'binay'

    const missionsKey = 'coursecade_missions_' + name
    const savedMissions = localStorage.getItem(missionsKey)
    let totalWatchSec = 0
    if (savedMissions) {
      let missions: any[] = JSON.parse(savedMissions)
      let changed = false
      missions.forEach((m: any) => {
        if ((m.watchSeconds || 0) < 900 && m.progressPct > 5) {
          m.progressPct = Math.round(((m.watchSeconds || 0) / (12 * 3600)) * 100)
          changed = true
        }
        if (m.progressPct === 25 && (!m.watchSeconds || m.watchSeconds < 5)) {
          m.progressPct = 0
          m.watchSeconds = 0
          changed = true
        }
        totalWatchSec += (m.watchSeconds || 0)
      })
      if (changed) {
        localStorage.setItem(missionsKey, JSON.stringify(missions))
      }
    }

    if (userObj) {
      let uChanged = false
      const trueHours = Number((totalWatchSec / 3600).toFixed(3))
      if (userObj.hoursWatched > trueHours + 0.5) {
        userObj.hoursWatched = trueHours
        const earned = Math.round(trueHours * 15 * 1.5) + (userObj.totalTokens >= 1000 ? 1000 : 0)
        userObj.totalTokens = earned
        userObj.xp = earned
        uChanged = true
      }
      if (userObj.totalTokens >= 12480) {
        userObj.totalTokens -= 12480
        if (userObj.xp >= 12480) userObj.xp -= 12480
        if (userObj.hoursWatched >= 86) userObj.hoursWatched = Number((userObj.hoursWatched - 86).toFixed(1))
        if (userObj.coursesCompleted >= 14) userObj.coursesCompleted -= 14
        uChanged = true
      }
      if (uChanged) {
        localStorage.setItem('coursecade_user', JSON.stringify(userObj))
        localStorage.setItem('coursecade_stats_' + name, JSON.stringify(userObj))
      }
    }
  } catch (e) {}
}

export async function fetchProfile(): Promise<Profile> {
  sanitizeStorage()
  const res = await fetch('/api/auth/profile', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch profile')
  const data: Profile = await res.json()
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('coursecade_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.username) data.username = parsed.username
        data.xp = parsed.xp ?? 0
        data.totalTokens = parsed.totalTokens ?? 0
        data.rankTier = parsed.rankTier ?? 0
        data.rank = parsed.rank || 'Stone'
      }
    } catch (e) {}
  }
  return data
}

export async function fetchXpStatus(): Promise<XpStatus> {
  sanitizeStorage()
  const res = await fetch('/api/xp/status', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch XP status')
  const data: XpStatus = await res.json()
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('coursecade_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.currentStreak === 7 && parsed.longestStreak === 23) {
          parsed.currentStreak = 1
          parsed.longestStreak = 1
          localStorage.setItem('coursecade_user', JSON.stringify(parsed))
        }
        const tokens = parsed.totalTokens ?? parsed.xp ?? 0
        const hours = parsed.hoursWatched ?? 0
        const completed = parsed.coursesCompleted ?? 0
        data.tokensMined = tokens
        data.hoursWatched = hours
        data.coursesCompleted = completed
        data.streak = {
          current: parsed.currentStreak ?? 1,
          longest: parsed.longestStreak ?? 1,
        }
        data.dailyQuest = {
          label: 'Watch 2 hours of tutorials today',
          current: Number(hours.toFixed(1)),
          target: 2,
          reward: 50
        }
      }
    } catch (e) {}
  }
  return data
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch courses')
  return res.json()
}

export async function fetchCourse(id: string): Promise<Course | undefined> {
  const res = await fetch(`/api/courses/${id}`, { cache: 'no-store' })
  if (!res.ok) return undefined
  return res.json()
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  sanitizeStorage()
  const res = await fetch('/api/dashboard/summary', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch dashboard summary')
  const data: DashboardSummary = await res.json()
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('coursecade_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.username) {
          const savedMissions = localStorage.getItem('coursecade_missions_' + parsed.username)
          let missions: any[] = []
          if (savedMissions) {
            missions = JSON.parse(savedMissions)
            let sanitized = false
            missions.forEach((m: any) => {
              if ((!m.watchSeconds || m.watchSeconds < 5) && m.progressPct === 25) {
                m.progressPct = 0
                m.watchSeconds = 0
                sanitized = true
              }
            })
            if (sanitized) {
              localStorage.setItem('coursecade_missions_' + parsed.username, JSON.stringify(missions))
            }
            data.activeMissions = missions.slice(0, 3)
            data.enrolledCourses = missions
          } else {
            data.activeMissions = []
            data.enrolledCourses = []
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
          data.xpBreakdown = [
            { label: 'Frontend Mastery', value: Math.min(100, Math.round((front / 2500) * 100)), color: '#121318' },
            { label: 'AI & Data Science', value: Math.min(100, Math.round((ai / 2500) * 100)), color: '#a3e635' },
            { label: 'Backend & Cloud', value: Math.min(100, Math.round((back / 2500) * 100)), color: '#dcfce7' },
            { label: 'Web3 & Blockchain', value: Math.min(100, Math.round((web3 / 2500) * 100)), color: '#86efac' },
          ]
        }
      }
    } catch (e) {}
  }
  return data
}

export async function sendMonitoringHeartbeat(payload: {
  videoId: string
  currentPlayheadTime: number
  maxPlayheadTime?: number
  focusStatus: string
}) {
  const res = await fetch('/api/tracking/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Heartbeat sync failed')
  return res.json()
}
