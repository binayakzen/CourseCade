'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Cog,
  Home,
  Library,
  Lock,
  Trophy,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home', group: 'main' },
  { href: '/courses', icon: Library, label: 'Courses', group: 'main' },
  {
    href: '/dashboard/stats',
    icon: BarChart3,
    label: 'Stats',
    group: 'main',
  },
  { href: '/dashboard/achievements', icon: Trophy, label: 'Achievements', group: 'main' },
  { href: '/dashboard/power-ups', icon: Zap, label: 'Power-ups', group: 'tools' },
  { href: '/dashboard/settings', icon: Cog, label: 'Settings', group: 'tools' },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 border-r border-border/60 bg-card/40 backdrop-blur-lg">
      <div className="flex h-full flex-col items-center gap-6 py-6">
        {/* Logo placeholder */}
        <div className="flex size-12 items-center justify-center rounded-xl bg-neon-green/20 text-neon-green font-bold">
          C
        </div>

        {/* Main nav items */}
        <nav className="flex flex-col gap-4">
          {navItems
            .filter((item) => item.group === 'main')
            .map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={cn(
                    'relative flex size-12 items-center justify-center rounded-lg transition-all duration-200',
                    active
                      ? 'bg-neon-green/20 text-neon-green glow-green'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/60',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg border border-neon-green/50 animate-pulse"
                    />
                  )}
                </Link>
              )
            })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Tool items */}
        <nav className="flex flex-col gap-4">
          {navItems
            .filter((item) => item.group === 'tools')
            .map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={cn(
                    'flex size-12 items-center justify-center rounded-lg transition-colors',
                    active
                      ? 'bg-neon-gold/20 text-neon-gold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/60',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </Link>
              )
            })}
        </nav>
      </div>
    </aside>
  )
}
