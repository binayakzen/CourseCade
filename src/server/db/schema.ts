import { boolean, integer, pgTable, primaryKey, real, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey().default('user_1'),
  username: text('username').notNull().default('binay'),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  rankTier: integer('rank_tier').notNull().default(5), // Platinum index
  xp: integer('xp').notNull().default(0),
  totalTokens: integer('total_tokens').notNull().default(0),
  hoursWatched: real('hours_watched').notNull().default(0),
  hoursGoal: real('hours_goal').notNull().default(120),
  tokensGoal: integer('tokens_goal').notNull().default(20000),
  currentStreak: integer('current_streak').notNull().default(1),
  longestStreak: integer('longest_streak').notNull().default(1),
})

export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  thumbnail: text('thumbnail').notNull(),
  durationHours: real('duration_hours').notNull(),
  multiplier: real('multiplier').notNull(),
  category: text('category').notNull(),
})

export const userCourses = pgTable(
  'user_courses',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    courseId: text('course_id')
      .notNull()
      .references(() => courses.id),
    completed: boolean('completed').notNull().default(false),
    progressHours: real('progress_hours').notNull().default(0),
    lastPlayheadTime: integer('last_playhead_time').notNull().default(0),
    maxPlayheadTime: integer('max_playhead_time').notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.courseId] }),
  ]
)

export const dailyQuests = pgTable('daily_quests', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  label: text('label').notNull(),
  current: integer('current').notNull().default(1),
  target: integer('target').notNull().default(2),
  reward: integer('reward').notNull().default(50),
})
