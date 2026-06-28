export interface Env {
  EDGE_HMAC_SECRET: string
  ALLOWED_ORIGIN: string
}

interface HeartbeatPayload {
  userId: string
  sessionId: string
  videoId: string
  currentPlayheadTime: number
  prevPlayheadTime: number
  timeDeltaSeconds: number
  focusStatus: 'active' | 'paused' | 'hidden'
  attentionScore: number // 0.0 to 1.0
}

// In-memory session store for edge verification (in production, backed by Cloudflare KV or Durable Objects)
const edgeSessionStore = new Map<string, { lastPlayhead: number; lastTimestamp: number }>()

async function signPayload(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    try {
      const payload: HeartbeatPayload = await request.json()
      const {
        userId = 'anon',
        sessionId = 'default_session',
        videoId,
        currentPlayheadTime = 0,
        prevPlayheadTime = 0,
        timeDeltaSeconds = 5,
        focusStatus,
        attentionScore = 1.0,
      } = payload

      const now = Date.now()
      const sessionKey = `${userId}:${sessionId}:${videoId}`
      const prevSession = edgeSessionStore.get(sessionKey)

      let tokensAwarded = 0
      let telemetryStatus = 'Anti-Cheat Verified [Focus & Playback Active]'
      let monitoringLog = `Edge Telemetry sync verified at playhead ${currentPlayheadTime}s.`
      let isAnomaly = false

      // 1. Check Video Pause Rule
      if (focusStatus === 'paused') {
        tokensAwarded = 0
        telemetryStatus = 'Anti-Cheat Blocked [Video Playback Paused]'
        monitoringLog = 'Edge engine blocked token credit because video playback is paused (+0 Tokens).'
      }
      // 2. Check Tab Suspend Rule
      else if (focusStatus === 'hidden' || attentionScore <= 0.05) {
        tokensAwarded = 0
        telemetryStatus = 'Anti-Cheat Blocked [Tab Switch or Inactive]'
        monitoringLog = '🚨 Edge Anti-Cheat detected tab switch or 0% attention! Token mining suspended.'
      }
      // 3. Check Skip Detection Threshold (Jump > 2 mins / 120s)
      else {
        const effectivePrevPlayhead = prevSession ? prevSession.lastPlayhead : prevPlayheadTime
        const playheadDelta = currentPlayheadTime - effectivePrevPlayhead

        // If user sought forward or backward by more than 120 seconds in a single tick
        if (effectivePrevPlayhead > 0 && Math.abs(playheadDelta) > 120) {
          tokensAwarded = 0
          isAnomaly = true
          telemetryStatus = '🚨 Anti-Cheat Blocked [Video Skip Detected]'
          monitoringLog = `🚨 Anomaly detected: Playhead jumped ${playheadDelta > 0 ? '+' : ''}${Math.round(playheadDelta)}s (exceeds 120s threshold). 0 tokens awarded.`
        } else {
          // Calculate valid token yield scaled by attention score
          const baseTokens = 15
          const courseMultiplier = videoId === 'python-ai' ? 2.0 : 1.5
          tokensAwarded = Math.round(baseTokens * courseMultiplier * Math.max(0, Math.min(1.0, attentionScore)))
        }
      }

      // Update session store
      edgeSessionStore.set(sessionKey, {
        lastPlayhead: currentPlayheadTime,
        lastTimestamp: now,
      })

      // Generate Cryptographic Edge Signature
      const signaturePayload = `${userId}:${videoId}:${tokensAwarded}:${now}`
      const edgeSignature = await signPayload(signaturePayload, env.EDGE_HMAC_SECRET || 'default_secret')

      const responseBody = {
        success: true,
        verifiedByEdge: true,
        telemetryStatus,
        tokensAwarded,
        attentionScore,
        monitoringLog,
        isAnomaly,
        edgeSignature,
        timestamp: now,
      }

      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Edge Telemetry Processing Error', details: err.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  },
}
