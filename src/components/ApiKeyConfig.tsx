'use client'

import React from 'react'
import { Key, Check, AlertCircle } from 'lucide-react'

export function ApiKeyConfig() {
    const [apiKey, setApiKey] = React.useState('')
    const [isConfigured, setIsConfigured] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        // Check if API key exists in localStorage
        const storedKey = localStorage.getItem('openai_api_key')
        if (storedKey) {
            setApiKey(storedKey)
            setIsConfigured(true)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            // Validate API key format
            if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
                throw new Error('Invalid API key format')
            }

            // Store API key in localStorage
            localStorage.setItem('openai_api_key', apiKey)
            setIsConfigured(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save API key')
            setIsConfigured(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        localStorage.removeItem('openai_api_key')
        setApiKey('')
        setIsConfigured(false)
        setError(null)
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">OpenAI API Configuration</h2>
            </div>

            {isConfigured ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400">
                        <Check className="w-5 h-5" />
                        <p>API key configured</p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Reset API key
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        <p className="mt-2 text-sm text-gray-400">
                            Your API key will be stored locally and only used for lab exercises.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5 mt-0.5" />
                            <div>
                                <p className="font-medium">Configuration Error</p>
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save API Key'}
                    </button>
                </form>
            )}
        </div>
    )
} 