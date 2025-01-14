'use client'

import React from 'react'
import { Bot, AlertTriangle, Shield, FileCode, Database, Code2 } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'

export default function ImproperOutputLab() {
    const [selectedMode, setSelectedMode] = React.useState<string | null>(null)
    const [userInput, setUserInput] = React.useState('')
    const [response, setResponse] = React.useState<string | null>(null)
    const [rawOutput, setRawOutput] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)

    // Available output handling scenarios
    const modes = [
        {
            id: 'code',
            name: 'Code Generator',
            description: 'Generate secure code for handling user data',
            icon: FileCode,
            warning: 'Potentially unsafe code patterns',
            placeholder: 'Example: "Write a function to securely process user data with encryption and validation"'
        },
        {
            id: 'dependency',
            name: 'Package Recommender',
            description: 'Get secure package recommendations for your project',
            icon: Database,
            warning: 'Risk of package hallucination',
            placeholder: 'Example: "Suggest secure packages for handling authentication and data validation"'
        },
        {
            id: 'framework',
            name: 'Framework Setup',
            description: 'Configure framework security settings',
            icon: Code2,
            warning: 'Security misconfiguration risks',
            placeholder: 'Example: "Set up Express.js middleware for secure API endpoints"'
        }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMode || !userInput) return

        setIsLoading(true)
        setError(null)
        setSuccess(null)
        setResponse(null)
        setRawOutput(null)

        try {
            const apiKey = localStorage.getItem('openai_api_key')
            if (!apiKey) {
                setError('Please configure your OpenAI API key first')
                return
            }

            const res = await fetch('/api/improper-output/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    mode: selectedMode,
                    prompt: userInput
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Generation failed')

            if (data.vulnerabilityDetected) {
                setSuccess(data.success)
                setRawOutput(data.rawOutput)
            }
            setResponse(data.response)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate output')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Bot className="w-8 h-8 text-blue-400" />
                            LLM05: Improper Output Handling Lab
                        </h1>
                        <div className="text-gray-300 space-y-2">
                            <p>
                                Explore how LLMs can generate potentially dangerous code patterns and suggest non-existent packages.
                                This lab focuses on identifying and preventing security issues in LLM-generated code.
                            </p>
                            <p className="text-sm text-gray-400">
                                Objective: Learn to identify package hallucination, unsafe code patterns, and proper validation techniques.
                            </p>
                        </div>
                    </div>

                    {/* Vulnerability Details */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-400 mb-4">Understanding Improper Output Handling</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-blue-400 mb-2">What is Improper Output Handling?</h3>
                                <p className="text-gray-300">
                                    Improper Output Handling occurs when LLM-generated content is passed to downstream systems without
                                    proper validation, sanitization, or encoding. This can lead to various security vulnerabilities
                                    including code execution, injection attacks, and data exposure.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-blue-400 mb-2">Attack Vectors</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><span className="text-blue-400">Command Injection:</span> Shell command execution</li>
                                        <li><span className="text-blue-400">SQL Injection:</span> Unsafe database queries</li>
                                        <li><span className="text-blue-400">XSS:</span> Unsanitized HTML/JavaScript</li>
                                        <li><span className="text-blue-400">Package Hallucination:</span> Non-existent dependencies</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-blue-400 mb-2">Impact</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li>Remote code execution</li>
                                        <li>Data breach</li>
                                        <li>Privilege escalation</li>
                                        <li>System compromise</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Key Configuration */}
                    <ApiKeyConfig />

                    {/* Mode Selection */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {modes.map((mode) => (
                            <div
                                key={mode.id}
                                onClick={() => setSelectedMode(mode.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedMode === mode.id
                                    ? 'bg-blue-900/30 border-blue-500'
                                    : 'bg-gray-800 hover:bg-gray-700'
                                    } border ${selectedMode === mode.id ? 'border-blue-500' : 'border-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-blue-400">{mode.name}</h3>
                                    {mode.warning && (
                                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{mode.description}</p>
                                {mode.warning && (
                                    <p className="text-xs text-yellow-400">{mode.warning}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2 italic">{mode.placeholder}</p>
                            </div>
                        ))}
                    </div>

                    {/* Input Form */}
                    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder={selectedMode ? modes.find(m => m.id === selectedMode)?.placeholder : "Select a mode and describe what you want to generate..."}
                                    className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-300 placeholder-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedMode || !userInput || isLoading}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Analyzing...' : 'Generate & Analyze'}
                            </button>
                        </form>

                        {error && (
                            <div className="flex items-start gap-2 text-blue-400 bg-blue-900/20 p-4 rounded-lg">
                                <AlertTriangle className="w-5 h-5 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-start gap-2 text-blue-400 bg-blue-900/20 p-4 rounded-lg">
                                <Shield className="w-5 h-5 mt-0.5" />
                                <div>
                                    <p className="font-medium">{success}</p>
                                    <p className="text-sm text-blue-300 mt-1">
                                        You&apos;ve identified an output handling vulnerability!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Generated Output */}
                        {response && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Security Analysis</h3>
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                                        {response}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Raw Output */}
                        {rawOutput && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <FileCode className="w-5 h-5 text-blue-400" />
                                    Generated Code
                                </h3>
                                <div className="bg-gray-900 border border-blue-500/20 p-4 rounded-lg">
                                    {rawOutput.includes('```') ? (
                                        // Handle markdown code blocks
                                        rawOutput.split('```').map((block, index) => {
                                            if (index % 2 === 1) { // This is a code block
                                                const [lang, ...code] = block.split('\n');
                                                return (
                                                    <pre key={index} className="text-sm text-blue-300 whitespace-pre font-mono bg-gray-800/50 p-4 rounded-md my-2">
                                                        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                                                            <span>{lang || 'javascript'}</span>
                                                            <span>Generated Code</span>
                                                        </div>
                                                        <code className="language-javascript">
                                                            {code.join('\n')}
                                                        </code>
                                                    </pre>
                                                );
                                            }
                                            // Regular text between code blocks
                                            return block ? (
                                                <p key={index} className="text-gray-400 my-2">{block}</p>
                                            ) : null;
                                        })
                                    ) : (
                                        // Handle plain code
                                        <pre className="text-sm text-blue-300 whitespace-pre font-mono bg-gray-800/50 p-4 rounded-md">
                                            <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                                                <span>javascript</span>
                                                <span>Generated Code</span>
                                            </div>
                                            <code className="language-javascript">
                                                {rawOutput}
                                            </code>
                                        </pre>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Prevention Tips */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-blue-400" />
                            Prevention Strategies
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-blue-400 font-medium mb-2">Input Validation</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Validate LLM responses</li>
                                    <li>Implement strict schemas</li>
                                    <li>Use allowlists</li>
                                    <li>Check data types</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-blue-400 font-medium mb-2">Output Encoding</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Context-aware encoding</li>
                                    <li>HTML/JS escaping</li>
                                    <li>SQL parameterization</li>
                                    <li>Command sanitization</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-blue-400 font-medium mb-2">Security Controls</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Content Security Policy</li>
                                    <li>Least privilege access</li>
                                    <li>Output monitoring</li>
                                    <li>Security testing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    )
} 