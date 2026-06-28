'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { XpStatus } from '@/lib/api'

type FeaturedCourseProps = {
  xp: XpStatus | null
  featured?: {
    id: string
    title: string
    desc: string
    image: string
    cta: string
  }
}

export function FeaturedCourseHero({ xp, featured }: FeaturedCourseProps) {
  const item = featured || {
    id: 'react-mastery',
    title: 'Advanced React Patterns',
    desc: 'Master advanced React patterns, hooks, and performance optimization to build production-ready apps.',
    image: '/courses/react-mastery.png',
    cta: 'Resume Mission',
  }

  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-md bg-[#14151A] border border-gray-800/80 min-h-[340px] flex flex-col justify-between p-8 h-full">
      {/* Background Image on Right */}
      <div className="absolute right-0 top-0 bottom-0 w-3/4 overflow-hidden pointer-events-none">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14151A] via-[#14151A]/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-lg my-auto space-y-4">
        <h2 className="font-heading text-3xl md:text-4xl font-black text-white tracking-tight">
          {item.title}
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed font-normal">
          {item.desc}
        </p>

        <div className="pt-4 flex items-center gap-4">
          <Link
            href={`/watch/${item.id}`}
            className="inline-flex items-center justify-center rounded-2xl bg-[#a3e635] px-8 py-3.5 font-sans text-sm font-black text-black transition-all hover:bg-[#8ee014] hover:scale-105 active:scale-95 shadow-lg"
          >
            {item.cta}
          </Link>
          {xp && (
            <span className="text-xs font-mono font-bold text-gray-400">
              +{xp.dailyQuest?.reward ?? 50} XP Quest
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
