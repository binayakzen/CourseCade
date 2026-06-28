export let FALLBACK_USER = {
  id: 'user_1',
  username: 'binay',
  rankTier: 5, // Platinum index
  xp: 0,
  totalTokens: 0,
  hoursWatched: 0,
  hoursGoal: 120,
  tokensGoal: 20000,
  currentStreak: 1,
  longestStreak: 1,
}

export function awardTokensToUser(tokens: number, hours: number = 0) {
  if (FALLBACK_USER.totalTokens >= 12480) {
    FALLBACK_USER.totalTokens -= 12480
    if (FALLBACK_USER.xp >= 12480) FALLBACK_USER.xp -= 12480
    if (FALLBACK_USER.hoursWatched >= 86) FALLBACK_USER.hoursWatched = Number((FALLBACK_USER.hoursWatched - 86).toFixed(1))
  }
  FALLBACK_USER.totalTokens += tokens
  FALLBACK_USER.xp += tokens
  FALLBACK_USER.hoursWatched = Number((FALLBACK_USER.hoursWatched + hours).toFixed(3))
  return FALLBACK_USER
}

export const FALLBACK_COURSES = [
  {
    id: 'react-mastery',
    title: 'Advanced React Patterns',
    author: 'Vercel Academy',
    thumbnail: '/courses/react-mastery.png',
    durationHours: 12,
    multiplier: 1.5,
    category: 'Frontend',
    youtubeId: 'bMknfKXIFA8',
  },
  {
    id: 'python-ai',
    title: 'Python for AI & Machine Learning',
    author: 'DeepLearn TV',
    thumbnail: '/courses/python-ai.png',
    durationHours: 18,
    multiplier: 2,
    category: 'AI / ML',
    youtubeId: '_uQrJ0TkZlc',
  },
  {
    id: 'web3-blockchain',
    title: 'Web3 & Smart Contract Dev',
    author: 'ChainBuilders',
    thumbnail: '/courses/web3-blockchain.png',
    durationHours: 9,
    multiplier: 1.75,
    category: 'Blockchain',
    youtubeId: 'gyMwXuJrbJQ',
  },
  {
    id: 'design-systems',
    title: 'Design Systems Masterclass',
    author: 'PixelForge',
    thumbnail: '/courses/design-systems.png',
    durationHours: 7,
    multiplier: 1.25,
    category: 'Design',
    youtubeId: 'c9Wg6Cb_YlU',
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud Infrastructure',
    author: 'CloudOps Pro',
    thumbnail: '/courses/devops-cloud.png',
    durationHours: 14,
    multiplier: 1.5,
    category: 'DevOps',
    youtubeId: 'hQcFE0RD0cQ',
  },
  {
    id: 'cybersecurity',
    title: 'Ethical Hacking & Security',
    author: 'SecureNode',
    thumbnail: '/courses/cybersecurity.png',
    durationHours: 11,
    multiplier: 2,
    category: 'Security',
    youtubeId: '3Kq1MIfTWCE',
  },
]

export const FALLBACK_USER_COURSES = [
  {
    userId: 'user_1',
    courseId: 'react-mastery',
    completed: false,
    progressHours: 0,
  },
  {
    userId: 'user_1',
    courseId: 'python-ai',
    completed: false,
    progressHours: 0,
  },
  {
    userId: 'user_1',
    courseId: 'design-systems',
    completed: false,
    progressHours: 0,
  },
]

export const FALLBACK_DAILY_QUEST = {
  id: 'quest_1',
  userId: 'user_1',
  label: 'Watch 2 hours of tutorials today',
  current: 0,
  target: 2,
  reward: 50,
}

export const FALLBACK_PEERS = [
  { id: 1, name: 'Raven', avatar: '/avatars/avatar-1.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
  { id: 2, name: 'Nebula', avatar: '/avatars/avatar-2.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
  { id: 3, name: 'Phantom', avatar: '/avatars/avatar-3.png', online: false, monitoringStatus: 'Offline' },
  { id: 4, name: 'Specter', avatar: '/avatars/avatar-4.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
  { id: 5, name: 'Inferno', avatar: '/avatars/avatar-5.png', online: true, monitoringStatus: 'Active Anti-Cheat Sync' },
]

export const FALLBACK_XP_BREAKDOWN = [
  { label: 'Frontend Mastery', value: 40, color: '#121318' },
  { label: 'AI & Data Science', value: 30, color: '#a3e635' },
  { label: 'Backend & Cloud', value: 20, color: '#dcfce7' },
  { label: 'Web3 & Blockchain', value: 10, color: '#86efac' },
]
