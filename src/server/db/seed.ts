import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  console.log('📦 Creating database tables on AWS Aurora...')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY DEFAULT 'user_1',
      username text NOT NULL DEFAULT 'binay',
      rank_tier integer NOT NULL DEFAULT 5,
      xp integer NOT NULL DEFAULT 0,
      total_tokens integer NOT NULL DEFAULT 0,
      hours_watched real NOT NULL DEFAULT 0,
      hours_goal real NOT NULL DEFAULT 120,
      tokens_goal integer NOT NULL DEFAULT 20000,
      current_streak integer NOT NULL DEFAULT 7,
      longest_streak integer NOT NULL DEFAULT 23
    );

    CREATE TABLE IF NOT EXISTS courses (
      id text PRIMARY KEY,
      title text NOT NULL,
      author text NOT NULL,
      thumbnail text NOT NULL,
      duration_hours real NOT NULL,
      multiplier real NOT NULL,
      category text NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_courses (
      user_id text NOT NULL REFERENCES users(id),
      course_id text NOT NULL REFERENCES courses(id),
      completed boolean NOT NULL DEFAULT false,
      progress_hours real NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS daily_quests (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id),
      label text NOT NULL,
      current integer NOT NULL DEFAULT 1,
      target integer NOT NULL DEFAULT 2,
      reward integer NOT NULL DEFAULT 50
    );
  `)

  const db = drizzle({ client: pool, schema })

  console.log('🌱 Seeding catalog & user data...')

  // Insert default user profile
  await db
    .insert(schema.users)
    .values({
      id: 'user_1',
      username: 'binay',
      rankTier: 5,
      xp: 0,
      totalTokens: 0,
      hoursWatched: 0,
      hoursGoal: 120,
      tokensGoal: 20000,
      currentStreak: 7,
      longestStreak: 23,
    })
    .onConflictDoNothing()

  // Insert daily quest
  await db
    .insert(schema.dailyQuests)
    .values({
      id: 'quest_1',
      userId: 'user_1',
      label: 'Watch 2 hours of tutorials today',
      current: 1,
      target: 2,
      reward: 50,
    })
    .onConflictDoNothing()

  // Insert catalog courses
  const coursesData = [
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

  for (const course of coursesData) {
    await db.insert(schema.courses).values(course).onConflictDoNothing()
  }

  for (const course of coursesData.slice(0, 3)) {
    await db
      .insert(schema.userCourses)
      .values({
        userId: 'user_1',
        courseId: course.id,
        completed: false,
        progressHours: 0,
      })
      .onConflictDoNothing()
  }

  console.log('✅ AWS Aurora schema & seed complete!')
  await pool.end()
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
