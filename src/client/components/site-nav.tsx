'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Coins, LayoutDashboard, Library, TrendingUp, User, LogIn, LogOut } from 'lucide-react'
import { ClerkNavButtons } from '@/components/auth/clerk-nav'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', icon: Library },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
]

const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = pubKey && !pubKey.includes('cGxhY2Vob2xk') && pubKey.startsWith('pk_')

export function SiteNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [tokens, setTokens] = useState(0)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coursecade_user')
      window.dispatchEvent(new Event('authChange'))
    }
    router.push('/login')
  }

  useEffect(() => {
    let active = true

    async function loadBalance() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('coursecade_user')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.totalTokens >= 12480) {
              parsed.totalTokens -= 12480
              if (parsed.xp >= 12480) parsed.xp -= 12480
              localStorage.setItem('coursecade_user', JSON.stringify(parsed))
            }
            if (parsed.currentStreak === 7 && parsed.longestStreak === 23) {
              parsed.currentStreak = 1
              parsed.longestStreak = 1
              localStorage.setItem('coursecade_user', JSON.stringify(parsed))
            }
            if (parsed.username) {
              localStorage.setItem('coursecade_stats_' + parsed.username, JSON.stringify(parsed))
            }
            if (active && typeof parsed.totalTokens === 'number') {
              setTokens(parsed.totalTokens)
              return
            }
          } catch {}
        }
      }
      try {
        const res = await fetch('/api/auth/profile', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (active && typeof data.totalTokens === 'number') {
            setTokens(data.totalTokens)
          }
        }
      } catch (err) {}
    }

    loadBalance()
    const interval = setInterval(loadBalance, 2000)

    const handleInstantTokens = (e: any) => {
      if (e && typeof e.detail === 'number') {
        setTokens((prev) => prev + e.detail)
      }
    }
    window.addEventListener('tokensEarned', handleInstantTokens)

    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('coursecade_user')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.totalTokens >= 12480) {
              parsed.totalTokens -= 12480
              if (parsed.xp >= 12480) parsed.xp -= 12480
              localStorage.setItem('coursecade_user', JSON.stringify(parsed))
            }
            if (parsed.currentStreak === 7 && parsed.longestStreak === 23) {
              parsed.currentStreak = 1
              parsed.longestStreak = 1
              localStorage.setItem('coursecade_user', JSON.stringify(parsed))
            }
            setUser(parsed)
            if (typeof parsed.totalTokens === 'number') setTokens(parsed.totalTokens)
          } catch {
            setUser(null)
          }
        } else {
          setUser(null)
          // ENFORCE MANDATORY AUTH RULE: Allow login, sign-in, sign-up pages without redirect
          if (pathname !== '/login' && !pathname.startsWith('/sign-in') && !pathname.startsWith('/sign-up')) {
            if (!isClerkConfigured) {
              router.push('/login')
            }
          }
        }
        setAuthChecked(true)
      }
    }
    checkUser()
    window.addEventListener('authChange', checkUser)

    return () => {
      active = false
      clearInterval(interval)
      window.removeEventListener('tokensEarned', handleInstantTokens)
      window.removeEventListener('authChange', checkUser)
    }
  }, [pathname, router])

  // Hide header completely on login page so login screen is full-screen green
  if (pathname === '/login' || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200/80 bg-[#ebecef]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" aria-label="Coursecade home" className="flex-shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-2 md:flex flex-1 justify-center">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all',
                  active
                    ? 'bg-white text-black shadow-sm border border-gray-200/60'
                    : 'text-gray-500 hover:text-black hover:bg-white/60',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[#a3e635] px-3.5 py-1.5 shadow-sm transition-transform active:scale-95 animate-fade-in">
            <Coins className="size-4 text-black animate-bounce" aria-hidden="true" />
            <span className="font-mono text-xs sm:text-sm font-black text-black">
              {tokens.toLocaleString()}
            </span>
            <span className="sr-only">tokens</span>
          </div>

          {isClerkConfigured ? (
            <ClerkNavButtons />
          ) : user ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-full bg-[#121318] text-white px-3.5 py-1.5 text-xs font-mono font-bold hover:bg-black transition-colors border border-gray-700 shadow-sm"
              >
                <User className="size-3.5 text-[#a3e635]" />
                <span className="max-w-[80px] truncate">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 px-3 py-1.5 text-xs font-mono font-bold transition-colors border border-red-500/30 shadow-sm active:scale-95"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full bg-[#121318] text-[#a3e635] px-4 py-1.5 text-xs font-mono font-bold hover:bg-black transition-all border border-[#a3e635]/40 shadow-sm hover:shadow-[#a3e635]/20"
              >
                <LogIn className="size-3.5" />
                <span>LOGIN</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
