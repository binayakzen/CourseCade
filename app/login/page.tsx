'use client'

import React from 'react'
import { LoginCard } from '@/components/auth/login-card'
import { Logo } from '@/components/logo'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#185563] via-[#2e8b57] to-[#43a047] relative overflow-hidden select-none font-sans p-4">
      {/* Flowing Wave Background Elements matching reference image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute bottom-0 w-full h-3/5 text-[#388e3c]/30" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,165.3C840,171,960,213,1080,213.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
        <svg className="absolute bottom-0 w-full h-2/5 text-[#2e7d32]/30" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,240C840,256,960,256,1080,240C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>

        {/* Ambient background sparkles */}
        <span className="absolute top-1/4 left-16 text-white/50 text-base animate-pulse">✦</span>
        <span className="absolute top-1/3 right-24 text-white/40 text-sm animate-pulse" style={{ animationDelay: '1s' }}>✦</span>
        <span className="absolute bottom-1/4 left-1/4 text-white/60 text-xs animate-pulse" style={{ animationDelay: '0.7s' }}>✦</span>
        <span className="absolute bottom-1/3 right-16 text-white/50 text-base animate-pulse" style={{ animationDelay: '1.2s' }}>✦</span>
      </div>

      {/* TOP HEADER: Message on Left, Coursecade Logo on Right */}
      <div className="absolute top-0 inset-x-0 z-20 w-full max-w-7xl mx-auto px-6 pt-6 md:px-10 md:pt-10 flex justify-between items-start pointer-events-none">
        {/* Left Side Message */}
        <div className="flex flex-col text-left select-none animate-fade-in pointer-events-auto">
          <h1 className="text-3xl md:text-5xl italic font-black text-white tracking-tight drop-shadow-md">
            Login page
          </h1>
          <p className="text-base md:text-xl font-light text-emerald-100/90 mt-1 leading-snug drop-shadow">
            Start your journey<br />now with us
          </p>
        </div>

        {/* Right Side Coursecade Logo */}
        <div className="animate-fade-in pointer-events-auto bg-black/25 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shadow-lg [&_.text-foreground]:text-white scale-90 sm:scale-100 transition-transform hover:scale-105">
          <Logo />
        </div>
      </div>

      {/* DEAD-CENTERED LOGIN CARD */}
      <div className="relative z-10 w-full animate-fade-in my-auto flex justify-center items-center pt-24 md:pt-12">
        <LoginCard />
      </div>
    </div>
  )
}
