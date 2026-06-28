import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET || WEBHOOK_SECRET === 'whsec_placeholder') {
    console.warn('Webhook secret not configured, skipping Svix verification for development fallback')
    // In dev mode without live secret, fallback to unverified json body parse if needed or return 200
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  let evt: WebhookEvent

  if (WEBHOOK_SECRET && WEBHOOK_SECRET !== 'whsec_placeholder' && svix_id && svix_timestamp && svix_signature) {
    const payload = await req.json()
    const body = JSON.stringify(payload)
    const wh = new Webhook(WEBHOOK_SECRET)

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new Response('Error occured verifying svix webhook', { status: 400 })
    }
  } else {
    // Development mode fallback when simulating webhook without svix headers
    const payload = await req.json()
    evt = payload as WebhookEvent
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, username, email_addresses, image_url } = evt.data
    const email = email_addresses?.[0]?.email_address || null
    const name = username || email?.split('@')[0] || `Challenger_${id.slice(-4)}`

    try {
      await db.insert(users).values({
        id: id,
        username: name,
        email: email,
        avatarUrl: image_url || null,
        rankTier: 5, // Platinum starter rank
        xp: 0,
        totalTokens: 0,
        hoursWatched: 0,
        hoursGoal: 120,
        tokensGoal: 20000,
        currentStreak: 1,
        longestStreak: 1,
      })
      console.log(`Successfully synced new Clerk user to DB: ${id} (${name})`)
    } catch (dbError) {
      console.error('Failed to insert user into database (offline or duplicate):', dbError)
    }
  }

  return new Response('Webhook received successfully', { status: 200 })
}
