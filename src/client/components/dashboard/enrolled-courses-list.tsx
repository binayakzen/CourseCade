'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sanitizeStorage, type EnrolledCourseItem } from '@/lib/api'

export function EnrolledCoursesList({ courses }: { courses?: EnrolledCourseItem[] }) {
  const [list, setList] = useState<EnrolledCourseItem[]>([])

  const loadList = () => {
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
          setList(missions)
        } else {
          setList(courses && courses.length > 0 ? courses : [])
        }
      } catch (e) {
        setList(courses && courses.length > 0 ? courses : [])
      }
    }
  }

  useEffect(() => {
    loadList()
    window.addEventListener('missionsUpdated', loadList)
    window.addEventListener('authChange', loadList)
    return () => {
      window.removeEventListener('missionsUpdated', loadList)
      window.removeEventListener('authChange', loadList)
    }
  }, [courses])

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-lg font-black text-gray-900 tracking-tight">My Course Collection</h3>
      </div>

      {list.length === 0 ? (
        <div className="my-auto py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 px-4">
          <p className="text-xs font-black text-gray-700 mb-1">No Enrolled Courses</p>
          <p className="text-[11px] text-gray-500 mb-3">Watch videos from our catalog to build your collection.</p>
          <Link href="/courses" className="text-xs font-bold text-[#a3e635] bg-[#121318] px-3.5 py-1.5 rounded-xl inline-block shadow hover:scale-105 transition-transform">
            Browse Catalog →
          </Link>
        </div>
      ) : (
        <div className="space-y-3 my-auto">
          {list.map((course) => (
            <Link
              key={course.id}
              href={`/watch/${course.id}`}
              className="flex gap-3 items-center p-2 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
            >
              <div className="relative size-11 rounded-xl flex-shrink-0 overflow-hidden shadow-sm bg-gray-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate group-hover:text-black">
                  {course.title}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {course.completed ? 'Completed' : `${course.progressPct}% • In Progress`}
                </p>
              </div>
              <div className="size-8 rounded-full bg-[#a3e635] flex items-center justify-center text-black font-black text-xs shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                ↗
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pt-4 text-right">
        <Link href="/courses" className="text-xs font-bold text-gray-500 underline hover:text-black transition-colors">
          See All
        </Link>
      </div>
    </div>
  )
}
