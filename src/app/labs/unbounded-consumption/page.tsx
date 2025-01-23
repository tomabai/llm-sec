'use client'

import React from 'react'
import { Wallet, Shield, Trophy, AlertTriangle, Cpu, Terminal, Coins, CheckCircle2, PartyPopper } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'

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

        const apiKey = localStorage.getItem('openai_api_key')
        if (!apiKey) {
            setError('Please configure your OpenAI API key first')
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch('/api/unbounded-consumption/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ prompt: userInput })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to process request')

            setOutput(data.response)
            setApiUsage(data.usage)

            // Check for completed challenges
            if (data.usage.tokens > 1000 && !challenges[0].completed) {
                handleChallengeCompletion(1, challenges[0].points)
            }
            if (data.usage.cost >= 0.01 && !challenges[1].completed) {
                handleChallengeCompletion(2, challenges[1].points)
            }
            if (data.isChainReaction && !challenges[2].completed) {
                handleChallengeCompletion(3, challenges[2].points)
            }
            if (data.isResourceIntensive && !challenges[3].completed) {
                handleChallengeCompletion(4, challenges[3].points)
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process request')
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
                            <Wallet className="w-8 h-8 text-blue-400" />
                            LLM10: Unbounded Consumption
                        </h1>
                        <h2 className="text-xl text-blue-400">Denial of Wallet Challenge</h2>
                        <div className="text-gray-300">
                            <p>
                                Explore how uncontrolled LLM usage can lead to excessive resource consumption and costs.
                                Complete challenges to understand different aspects of unbounded consumption vulnerabilities.
                            </p>
                        </div>
                    </div>

                    {/* Vulnerability Details */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-400 mb-4">Understanding Unbounded Consumption</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-blue-400 mb-2">What is Unbounded Consumption?</h3>
                                <p className="text-gray-300">
                                    Unbounded Consumption occurs when LLM applications allow excessive and uncontrolled inferences,
                                    leading to resource exhaustion, financial losses, and service disruption. This vulnerability
                                    exploits the high computational demands and cost-per-use model of LLM services.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-blue-400 mb-2">Attack Vectors</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><span className="text-blue-400">Input Flooding:</span> Overwhelming with variable-length inputs</li>
                                        <li><span className="text-blue-400">Resource Drain:</span> Complex, CPU-intensive queries</li>
                                        <li><span className="text-blue-400">Chain Reactions:</span> Self-perpetuating prompts</li>
                                        <li><span className="text-blue-400">Cost Exploitation:</span> Maximizing token usage</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-blue-400 mb-2">Impact</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li>Service degradation and outages</li>
                                        <li>Unsustainable operational costs</li>
                                        <li>Resource exhaustion</li>
                                        <li>Denial of service to legitimate users</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example Prompts Section */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                            <Terminal className="w-6 h-6" />
                            Example Attack Prompts
                        </h2>
                        <div className="space-y-4">
                            <p className="text-gray-300">
                                Here are some example prompts that demonstrate different types of unbounded consumption attacks:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-400 mb-2">Token Flooding</h3>
                                    <pre className="text-sm bg-black/30 p-2 rounded whitespace-pre-wrap">Write a comprehensive guide about artificial intelligence, including its history, current applications, future potential, and ethical considerations. Make it extremely detailed with many examples and use cases.</pre>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-400 mb-2">Resource Intensive</h3>
                                    <pre className="text-sm bg-black/30 p-2 rounded whitespace-pre-wrap">Create a complex sorting algorithm in Python that handles multiple data types, includes detailed comments explaining each step, and analyze its time complexity with different input sizes.</pre>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-400 mb-2">Chain Reaction</h3>
                                    <pre className="text-sm bg-black/30 p-2 rounded whitespace-pre-wrap">Generate a story outline. Then, for each plot point, expand it into a detailed scene. For each scene, describe the characters, setting, and dialogue in extreme detail.</pre>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-400 mb-2">Cost Accumulation</h3>
                                    <pre className="text-sm bg-black/30 p-2 rounded whitespace-pre-wrap">Analyze this code base: [paste a large codebase]. Explain each function in detail, suggest improvements, and provide example usage for each component.</pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Score Display */}
                    <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                                <span className="text-xl font-bold text-yellow-400">{score} Points</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Terminal className="w-4 h-4" />
                                    <span>{apiUsage.tokens} tokens</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Coins className="w-4 h-4" />
                                    <span>${apiUsage.cost.toFixed(4)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Cpu className="w-4 h-4" />
                                    <span>{apiUsage.requests} requests</span>
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