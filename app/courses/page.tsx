'use client'

import { useEffect, useState } from 'react'
import { Library, Loader2 } from 'lucide-react'
import { fetchCourses, type Course } from '@/lib/api'
import { CourseCard } from '@/components/courses/course-card'
import { LeftNavPill } from '@/components/dashboard/left-nav-pill'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null)

  useEffect(() => {
    // ────────────────────────────────────────────────────────────────
    // BACKEND INTEGRATION
    //   GET /api/courses -> list of available courses
    // (See lib/api.ts — swap the mock return for a real fetch call.)
    // ────────────────────────────────────────────────────────────────
    let active = true
    fetchCourses().then((data) => {
      if (active) setCourses(data)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen pt-24 pl-4 md:pl-20 pb-20 px-4 sm:px-6 bg-[#ebecef] text-[#111827]">
      <LeftNavPill />
      <div className="flex flex-col gap-6 mx-auto w-full max-w-7xl">
        <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-3 font-sans text-3xl font-black text-gray-900 tracking-tight">
            <Library className="size-8 text-black bg-[#a3e635] p-1.5 rounded-xl shadow-sm" aria-hidden="true" />
            Course Catalog
          </h1>
          <p className="text-sm font-bold text-gray-500">
            Pick a course and start mining tokens. Higher multipliers, faster ranks.
          </p>
        </div>
      </header>

      {!courses ? (
        <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          Loading courses…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
