import Image from 'next/image'
import Link from 'next/link'
import { Clock, PlayCircle, Zap } from 'lucide-react'
import type { Course } from '@/lib/api'

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/watch/${course.id}`}
      className="bg-white group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail || '/placeholder.svg'}
          alt={`${course.title} thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* XP Multiplier badge */}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-black/10 bg-[#a3e635] px-3 py-1 font-mono text-xs font-black text-black shadow-sm">
          <Zap className="size-3.5 fill-black" aria-hidden="true" />
          {course.multiplier}x Boost
        </span>

        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {course.category}
        </span>

        <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
          <PlayCircle className="size-12 text-[#a3e635] fill-black" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-sans text-lg font-black leading-snug text-gray-900">
          {course.title}
        </h3>
        <p className="text-xs font-bold text-gray-500">{course.author}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-3 font-mono text-xs text-gray-400 font-bold">
          <Clock className="size-3.5" aria-hidden="true" />
          {course.durationHours}h of content
        </div>
      </div>
    </Link>
  )
}
