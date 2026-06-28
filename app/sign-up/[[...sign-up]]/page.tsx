import Link from 'next/link'
import { SignUp } from '@clerk/nextjs'

const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = pubKey && !pubKey.includes('cGxhY2Vob2xk') && pubKey.startsWith('pk_')

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Cyber Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-fuchsia-500/15 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono sm:text-4xl">
            CREATE YOUR <span className="text-cyan-400">PROFILE</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Join CourseCade to turn YouTube tutorials into XP and competitive tokens.
          </p>
        </div>

        {isClerkConfigured ? (
          <div className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden border border-cyan-500/30">
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
          </div>
        ) : (
          <div className="w-full max-w-md bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="size-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto text-xl">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white">Cloud Auth Simulation Mode</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Live Clerk keys are not detected in <code className="text-cyan-400 bg-black/40 px-1.5 py-0.5 rounded">.env.local</code>. To use live Passkeys and Google OAuth, insert your keys from <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">clerk.com</a>.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
              >
                Use Built-In Instant Login →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
