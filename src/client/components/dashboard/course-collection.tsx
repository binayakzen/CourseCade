'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const courses = [
  {
    id: 'react-mastery',
    title: 'React Mastery',
    image: '/courses/react-mastery.png',
    completed: false,
  },
  {
    id: 'python-ai',
    title: 'Python AI',
    image: '/courses/python-ai.png',
    completed: true,
  },
  {
    id: 'web3-blockchain',
    title: 'Web3 Blockchain',
    image: '/courses/web3-blockchain.png',
    completed: false,
  },
  {
    id: 'design-systems',
    title: 'Design Systems',
    image: '/courses/design-systems.png',
    completed: true,
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud',
    image: '/courses/devops-cloud.png',
    completed: false,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    image: '/courses/cybersecurity.png',
    completed: false,
  },
]

export function CourseCollection() {
  return (
    <aside
      className="flex flex-col gap-4 rounded-2xl p-6 backdrop-blur-md border border-white/15 shadow-lg"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-white">
          My Courses
        </h3>
        <Link
          href="/courses"
          className="text-xs font-semibold text-neon-green hover:text-neon-green/80 transition-colors"
        >
          See All
        </Link>
      </div>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/watch/${course.id}`}
            className="group flex items-center gap-3 rounded-lg hover:bg-white/10 px-3 py-2.5 transition-colors"
          >
            {/* Course thumbnail */}
            <div className="relative size-10 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Course title */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {course.title}
              </p>
            </div>

            {/* Completion badge */}
            {course.completed ? (
              <CheckCircle2 className="size-5 text-neon-green flex-shrink-0" aria-hidden="true" />
            ) : (
              <div className="size-5 rounded-full border-2 border-white/30 flex-shrink-0" aria-hidden="true" />
            )}
          </Link>
        ))}
      </div>
    </aside>
  )
}
