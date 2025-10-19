'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, User, Mail, Trophy, Loader2 } from 'lucide-react'
import { createBrowserClient, supabaseHelpers } from '@/lib/supabase'

export default function OctoberRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate username
      if (formData.username.length < 3) {
        throw new Error('Username must be at least 3 characters')
      }

      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        throw new Error('Username can only contain letters, numbers, and underscores')
      }

      const supabase = createBrowserClient()

      // Create or get user
      const user = await supabaseHelpers.getOrCreateUser(supabase, formData.username)

      // Update display name and email if provided
      if (formData.displayName || formData.email) {
        const { error: updateError } = await supabase
          .from('ctf_users')
          .update({
            display_name: formData.displayName || formData.username,
            email: formData.email || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) throw updateError
      }

      // Store user ID in localStorage
      localStorage.setItem('october_ctf_user_id', user.id)
      localStorage.setItem('october_ctf_username', formData.username)

      // Redirect to October challenge page
      router.push('/october')
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.message.includes('duplicate key')) {
        setError('Username already taken. Please choose another.')
      } else {
        setError(err.message || 'Failed to register. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Link */}
          <Link
            href="/october"
            className="inline-flex items-center text-gray-400 hover:text-cyan-400 mb-8 transition-colors"
          >
            ← Back to Challenge
          </Link>

          {/* Awareness Month Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-900/40 to-orange-800/40 border border-orange-400/60 rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-orange-900/20">
            <span className="text-lg">🎃</span>
            <Shield className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-semibold text-orange-200">
              Join the October Challenge
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Register for CTF
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Create your account to track progress, compete on the leaderboard, and earn your October certificate.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/20 border-2 border-orange-900/40 rounded-xl p-8 shadow-2xl shadow-orange-900/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-900/30 border border-orange-500/50 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create Your Profile</h2>
            <p className="text-gray-400">Join 1,234 challengers competing this October</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_]+"
                  placeholder="agent_hunter"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border-2 border-orange-900/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_15px_rgba(251,146,60,0.2)] transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Letters, numbers, and underscores only</p>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                Display Name (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  maxLength={50}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border-2 border-orange-900/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_15px_rgba(251,146,60,0.2)] transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Shown on leaderboard (defaults to username)</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border-2 border-orange-900/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_15px_rgba(251,146,60,0.2)] transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">For certificate delivery and updates</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg shadow-orange-900/30 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  🎯 Start Challenge
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-4 text-center">What you get:</p>
            <div className="space-y-3">
              {[
                '📊 Track your progress across all levels',
                '🏆 Compete on the global leaderboard',
                '🎓 Earn October certificate upon completion',
                '⏱️ View your time and hint statistics'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
