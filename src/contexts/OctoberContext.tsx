'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import type { CTFUser, LevelProgress } from '@/lib/database.types'

interface OctoberContextType {
  user: CTFUser | null
  isLoading: boolean
  userProgress: LevelProgress[]
  refreshUser: () => Promise<void>
  refreshProgress: () => Promise<void>
  logout: () => void
}

const OctoberContext = createContext<OctoberContextType | undefined>(undefined)

export function OctoberProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CTFUser | null>(null)
  const [userProgress, setUserProgress] = useState<LevelProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    const userId = localStorage.getItem('october_ctf_user_id')
    if (!userId) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from('ctf_users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
      localStorage.removeItem('october_ctf_user_id')
      localStorage.removeItem('october_ctf_username')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProgress = async () => {
    const userId = localStorage.getItem('october_ctf_user_id')
    if (!userId) return

    try {
      // Use API route to bypass RLS
      const response = await fetch(`/api/october/progress/user?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch progress')
      }

      const result = await response.json()
      setUserProgress(result.data || [])
    } catch (error) {
      console.error('Failed to fetch progress:', error)
      setUserProgress([])
    }
  }

  const logout = () => {
    setUser(null)
    setUserProgress([])
    localStorage.removeItem('october_ctf_user_id')
    localStorage.removeItem('october_ctf_username')
  }

  useEffect(() => {
    refreshUser()
  }, [])

  useEffect(() => {
    if (user) {
      refreshProgress()
    }
  }, [user])

  return (
    <OctoberContext.Provider
      value={{
        user,
        isLoading,
        userProgress,
        refreshUser,
        refreshProgress,
        logout
      }}
    >
      {children}
    </OctoberContext.Provider>
  )
}

export function useOctober() {
  const context = useContext(OctoberContext)
  if (context === undefined) {
    throw new Error('useOctober must be used within an OctoberProvider')
  }
  return context
}
