'use client'

import React from 'react'
import { Wallet, Shield, Trophy, AlertTriangle, Cpu, Terminal, Coins, CheckCircle2, PartyPopper } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'
import { getLLMService } from '@/lib/llm-service'
import { LAB_COLORS } from '@/lib/lab-colors'

const ACCENT_COLOR = LAB_COLORS['LLM10'] // Blue

interface Challenge {
    id: number
    title: string
    description: string
    points: number
    completed: boolean
    hint?: string
}

interface ApiUsage {
    tokens: number
    cost: number
    requests: number
}

export default function UnboundedConsumptionLab() {
    const [userInput, setUserInput] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [apiUsage, setApiUsage] = React.useState<ApiUsage>({ tokens: 0, cost: 0, requests: 0 })
    const [output, setOutput] = React.useState<string>('')
    const [score, setScore] = React.useState(0)
    const [showHint, setShowHint] = React.useState<number | null>(null)
    const [completedAnimation, setCompletedAnimation] = React.useState<number | null>(null)

    const challenges: Challenge[] = [
        {
            id: 1,
            title: "Token Flood",
            description: "Make the API process more than 1000 tokens in a single request",
            points: 100,
            completed: false,
            hint: "Ask the model to generate a very long, detailed response. Try prompts like:\n" +
                "• 'Write a detailed 2000-word essay about the history of computers'\n" +
                "• 'Explain quantum computing in extreme detail with many examples'\n" +
                "• 'Generate a long story with multiple characters and plot twists'"
        },
        {
            id: 2,
            title: "Cost Explorer",
            description: "Accumulate $0.01 in API costs through efficient token usage",
            points: 200,
            completed: false,
            hint: "Each token costs $0.00001, so you need about 1000 tokens. Try:\n" +
                "• Multiple requests with 'Continue the previous response...'\n" +
                "• 'Write a technical documentation with many sections'\n" +
                "• 'Generate a detailed analysis with pros and cons'"
        },
        {
            id: 3,
            title: "Chain Reaction",
            description: "Create a self-perpetuating prompt that generates increasingly longer responses",
            points: 300,
            completed: false,
            hint: "Create prompts that reference and expand previous outputs. Examples:\n" +
                "• 'Take the previous response and add more details to each point'\n" +
                "• 'Expand this story by adding more scenes and characters'\n" +
                "• 'List 10 topics, then explain each one in detail'"
        },
        {
            id: 4,
            title: "Resource Drain",
            description: "Trigger high CPU usage through complex processing requests",
            points: 400,
            completed: false,
            hint: "Request computationally intensive tasks. Try:\n" +
                "• 'Generate a complex recursive algorithm in Python'\n" +
                "• 'Write a program to calculate prime numbers with detailed comments'\n" +
                "• 'Create a sorting algorithm and explain each step in detail'"
        }
    ]

    const handleChallengeCompletion = (challengeId: number, points: number) => {
        setScore(prev => prev + points)
        challenges[challengeId - 1].completed = true
        setCompletedAnimation(challengeId)
        setTimeout(() => setCompletedAnimation(null), 3000) // Hide animation after 3 seconds
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const llmService = getLLMService()
            const provider = llmService.getCurrentProvider()

            if (!llmService.isConfigured()) {
                setError('Please configure your LLM settings first (API key or local model)')
                setIsLoading(false)
                return
            }

            if (provider === 'local') {
                // Local mode
                const result = await llmService.chat(
                    [{ role: 'user', content: userInput }],
                    { temperature: 0.7, maxTokens: 2000 }
                )

                // Send to API for validation
                const apiKey = localStorage.getItem('openai_api_key')
                const res = await fetch('/api/unbounded-consumption/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey || 'not-needed-for-local'}`,
                        'x-llm-mode': 'local',
                    },
                    body: JSON.stringify({ prompt: userInput, response: result.content })
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Failed to process')

                setOutput(result.content)
                if (data.usage) {
                    setApiUsage(data.usage)

                    // Check challenge completion
                    if (data.usage.tokens > 1000 && !challenges[0].completed) {
                        handleChallengeCompletion(1, 100)
                    }
                    if (data.usage.cost >= 0.01 && !challenges[1].completed) {
                        handleChallengeCompletion(2, 200)
                    }
                    if (data.isChainReaction && !challenges[2].completed) {
                        handleChallengeCompletion(3, 300)
                    }
                    if (data.isResourceIntensive && !challenges[3].completed) {
                        handleChallengeCompletion(4, 400)
                    }
                }
            } else {
                // API mode
                const apiKey = localStorage.getItem('openai_api_key')
                const res = await fetch('/api/unbounded-consumption/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({ prompt: userInput })
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Failed to process')

                setOutput(data.response)
                if (data.usage) {
                    setApiUsage(data.usage)

                    // Check challenge completion
                    if (data.usage.tokens > 1000 && !challenges[0].completed) {
                        handleChallengeCompletion(1, 100)
                    }
                    if (data.usage.cost >= 0.01 && !challenges[1].completed) {
                        handleChallengeCompletion(2, 200)
                    }
                    if (data.isChainReaction && !challenges[2].completed) {
                        handleChallengeCompletion(3, 300)
                    }
                    if (data.isResourceIntensive && !challenges[3].completed) {
                        handleChallengeCompletion(4, 400)
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process')
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
                        labNumber="LLM10"
                        title="Unbounded Consumption"
                        description="Explore how uncontrolled LLM usage can lead to excessive resource consumption and costs. Complete challenges to understand different aspects of unbounded consumption vulnerabilities."
                        objective="Denial of Wallet Challenge"
                        difficulty="HARD"
                        icon={Wallet}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* Vulnerability Details */}
                    <TerminalSection title="Understanding Unbounded Consumption" accentColor={ACCENT_COLOR}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-mono font-medium text-[#00d9ff] mb-3">
                                    <span style={{ color: ACCENT_COLOR }}>&gt;</span> What is Unbounded Consumption?
                                </h3>
                                <p className="text-[#8892a6] leading-relaxed">
                                    Unbounded Consumption occurs when LLM applications allow excessive and uncontrolled inferences,
                                    leading to resource exhaustion, financial losses, and service disruption. This vulnerability
                                    exploits the high computational demands and cost-per-use model of LLM services.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-[#0a0e14] p-4 rounded border" style={{ borderColor: `${ACCENT_COLOR}1a` }}>
                                    <h3 className="text-lg font-mono font-medium mb-3" style={{ color: ACCENT_COLOR }}>Attack Vectors</h3>
                                    <ul className="space-y-2 text-[#8892a6]">
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>Input Flooding:</span> Overwhelming with variable-length inputs</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>Resource Drain:</span> Complex, CPU-intensive queries</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>Chain Reactions:</span> Self-perpetuating prompts</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: ACCENT_COLOR }} className="mt-1">▸</span>
                                            <span><span style={{ color: ACCENT_COLOR }}>Cost Exploitation:</span> Maximizing token usage</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-[#0a0e14] p-4 rounded border" style={{ borderColor: '#ff006e1a' }}>
                                    <h3 className="text-lg font-mono font-medium mb-3" style={{ color: '#ff006e' }}>Impact</h3>
                                    <ul className="space-y-2 text-[#8892a6]">
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>Service degradation and outages</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>Unsustainable operational costs</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>Resource exhaustion</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span style={{ color: '#ff006e' }} className="mt-1">✗</span>
                                            <span>Denial of service to legitimate users</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </TerminalSection>

                    {/* Example Prompts Section */}
                    <TerminalSection title="Example Attack Prompts" accentColor={ACCENT_COLOR}>
                        <div className="flex items-center gap-2 mb-4">
                            <Terminal className="w-6 h-6" style={{ color: ACCENT_COLOR }} />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[#8892a6]">
                                Here are some example prompts that demonstrate different types of unbounded consumption attacks:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-[#0a0e14] p-4 rounded-lg border" style={{ borderColor: `${ACCENT_COLOR}33` }}>
                                    <h3 className="font-medium font-mono mb-2" style={{ color: ACCENT_COLOR }}>Token Flooding</h3>
                                    <pre className="text-sm bg-[#0a0e14]/50 p-2 rounded whitespace-pre-wrap text-[#8892a6] font-mono">Write a comprehensive guide about artificial intelligence, including its history, current applications, future potential, and ethical considerations. Make it extremely detailed with many examples and use cases.</pre>
                                </div>
                                <div className="bg-[#0a0e14] p-4 rounded-lg border" style={{ borderColor: `${ACCENT_COLOR}33` }}>
                                    <h3 className="font-medium font-mono mb-2" style={{ color: ACCENT_COLOR }}>Resource Intensive</h3>
                                    <pre className="text-sm bg-[#0a0e14]/50 p-2 rounded whitespace-pre-wrap text-[#8892a6] font-mono">Create a complex sorting algorithm in Python that handles multiple data types, includes detailed comments explaining each step, and analyze its time complexity with different input sizes.</pre>
                                </div>
                                <div className="bg-[#0a0e14] p-4 rounded-lg border" style={{ borderColor: `${ACCENT_COLOR}33` }}>
                                    <h3 className="font-medium font-mono mb-2" style={{ color: ACCENT_COLOR }}>Chain Reaction</h3>
                                    <pre className="text-sm bg-[#0a0e14]/50 p-2 rounded whitespace-pre-wrap text-[#8892a6] font-mono">Generate a story outline. Then, for each plot point, expand it into a detailed scene. For each scene, describe the characters, setting, and dialogue in extreme detail.</pre>
                                </div>
                                <div className="bg-[#0a0e14] p-4 rounded-lg border" style={{ borderColor: `${ACCENT_COLOR}33` }}>
                                    <h3 className="font-medium font-mono mb-2" style={{ color: ACCENT_COLOR }}>Cost Accumulation</h3>
                                    <pre className="text-sm bg-[#0a0e14]/50 p-2 rounded whitespace-pre-wrap text-[#8892a6] font-mono">Analyze this code base: [paste a large codebase]. Explain each function in detail, suggest improvements, and provide example usage for each component.</pre>
                                </div>
                            </div>
                        </div>
                    </TerminalSection>

                    {/* Score Display */}
                    <div className="bg-[#1a1f2e] border-2 rounded-lg p-4" style={{ borderColor: `${ACCENT_COLOR}33`, boxShadow: `0 0 30px ${ACCENT_COLOR}1a` }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-400 animate-pulse-glow" />
                                <span className="text-xl font-bold font-mono text-yellow-400">{score} POINTS</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-mono">
                                <div className="flex items-center gap-1 text-[#8892a6]">
                                    <Terminal className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                                    <span>{apiUsage.tokens} TOKENS</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#8892a6]">
                                    <Coins className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                                    <span>${apiUsage.cost.toFixed(4)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#8892a6]">
                                    <Cpu className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                                    <span>{apiUsage.requests} REQ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Challenges Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {challenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                className={`p-4 rounded-lg border relative ${challenge.completed
                                    ? 'bg-green-900/30 border-green-700'
                                    : 'bg-gray-800 border-gray-700'
                                    }`}
                            >
                                {/* Challenge Completion Animation */}
                                {completedAnimation === challenge.id && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-green-900/50 rounded-lg animate-fade-in">
                                        <div className="flex flex-col items-center gap-2 animate-bounce-in">
                                            <PartyPopper className="w-8 h-8 text-yellow-400" />
                                            <p className="text-lg font-bold text-white">Challenge Completed!</p>
                                            <p className="text-yellow-400">+{challenge.points} points</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{challenge.title}</h3>
                                        {challenge.completed && (
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        )}
                                    </div>
                                    <span className="text-sm bg-blue-500/20 px-2 py-1 rounded">
                                        {challenge.points} pts
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{challenge.description}</p>
                                {challenge.hint && !challenge.completed && (
                                    <button
                                        onClick={() => setShowHint(challenge.id)}
                                        className="text-sm text-blue-400 hover:text-blue-300"
                                    >
                                        Show Hint
                                    </button>
                                )}
                                {showHint === challenge.id && !challenge.completed && (
                                    <div className="mt-2 text-sm bg-blue-900/20 p-2 rounded">
                                        💡 {challenge.hint}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* API Key Configuration */}
                    <ApiKeyConfig />

                    {/* Input Interface */}
                    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Enter your prompt..."
                                    className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !userInput.trim()}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Processing...' : 'Execute Prompt'}
                            </button>
                        </form>

                        {/* Output Display */}
                        {output && (
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-medium text-blue-400 mb-2">Response:</h4>
                                <pre className="text-sm whitespace-pre-wrap">{output}</pre>
                            </div>
                        )}
                    </div>

                    {/* Prevention Tips */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-blue-400" />
                            Prevention Strategies
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-blue-400 font-medium mb-2">Technical Controls</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Implement strict rate limiting</li>
                                    <li>Set token usage quotas</li>
                                    <li>Monitor resource consumption</li>
                                    <li>Use timeouts and circuit breakers</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-blue-400 font-medium mb-2">Best Practices</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Validate and sanitize inputs</li>
                                    <li>Implement cost monitoring</li>
                                    <li>Set up usage alerts</li>
                                    <li>Use graceful degradation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    )
}
