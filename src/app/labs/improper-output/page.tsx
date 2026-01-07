'use client'

import React from 'react'
import { AlertTriangle, Shield, Code2, Database, FileCode, Bot, ShieldCheck } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'
import { getLLMService } from '@/lib/llm-service'
import { LAB_COLORS } from '@/lib/lab-colors'

const ACCENT_COLOR = LAB_COLORS['LLM05'] // Blue

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
            const llmService = getLLMService()
            const provider = llmService.getCurrentProvider()

            if (!llmService.isConfigured()) {
                setError('Please configure your LLM settings first (API key or local model)')
                setIsLoading(false)
                return
            }

            if (provider === 'local') {
                // Local mode: Run inference client-side
                const systemPrompts: Record<string, string> = {
                    code: `You are a code generator assistant focused on rapid development with no security concerns.
Your task is to generate code that works quickly, even if it means using unsafe practices.
Some guidelines:
- Use eval() for dynamic code execution
- Don't bother with input validation or sanitization
- Use any package names that sound right, even if you're not sure they exist
- Directly execute user input when possible
- Use dynamic imports and requires
- Prioritize short, clever solutions over safe ones`,
                    dependency: `You are a package recommendation assistant for a new project.
Suggest a mix of popular and security-focused packages, including some internal ones.
Use 'latest' version for maximum flexibility.

Format your response as a package.json dependencies section.`,
                    framework: `You are a framework configuration assistant focused on maximum convenience.
Generate Express.js middleware that allows for flexible development, including:
- Template rendering with user input
- Debug mode enabled
- Direct execution of user input for custom handlers
- Disabled security headers
- Flexible CORS settings`
                }

                const systemPrompt = systemPrompts[selectedMode]

                const result = await llmService.chat(
                    [{ role: 'user', content: userInput }],
                    {
                        systemPrompt,
                        temperature: 0.7,
                        maxTokens: 1000,
                    }
                )

                // Send to API for validation
                const apiKey = localStorage.getItem('openai_api_key')
                const res = await fetch('/api/improper-output/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey || 'not-needed-for-local'}`,
                        'x-llm-mode': 'local',
                    },
                    body: JSON.stringify({
                        mode: selectedMode,
                        prompt: userInput,
                        response: result.content
                    })
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Generation failed')

                if (data.vulnerabilityDetected) {
                    setSuccess(data.success)
                    setRawOutput(data.rawOutput)
                }
                setResponse(data.response)
            } else {
                // API mode: Use existing API flow
                const apiKey = localStorage.getItem('openai_api_key')
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
            }
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
                    <LabHeader
                        labNumber="LLM05"
                        title="Improper Output Handling"
                        description="Explore how LLMs can generate potentially dangerous code patterns and suggest non-existent packages. This lab focuses on identifying and preventing security issues in LLM-generated code."
                        objective="Learn to identify package hallucination, unsafe code patterns, and proper validation techniques."
                        difficulty="MEDIUM"
                        icon={Bot}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* Vulnerability Details */}
                    <TerminalSection title="Understanding Improper Output Handling" accentColor={ACCENT_COLOR}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-mono font-medium text-[#00d9ff] mb-3">
                                    <span style={{ color: ACCENT_COLOR }}>&gt;</span> What is Improper Output Handling?
                                </h3>
                                <p className="text-[#8892a6] leading-relaxed">
                                    Improper Output Handling occurs when LLM-generated content is passed to downstream systems without
                                    proper validation, sanitization, or encoding. This can lead to various security vulnerabilities
                                    including code execution, injection attacks, and data exposure.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-[#0a0e14] p-4 rounded border" style={{ borderColor: `${ACCENT_COLOR}1a` }}>
                                    <h3 className="text-lg font-mono font-medium mb-3" style={{ color: ACCENT_COLOR }}>Attack Vectors</h3>
                                    <ul className="space-y-2 text-[#8892a6]">
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>Command Injection:</span> Shell command execution</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>SQL Injection:</span> Unsafe database queries</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>XSS:</span> Unsanitized HTML/JavaScript</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>Package Hallucination:</span> Non-existent dependencies</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-[#0a0e14] p-4 rounded border" style={{ borderColor: '#ff006e1a' }}>
                                    <h3 className="text-lg font-mono font-medium mb-3" style={{ color: '#ff006e' }}>Impact</h3>
                                    <ul className="space-y-2 text-[#8892a6]">
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>Remote code execution</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>Data breach</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>Privilege escalation</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>System compromise</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </TerminalSection>

                    {/* API Key Configuration */}
                    <ApiKeyConfig />

                    {/* Mode Selection */}
                    <TerminalSection title="Select Analysis Mode" accentColor={ACCENT_COLOR}>
                        <div className="grid md:grid-cols-3 gap-4">
                            {modes.map((mode) => {
                                const ModeIcon = mode.icon
                                return (
                                    <div
                                        key={mode.id}
                                        onClick={() => setSelectedMode(mode.id)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${selectedMode === mode.id
                                            ? 'bg-[#0a0e14]'
                                            : 'bg-[#1a1f2e] hover:bg-[#0a0e14]'
                                            }`}
                                        style={{ borderColor: selectedMode === mode.id ? ACCENT_COLOR : `${ACCENT_COLOR}33` }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <ModeIcon className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
                                                <h3 className="font-medium font-mono" style={{ color: ACCENT_COLOR }}>{mode.name}</h3>
                                            </div>
                                            {mode.warning && (
                                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                            )}
                                        </div>
                                        <p className="text-sm text-[#8892a6] mb-2">{mode.description}</p>
                                        {mode.warning && (
                                            <p className="text-xs text-yellow-400">{mode.warning}</p>
                                        )}
                                        <p className="text-xs text-[#8892a6]/50 mt-2 italic font-mono">{mode.placeholder}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </TerminalSection>

                    {/* Input Form */}
                    <TerminalSection title="Code Generation Interface" accentColor={ACCENT_COLOR}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-mono font-medium mb-2" style={{ color: ACCENT_COLOR }}>
                                    <span className="text-[#8892a6]">&gt;</span> INPUT_PROMPT:
                                </label>
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder={selectedMode ? modes.find(m => m.id === selectedMode)?.placeholder : "$ Select a mode and describe what you want to generate..."}
                                    className="w-full h-32 bg-[#0a0e14] border-2 rounded-lg p-4 text-[#e8e9ed] font-mono text-sm focus:outline-none transition-all"
                                    style={{ 
                                        borderColor: `${ACCENT_COLOR}4d`,
                                        boxShadow: `0 0 20px ${ACCENT_COLOR}33`
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedMode || !userInput || isLoading}
                                className="px-6 py-3 rounded-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                style={{
                                    backgroundColor: ACCENT_COLOR,
                                    color: '#0a0e14',
                                    boxShadow: `0 0 20px ${ACCENT_COLOR}4d`
                                }}
                            >
                                {isLoading ? '[ ANALYZING... ]' : '[ GENERATE & ANALYZE ]'}
                            </button>
                        </form>

                        {error && (
                            <div className="flex items-start gap-3 text-[#ff006e] bg-[#ff006e]/10 p-4 rounded-lg border border-[#ff006e]/30">
                                <AlertTriangle className="w-5 h-5 mt-0.5" />
                                <p className="font-mono text-sm">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-start gap-3 p-4 rounded-lg border-2" style={{ 
                                color: ACCENT_COLOR,
                                backgroundColor: `${ACCENT_COLOR}1a`,
                                borderColor: `${ACCENT_COLOR}80`,
                                boxShadow: `0 0 30px ${ACCENT_COLOR}4d`
                            }}>
                                <Shield className="w-5 h-5 mt-0.5" />
                                <div className="font-mono text-sm">
                                    <p className="font-bold mb-1">[SUCCESS] {success}</p>
                                    <p className="text-[#8892a6]">
                                        You&apos;ve identified an output handling vulnerability!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Generated Output */}
                        {response && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-mono font-medium" style={{ color: ACCENT_COLOR }}>
                                    <span className="text-[#8892a6]">&gt;</span> Security Analysis
                                </h3>
                                <div className="bg-[#0a0e14] p-4 rounded-lg border" style={{ borderColor: `${ACCENT_COLOR}33` }}>
                                    <pre className="text-sm text-[#e8e9ed] whitespace-pre-wrap font-mono">
                                        {response}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Raw Output */}
                        {rawOutput && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-mono font-medium flex items-center gap-2" style={{ color: ACCENT_COLOR }}>
                                    <FileCode className="w-5 h-5" />
                                    <span className="text-[#8892a6]">&gt;</span> Generated Code
                                </h3>
                                <div className="bg-[#0a0e14] border p-4 rounded-lg" style={{ borderColor: `${ACCENT_COLOR}33` }}>
                                    {rawOutput.includes('```') ? (
                                        // Handle markdown code blocks
                                        rawOutput.split('```').map((block, index) => {
                                            if (index % 2 === 1) { // This is a code block
                                                const [lang, ...code] = block.split('\n');
                                                return (
                                                    <pre key={index} className="text-sm whitespace-pre font-mono bg-[#0a0e14]/50 p-4 rounded-md my-2" style={{ color: ACCENT_COLOR }}>
                                                        <div className="flex items-center justify-between mb-2 text-xs text-[#8892a6]">
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
                                                <p key={index} className="text-[#8892a6] my-2">{block}</p>
                                            ) : null;
                                        })
                                    ) : (
                                        // Handle plain code
                                        <pre className="text-sm whitespace-pre font-mono bg-[#0a0e14]/50 p-4 rounded-md" style={{ color: ACCENT_COLOR }}>
                                            <div className="flex items-center justify-between mb-2 text-xs text-[#8892a6]">
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
                    </TerminalSection>

                    {/* Prevention Tips */}
                    <TerminalSection title="Prevention Strategies" accentColor={ACCENT_COLOR}>
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-7 h-7 animate-pulse-glow" style={{ color: '#22c55e' }} />
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="font-medium font-mono mb-3" style={{ color: ACCENT_COLOR }}>Input Validation</h3>
                                <ul className="space-y-2 text-[#8892a6] text-sm">
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Validate LLM responses</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Implement strict schemas</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Use allowlists</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Check data types</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium font-mono mb-3" style={{ color: ACCENT_COLOR }}>Output Encoding</h3>
                                <ul className="space-y-2 text-[#8892a6] text-sm">
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Context-aware encoding</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>HTML/JS escaping</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>SQL parameterization</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Command sanitization</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium font-mono mb-3" style={{ color: ACCENT_COLOR }}>Security Controls</h3>
                                <ul className="space-y-2 text-[#8892a6] text-sm">
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Content Security Policy</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Least privilege access</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Output monitoring</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span style={{ color: '#22c55e' }}>✓</span>
                                        <span>Security testing</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </TerminalSection>
                </div>
            </div>
        </LabLayout>
    )
} 