'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Trophy, Flame } from 'lucide-react'

export function OctoberCTFBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [participantCount, setParticipantCount] = useState<number | null>(null)

  useEffect(() => {
    // Check if user is already registered
    const userId = localStorage.getItem('october_ctf_user_id')
    if (userId) {
      setIsRegistered(true)
    }

    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem('october_banner_dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Fetch real participant count
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/october/stats')
        if (response.ok) {
          const data = await response.json()
          setParticipantCount(data.active_challengers)
        }
      } catch (error) {
        console.error('Failed to fetch participant count:', error)
      }
    }

    fetchStats()

    // Show banner after a short delay for smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsDismissed(true)
      sessionStorage.setItem('october_banner_dismissed', 'true')
    }, 300)
  }

  // Don't show banner if dismissed
  if (isDismissed) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 border-b-4 border-orange-700 shadow-lg shadow-orange-900/50 overflow-hidden">
        {/* Animated Halloween Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1 left-10 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
            🎃
          </div>
          <div className="absolute top-1 left-1/4 text-xl opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }}>
            👻
          </div>
          <div className="absolute top-1 left-1/2 text-2xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>
            🕷️
          </div>
          <div className="absolute top-1 left-3/4 text-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}>
            🦇
          </div>
          <div className="absolute top-1 right-10 text-2xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.7s' }}>
            🎃
          </div>

          {/* Flame effects */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Icon + Text */}
            <div className="flex items-center gap-3 flex-1">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
                <Trophy className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span className="text-white font-bold text-sm sm:text-base">
                    October Cybersecurity Challenge 2025
                  </span>
                  <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-white/90 text-xs sm:text-sm">
                  {isRegistered ? (
                    <>Continue your progress - <span className="font-semibold">5 levels</span> of AI security challenges! 🎃</>
                  ) : (
                    <>Join the challenge and compete for the top spot! 🏆</>
                  )}
                </p>
              </div>
            </div>

            {/* Right side - CTA Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/october"
                className="group relative px-4 sm:px-6 py-2 bg-white hover:bg-gray-100 text-orange-600 font-bold text-sm sm:text-base rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isRegistered ? (
                    <>🎃 Go to Challenge</>
                  ) : (
                    <>🎯 Join Challenge</>
                  )}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
              </Link>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom animated border */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 animate-pulse"></div>
      </div>
    </div>
  )
}
