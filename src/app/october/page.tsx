'use client'

import Link from 'next/link'
import { Shield, Lock, Unlock, Trophy, Clock, Users, CheckCircle2, LogOut } from 'lucide-react'
import { useOctober } from '@/contexts/OctoberContext'
import { useState, useEffect } from 'react'

interface Level {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  description: string
  topics: string[]
  cve?: string
  locked: boolean
}

const levels: Level[] = [
  {
    id: 1,
    title: "The Friendly Assistant",
    difficulty: "Easy",
    description: "Exploit prompt injection to manipulate an AI agent into calling unauthorized tools.",
    topics: ["Prompt Injection", "Tool Calling", "Function Abuse"],
    locked: false
  },
  {
    id: 2,
    title: "The MCP Server",
    difficulty: "Medium",
    description: "Exploit an unauthenticated MCP server to access restricted files and execute commands.",
    topics: ["MCP Protocol", "Authentication Bypass", "Command Injection"],
    locked: false
  },
  {
    id: 3,
    title: "The Confused Deputy",
    difficulty: "Medium",
    description: "Use indirect prompt injection through email content to exfiltrate sensitive calendar data.",
    topics: ["Indirect Injection", "Confused Deputy", "Data Exfiltration"],
    cve: "Inspired by CVE-2025-XXXXX (Salesforce ForcedLeak)",
    locked: false
  },
  {
    id: 4,
    title: "The RCE Chain",
    difficulty: "Hard",
    description: "Chain command injection vulnerabilities in MCP tools to achieve remote code execution.",
    topics: ["Command Injection", "RCE", "Shell Escaping"],
    cve: "Based on CVE-2025-6514 (mcp-remote RCE)",
    locked: false
  },
  {
    id: 5,
    title: "The Full Chain",
    difficulty: "Expert",
    description: "Execute a multi-stage attack to steal OAuth tokens and compromise the entire agent system.",
    topics: ["Multi-Stage Attacks", "Token Theft", "Privilege Escalation"],
    locked: false
  }
]

const getDifficultyColor = (difficulty: Level['difficulty']) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-400'
    case 'Medium': return 'text-yellow-400'
    case 'Hard': return 'text-orange-400'
    case 'Expert': return 'text-red-400'
  }
}

interface LeaderboardEntry {
  rank: number
  display_name: string
  username: string
  score: number
  levels_completed: number
  flags: string[]
}

interface Stats {
  active_challengers: number
  flags_captured: number
  top_3: LeaderboardEntry[]
}

export default function OctoberChallengePage() {
  const { user, isLoading, userProgress, logout } = useOctober()
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/october/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate days remaining until end of October
  const getDaysRemaining = () => {
    const now = new Date()
    const endOfOctober = new Date(2025, 9, 31, 23, 59, 59) // October 31, 2025
    const diff = endOfOctober.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  // Calculate which levels are unlocked based on user progress
  const getUnlockedLevels = () => {
    if (!user) return [1] // Only level 1 unlocked for non-registered users

    const completedLevels = userProgress
      .filter(p => p.is_completed)
      .map(p => parseInt(p.level_id))

    const maxCompletedLevel = completedLevels.length > 0 ? Math.max(...completedLevels) : 0

    // Unlock all levels up to max completed + 1
    const unlockedLevels = []
    for (let i = 1; i <= Math.min(maxCompletedLevel + 1, 5); i++) {
      unlockedLevels.push(i)
    }

    // Always unlock level 1
    if (!unlockedLevels.includes(1)) {
      unlockedLevels.push(1)
    }

    return unlockedLevels
  }

  const isLevelCompleted = (levelId: number) => {
    return userProgress.some(p => p.level_id === levelId.toString() && p.is_completed)
  }

  const unlockedLevels = getUnlockedLevels()

  return (
    <main className="min-h-screen bg-[#1e293b] text-white">
      {/* Hero Section with October Theme */}
      <div className="relative bg-gradient-to-b from-orange-950/40 via-orange-900/20 to-[#1e293b] border-b border-orange-500/30 overflow-hidden">
        {/* Animated Halloween Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">🎃</div>
          <div className="absolute top-20 right-20 text-4xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>🕷️</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-10">👻</div>
          <div className="absolute top-1/3 right-1/3 text-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>🦇</div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
            >
              ← Back to Labs
            </Link>

            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Logged in as</div>
                  <div className="font-semibold text-orange-400">{user.username}</div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Awareness Month Badge with Pumpkin */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-900/40 to-orange-800/40 border border-orange-400/60 rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-orange-900/20 animate-pulse">
            <span className="text-lg">🎃</span>
            <Shield className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-semibold text-orange-200">
              Cybersecurity Awareness Month 2025
            </span>
            <span className="text-lg">🔐</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              October Agent Security Challenge
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl">
            Master AI agent security through 5 progressive CTF challenges. Explore real-world vulnerabilities
            in MCP servers, tool-calling agents, and multi-stage attack chains.
          </p>

          {/* Theme */}
          <div className="flex items-center gap-2 text-cyan-400 mb-8">
            <span className="text-2xl font-semibold">Secure Our World</span>
            <span className="text-gray-400">- One Agent at a Time</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-gray-400">Active Challengers</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {statsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats?.active_challengers.toLocaleString() || '0'
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-400">Flags Captured</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {statsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats?.flags_captured.toLocaleString() || '0'
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-gray-400">Challenge Ends In</span>
              </div>
              <div className="text-2xl font-bold text-white">{getDaysRemaining()} days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Banner for Non-Registered Users */}
      {!user && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-orange-900/40 via-purple-900/30 to-orange-900/40 border-2 border-orange-500/50 rounded-lg p-6 shadow-lg shadow-orange-900/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-300 mb-1">
                    Register to Track Your Progress!
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Create an account to unlock all levels, compete on the leaderboard, and earn your certificate.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/october/register"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg whitespace-nowrap"
                >
                  Register Now →
                </Link>
                <Link
                  href="/october/login"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-all whitespace-nowrap"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Levels */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Challenge Levels</h2>
          <p className="text-gray-400">
            Each level explores real vulnerabilities discovered in 2025. Complete challenges to unlock advanced levels.
          </p>
        </div>

        <div className="space-y-6">
          {levels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.id)
            const isCompleted = isLevelCompleted(level.id)

            return (
              <div
                key={level.id}
                className={`bg-gradient-to-r from-gray-900 to-gray-900/95 border rounded-lg overflow-hidden transition-all ${
                  isUnlocked
                    ? 'border-orange-900/30 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20'
                    : 'border-gray-800 opacity-60'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {isCompleted ? (
                        <div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-500/50 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </div>
                      ) : isUnlocked ? (
                        <div className="w-12 h-12 rounded-full bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center">
                          <Unlock className="w-6 h-6 text-cyan-400" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-gray-600" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold text-white">
                            Level {level.id}: {level.title}
                          </h3>
                          <span className={`text-sm font-medium ${getDifficultyColor(level.difficulty)}`}>
                            {level.difficulty}
                          </span>
                          {isCompleted && (
                            <span className="px-2 py-1 bg-green-900/30 border border-green-500/50 text-green-400 text-xs font-medium rounded-full">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400">{level.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {level.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-gray-800 text-sm text-gray-300 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* CVE Reference */}
                  {level.cve && (
                    <div className="mb-4 text-sm text-orange-400 bg-orange-900/20 border border-orange-900/30 rounded-lg px-3 py-2 inline-block">
                      {level.cve}
                    </div>
                  )}

                  {/* Action Button */}
                  {!isUnlocked ? (
                    <div className="text-sm text-gray-500">
                      🔒 Complete Level {level.id - 1} to unlock
                    </div>
                  ) : (
                    <Link
                      href={`/october/level/${level.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-orange-900/30 hover:shadow-orange-500/40"
                    >
                      {isCompleted ? '🔁 Retry Challenge' : '🎯 Start Challenge'} →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Global Leaderboard</h2>
              <p className="text-gray-400">Top performers updated in real-time</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>

          <div className="space-y-3">
            {statsLoading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-gray-800/50 rounded-lg animate-pulse">
                  <div className="h-8 bg-gray-700 rounded"></div>
                </div>
              ))
            ) : stats?.top_3 && stats.top_3.length > 0 ? (
              // Real leaderboard data
              stats.top_3.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      'bg-orange-600 text-white'
                    }`}>
                      {entry.rank}
                    </div>
                    <span className="font-medium text-white">@{entry.username}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span>{entry.levels_completed}/5 levels</span>
                    <span className="text-cyan-400">{entry.score.toLocaleString()} pts</span>
                  </div>
                </div>
              ))
            ) : (
              // No data yet
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Be the first to complete challenges and claim the top spot! 🎃</p>
              </div>
            )}
          </div>

          <Link
            href="/october/leaderboard"
            className="mt-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View Full Leaderboard →
          </Link>
        </div>
      </div>

      {/* Certificate Section with October Theme */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-r from-orange-900/30 via-purple-900/20 to-orange-900/30 border border-orange-500/40 rounded-lg p-8 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-4 right-4 text-4xl opacity-20">🏆</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-20">🎃</div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl">🎓</span>
              <Shield className="w-16 h-16 text-orange-400" />
              <span className="text-3xl">🎃</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Earn Your October Certificate
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Complete all 5 levels during October 2025 to earn the exclusive <span className="text-orange-400 font-semibold">"AI Agent Security Professional - October 2025"</span> certificate.
              LinkedIn-ready with verification QR code and special October badge! 🎃
            </p>
            {user && userProgress.filter(p => p.is_completed).length === 5 && (
              <Link
                href="/october/certificate"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                <Trophy className="w-5 h-5" />
                View Your Certificate →
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
