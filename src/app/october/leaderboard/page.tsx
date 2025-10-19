'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Medal, ArrowLeft, TrendingUp, Clock, Zap, Crown } from 'lucide-react'
import { createBrowserClient, supabaseHelpers } from '@/lib/supabase'
import { useOctober } from '@/contexts/OctoberContext'
import type { LeaderboardEntry } from '@/lib/database.types'

export default function LeaderboardPage() {
  const { user } = useOctober()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<{ rank: number; total_users: number; percentile: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const supabase = createBrowserClient()

        // Fetch leaderboard
        const leaders = await supabaseHelpers.getLeaderboard(supabase, 100)
        setLeaderboard(leaders)

        // Fetch user rank if logged in
        if (user) {
          const rank = await supabaseHelpers.getUserRank(supabase, user.id)
          setUserRank(rank)
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()

    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [user])

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-yellow-500/50">
            {rank}
          </div>
          <Crown className="absolute -top-3 -right-1 w-6 h-6 text-yellow-400 animate-pulse" />
        </div>
      )
    }
    if (rank === 2) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center font-bold text-black text-lg shadow-lg">
          {rank}
        </div>
      )
    }
    if (rank === 3) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
          {rank}
        </div>
      )
    }
    return (
      <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-400 text-sm">
        {rank}
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <main className="min-h-screen bg-[#1e293b] text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-950/40 via-orange-900/20 to-[#1e293b] border-b border-orange-500/30 overflow-hidden">
        {/* Animated Halloween Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">🎃</div>
          <div className="absolute top-20 right-20 text-4xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>🏆</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-10">👻</div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Link */}
          <Link
            href="/october"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Challenges
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <Trophy className="w-16 h-16 text-yellow-400" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Global Leaderboard
                </span>
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                Top performers in the October Agent Security Challenge
              </p>
            </div>
          </div>

          {/* User Rank Card */}
          {user && userRank && (
            <div className="bg-gradient-to-r from-orange-900/40 via-purple-900/30 to-orange-900/40 border-2 border-orange-500/50 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-sm text-gray-400">Your Rank</div>
                    <div className="text-3xl font-bold text-orange-400">#{userRank.rank}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Top {userRank.percentile.toFixed(0)}%</div>
                  <div className="text-lg text-gray-300">of {userRank.total_users} challengers</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No entries yet. Be the first!</p>
            <Link
              href="/october/register"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
            >
              Register Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const rank = index + 1
              const isCurrentUser = user && entry.id === user.id

              return (
                <div
                  key={entry.id}
                  className={`bg-gradient-to-r from-gray-900 to-gray-900/95 border rounded-lg p-6 transition-all ${
                    isCurrentUser
                      ? 'border-orange-500/60 shadow-lg shadow-orange-500/20'
                      : rank <= 3
                      ? 'border-yellow-500/30 hover:border-yellow-500/50'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        {getRankBadge(rank)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-white truncate">
                            {entry.display_name || entry.username}
                          </h3>
                          {isCurrentUser && (
                            <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs font-medium rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">@{entry.username}</div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">{entry.score}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>

                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-400">
                            {entry.total_flags_captured}/5
                          </div>
                          <div className="text-xs text-gray-500">Flags</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-orange-400">
                            {formatTime(entry.total_time_spent)}
                          </div>
                          <div className="text-xs text-gray-500">Time</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-purple-400">{entry.total_hints_used}</div>
                          <div className="text-xs text-gray-500">Hints</div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="md:hidden flex flex-col items-end gap-2">
                      <div className="text-2xl font-bold text-yellow-400">{entry.score}</div>
                      <div className="text-xs text-gray-400">
                        {entry.total_flags_captured}/5 • {formatTime(entry.total_time_spent)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Scoring Info */}
        <div className="mt-12 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            How Scoring Works
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400">+1000</span>
              <span>points per flag captured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">-50</span>
              <span>points per hint used</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">-1</span>
              <span>point per minute spent</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Leaderboard updates in real-time. Complete more levels faster with fewer hints to climb the ranks!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
