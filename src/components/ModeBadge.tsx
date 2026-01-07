'use client'

import React from 'react'
import { Cpu, Zap } from 'lucide-react'
import { getLLMService } from '@/lib/llm-service'
import { getWebLLMEngine } from '@/lib/web-llm-engine'

export function ModeBadge() {
  const [mode, setMode] = React.useState<'api' | 'local'>('api')
  const [modelName, setModelName] = React.useState<string>('API')

  React.useEffect(() => {
    const updateMode = () => {
      const service = getLLMService()
      const currentMode = service.getCurrentProvider()
      setMode(currentMode)

      if (currentMode === 'local') {
        const engine = getWebLLMEngine()
        const currentModel = engine.getCurrentModel()
        if (currentModel) {
          const modelInfo = engine.getModelInfo(currentModel)
          setModelName(modelInfo?.name || currentModel)
        } else {
          setModelName('No Model')
        }
      } else {
        setModelName('API')
      }
    }

    updateMode()
    
    // Listen for storage changes (mode switches)
    const handleStorageChange = () => {
      updateMode()
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically in case storage event doesn't fire
    const interval = setInterval(updateMode, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
        mode === 'local'
          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
          : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
      }`}
    >
      {mode === 'local' ? (
        <>
          <Cpu className="w-3.5 h-3.5" />
          <span>Local: {modelName}</span>
        </>
      ) : (
        <>
          <Zap className="w-3.5 h-3.5" />
          <span>API Mode</span>
        </>
      )}
    </div>
  )
}

