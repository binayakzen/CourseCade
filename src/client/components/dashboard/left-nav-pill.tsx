'use client'

import { Home, BookOpen, TrendingUp, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function LeftNavPill() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: Home, href: '/dashboard', label: 'Dashboard', active: pathname === '/dashboard' },
    { icon: BookOpen, href: '/courses', label: 'Courses', active: pathname.startsWith('/courses') || pathname.startsWith('/watch') },
    { icon: TrendingUp, href: '/progress', label: 'Progress', active: pathname.startsWith('/progress') },
  ]

  function handleQuickLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coursecade_user')
      window.dispatchEvent(new Event('authChange'))
    }
    router.push('/login')
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <nav className="flex flex-col gap-1.5 rounded-full p-2.5 bg-[#14151A] shadow-2xl border border-gray-800">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`p-3 rounded-full transition-all ${
                item.active
                  ? 'bg-[#a3e635] text-black shadow-md glow-green'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="size-5" aria-hidden="true" />
            </Link>
          )
        })}
        <div className="border-t border-white/10 my-1" />
        <button
          onClick={() => alert('⚙️ Coursecade v2.0 System Settings: All Sync Engines Nominal.')}
          className="p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="size-5" aria-hidden="true" />
        </button>
        <button
          onClick={handleQuickLogout}
          className="p-3 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          title="Quick Logout"
          aria-label="Quick Logout"
        >
          <LogOut className="size-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  )
}
