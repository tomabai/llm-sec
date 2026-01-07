'use client'

import React from 'react'
import { Key, Check, AlertCircle, Cpu, Zap, Download, Info } from 'lucide-react'
import { getLLMService } from '@/lib/llm-service'
import { getWebLLMEngine, AVAILABLE_MODELS } from '@/lib/web-llm-engine'
import type { LLMProvider, ModelLoadProgress } from '@/types/llm'

export function ApiKeyConfig() {
  const [mode, setMode] = React.useState<LLMProvider>('api')
  const [apiKey, setApiKey] = React.useState('')
  const [isApiConfigured, setIsApiConfigured] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Local mode state
  const [selectedModel, setSelectedModel] = React.useState('phi-3-mini')
  const [isModelLoaded, setIsModelLoaded] = React.useState(false)
  const [isLoadingModel, setIsLoadingModel] = React.useState(false)
  const [isAutoLoading, setIsAutoLoading] = React.useState(false) // Track auto-loading state
  const [loadProgress, setLoadProgress] = React.useState<ModelLoadProgress | null>(null)
  const [webGPUSupported, setWebGPUSupported] = React.useState<boolean | null>(null)
  const [webGPUError, setWebGPUError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Check stored mode
    const storedMode = localStorage.getItem('llm_mode') as LLMProvider | null
    if (storedMode && (storedMode === 'api' || storedMode === 'local')) {
      setMode(storedMode)
    }

    // Check API key
    const storedKey = localStorage.getItem('openai_api_key')
    if (storedKey) {
      setApiKey(storedKey)
      setIsApiConfigured(true)
    }

    // Check local model
    const storedModel = localStorage.getItem('local_model')
    if (storedModel) {
      setSelectedModel(storedModel)
    }

    // Auto-reload model if it was previously loaded
    const autoReloadModel = async () => {
      const storedMode = localStorage.getItem('llm_mode') as LLMProvider | null
      const storedModel = localStorage.getItem('local_model')
      
      if (storedMode === 'local' && storedModel) {
        const engine = getWebLLMEngine()
        
        // Check if model is already loaded in memory
        if (!engine.isModelLoaded()) {
          // Check WebGPU support first
          const support = await checkWebGPU()
          if (support && support.supported) {
            // Check if model was previously cached
            const wasCached = localStorage.getItem(`model_${storedModel}_cached`) === 'true'
            
            try {
              if (wasCached) {
                // For cached models: don't show loading UI, but wait for load to complete
                setIsAutoLoading(true)
                setIsLoadingModel(false)
                
                // Load silently in background from cache
                await engine.loadModel(storedModel, () => {
                  // Ignore progress updates for cached models
                })
                
                // Only set as loaded after engine finishes
                setIsModelLoaded(true)
              } else {
                // First time download - show full progress
                setIsLoadingModel(true)
                await engine.loadModel(storedModel, (progress) => {
                  setLoadProgress(progress)
                })
                setIsModelLoaded(true)
                
                // Mark as cached for next time
                localStorage.setItem(`model_${storedModel}_cached`, 'true')
              }
              
              // Update LLM service
              const service = getLLMService()
              service.setProvider('local')
            } catch (err) {
              // If auto-load fails, user can manually reload
              console.warn('Failed to auto-reload model:', err)
              setIsModelLoaded(false)
            } finally {
              setIsAutoLoading(false)
              if (!wasCached) {
                setIsLoadingModel(false)
              }
            }
          }
        } else {
          // Model is already loaded
          setIsModelLoaded(true)
          const currentModel = engine.getCurrentModel()
          if (currentModel) {
            setSelectedModel(currentModel)
          }
        }
      } else {
        // Check if model is already loaded (for when mode is not stored but model is)
        const engine = getWebLLMEngine()
        if (engine.isModelLoaded()) {
          setIsModelLoaded(true)
          const currentModel = engine.getCurrentModel()
          if (currentModel) {
            setSelectedModel(currentModel)
          }
        }
      }
    }

    // Run auto-reload after WebGPU check
    if (typeof window !== 'undefined') {
      checkWebGPU().then(() => {
        autoReloadModel()
      })
    }
  }, [])

  const checkWebGPU = async () => {
    try {
      const engine = getWebLLMEngine()
      const support = await engine.checkWebGPUSupport()
      setWebGPUSupported(support.supported)
      if (!support.supported) {
        setWebGPUError(support.error || 'WebGPU not supported')
      }
      return support
    } catch (err) {
      setWebGPUSupported(false)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setWebGPUError(errorMsg)
      return { supported: false, error: errorMsg }
    }
  }

  const handleModeChange = (newMode: LLMProvider) => {
    setMode(newMode)
    localStorage.setItem('llm_mode', newMode)
    const service = getLLMService()
    service.setProvider(newMode)
    setError(null)
  }

  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
        throw new Error('Invalid API key format')
      }

      localStorage.setItem('openai_api_key', apiKey)
      const service = getLLMService()
      service.setApiKey(apiKey)
      setIsApiConfigured(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key')
      setIsApiConfigured(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiReset = () => {
    localStorage.removeItem('openai_api_key')
    setApiKey('')
    setIsApiConfigured(false)
    setError(null)
  }

  const handleLoadModel = async () => {
    if (!webGPUSupported) {
      setError('WebGPU is not supported in your browser')
      return
    }

    setIsLoadingModel(true)
    setError(null)
    setLoadProgress(null)

    try {
      const engine = getWebLLMEngine()
      
      // Automatically unload current model if switching to a different one
      if (isModelLoaded && engine.getCurrentModel() !== selectedModel) {
        setLoadProgress({
          progress: 0,
          text: 'Unloading current model...',
          timeElapsed: 0
        })
        await engine.unloadModel()
      }

      await engine.loadModel(selectedModel, (progress) => {
        setLoadProgress(progress)
      })

      setIsModelLoaded(true)
      localStorage.setItem('local_model', selectedModel)
      
      // Mark as cached for next time
      localStorage.setItem(`model_${selectedModel}_cached`, 'true')

      // Update LLM service
      const service = getLLMService()
      service.setProvider('local')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model')
      setIsModelLoaded(false)
    } finally {
      setIsLoadingModel(false)
    }
  }

  const handleUnloadModel = async () => {
    try {
      const engine = getWebLLMEngine()
      await engine.unloadModel()
      setIsModelLoaded(false)
      setLoadProgress(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unload model')
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    localStorage.setItem('local_model', modelId)
    
    // If a model is already loaded and it's different, show a message
    if (isModelLoaded) {
      const engine = getWebLLMEngine()
      const currentModel = engine.getCurrentModel()
      if (currentModel && currentModel !== modelId) {
        setError(null) // Clear any previous errors when user wants to switch
      }
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(0)}MB`
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`
  }

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">LLM Configuration</h2>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-800/50 p-1 rounded-lg">
        <button
          onClick={() => handleModeChange('api')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-all ${
            mode === 'api'
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          API Mode
        </button>
        <button
          onClick={() => handleModeChange('local')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-all ${
            mode === 'local'
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Local Mode
        </button>
      </div>

      {/* API Mode Configuration */}
      {mode === 'api' && (
        <div className="space-y-4">
          {isApiConfigured ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <p>API key configured</p>
              </div>
              <button
                onClick={handleApiReset}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Reset API key
              </button>
            </div>
          ) : (
            <form onSubmit={handleApiSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Your API key will be stored locally and only used for lab exercises.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors disabled:opacity-50 text-white"
              >
                {isLoading ? 'Saving...' : 'Save API Key'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Local Mode Configuration */}
      {mode === 'local' && (
        <div className="space-y-4">
          {/* WebGPU Status */}
          {webGPUSupported === false && (
            <div className="flex items-start gap-2 text-amber-400 bg-amber-900/20 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">WebGPU Not Supported</p>
                <p className="text-sm text-amber-300 mt-1">{webGPUError}</p>
                <button
                  onClick={() => handleModeChange('api')}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Switch to API Mode
                </button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 text-cyan-400 bg-cyan-900/20 p-4 rounded-lg">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium mb-1">How Local Mode Works:</p>
              <ul className="space-y-1 text-cyan-300">
                <li>• Models run entirely in your browser using WebGPU</li>
                <li>• One-time download, then cached for future use</li>
                <li>• No API key needed, data never leaves your device</li>
                <li>• Requires modern browser (Chrome/Edge 113+, Firefox 115+)</li>
                <li>• Performance depends on your GPU</li>
              </ul>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={isLoadingModel}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.size} - {model.description}
                </option>
              ))}
            </select>
            {isModelLoaded && !isAutoLoading && (() => {
              const engine = getWebLLMEngine()
              const currentModel = engine.getCurrentModel()
              return currentModel !== selectedModel ? (
                <p className="mt-2 text-xs text-amber-400">
                  ⚠️ Different model selected. Click "Switch Model" to switch.
                </p>
              ) : null
            })()}
          </div>

          {/* Model Info */}
          {selectedModel && (
            <div className="bg-gray-800/50 p-4 rounded-lg">
              {(() => {
                const modelInfo = AVAILABLE_MODELS.find((m) => m.id === selectedModel)
                if (!modelInfo) return null
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white font-medium">{modelInfo.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">VRAM Required:</span>
                      <span className="text-white font-medium">{modelInfo.vramRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white font-medium capitalize">
                        {modelInfo.category}
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Load/Switch Model Button */}
          {(!isModelLoaded || (() => {
            const engine = getWebLLMEngine()
            return engine.getCurrentModel() !== selectedModel
          })()) && !isLoadingModel && !isAutoLoading && (
            <button
              onClick={handleLoadModel}
              disabled={!webGPUSupported}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              <Download className="w-4 h-4" />
              {isModelLoaded ? 'Switch Model' : 'Download & Load Model'}
            </button>
          )}

          {/* Loading Progress */}
          {isLoadingModel && loadProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{loadProgress.text}</span>
                <span className="text-cyan-400">
                  {(loadProgress.progress * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${loadProgress.progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Time elapsed: {formatTime(loadProgress.timeElapsed)}
              </p>
            </div>
          )}

          {/* Model Loaded Status */}
          {isModelLoaded && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <p>Model loaded and ready</p>
              </div>
              <button
                onClick={handleUnloadModel}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Unload model
              </button>
            </div>
          )}

          {/* Performance Note */}
          {isModelLoaded && (
            <p className="text-xs text-gray-500 italic">
              Note: If local mode is slow, you can switch to API mode anytime using the tabs above.
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg mt-4">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Configuration Error</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
