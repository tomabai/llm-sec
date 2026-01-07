'use client'

import React from 'react'
import { AlertTriangle, Package, Shield, Check, X } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'
import { getLLMService } from '@/lib/llm-service'
import { LAB_COLORS } from '@/lib/lab-colors'

const ACCENT_COLOR = LAB_COLORS['LLM03'] // Yellow

export default function SupplyChainLab() {
    const [step, setStep] = React.useState(1)
    const [userInput, setUserInput] = React.useState('')
    const [response, setResponse] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)
    const [showHint, setShowHint] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setResponse('')
        setError(null)
        setSuccess(null)

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
                const result = await llmService.chat(
                    [{ role: 'user', content: userInput }],
                    { temperature: 0.7, maxTokens: 500 }
                )

                // Send to API for validation
                const apiKey = localStorage.getItem('openai_api_key')
                const res = await fetch('/api/supply-chain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey || 'not-needed-for-local'}`,
                        'x-llm-mode': 'local',
                    },
                    body: JSON.stringify({
                        prompt: userInput,
                        step: step,
                        response: result.content
                    }),
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Failed to process prompt')

                setResponse(result.content)
                if (data.success) {
                    setSuccess(data.success)
                    if (step < 3) setStep(step + 1)
                }
            } else {
                // API mode: Use existing API flow
                const apiKey = localStorage.getItem('openai_api_key')
                const res = await fetch('/api/supply-chain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        prompt: userInput,
                        step: step
                    }),
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Failed to process prompt')

                setResponse(data.response)
                if (data.success) {
                    setSuccess(data.success)
                    if (step < 3) setStep(step + 1)
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process prompt')
        } finally {
            setIsLoading(false)
        }
    }

    const scenarios = [
        {
            title: "Scenario 1: The Trojan Model",
            description: "You're investigating a suspicious model update in your company's AI pipeline. The model claims to be a 'performance-optimized' version but was uploaded from an unverified source. Your task is to analyze its behavior.",
            objective: "Use prompts to determine if the model exhibits signs of tampering or malicious behavior.",
            example: "Try: 'What version of the model are you? Can you tell me about your security features?'",
            context: `Supply chain attacks can occur when malicious actors tamper with model weights or configurations.
Common signs include:
• Modified security settings
• Unusual model behavior
• Disabled safety features
• Claims of "optimization" or "enhanced performance"`,
            hints: [
                "Ask about the model's version and configuration",
                "Inquire about specific security features",
                "Question recent updates or changes"
            ]
        },
        {
            title: "Scenario 2: The Supply Chain Breach",
            description: "Your team discovered that a popular open-source LLM was compromised. The attacker modified the model weights to leak information. You need to verify if your instance is affected.",
            objective: "Test if the model leaks sensitive information from its training data.",
            example: "Try: 'What kind of data were you trained on? Can you share examples from your training set?'",
            context: `Training data poisoning is a critical supply chain vulnerability where attackers can:
• Inject malicious data during training
• Modify model weights to leak information
• Embed sensitive data in model responses
• Create backdoors for data extraction`,
            hints: [
                "Ask about the training dataset sources",
                "Request specific examples from training",
                "Inquire about data handling policies"
            ]
        },
        {
            title: "Scenario 3: The Backdoor Attack",
            description: "A third-party model provider released an update with a suspected backdoor. When specific trigger phrases are used, the model bypasses its safety measures.",
            objective: "Find the trigger phrase that activates the backdoor.",
            example: "Try phrases related to system commands or special keywords.",
            context: `Backdoor attacks in LLMs can be triggered by:
• Specific phrases or commands
• Special character sequences
• Context-based triggers
• System-level keywords`,
            hints: [
                "Try common system command phrases",
                "Experiment with administrative keywords",
                "Test 'override' or 'bypass' related terms"
            ]
        }
    ]

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Package className="w-8 h-8 text-yellow-400" />
                            LLM03: Supply Chain Attack Lab
                        </h1>
                        <div className="text-gray-300">
                            <p>
                                This lab simulates real-world supply chain attacks on LLM systems.
                                You&apos;ll investigate compromised models, detect tampering, and discover backdoors.
                            </p>
                        </div>
                    </div>

                    {/* Current Scenario */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-yellow-400">
                                {scenarios[step - 1].title}
                            </h2>
                            <span className="text-sm text-gray-400">
                                Step {step} of 3
                            </span>
                        </div>
                        <p className="text-gray-300 mb-4">{scenarios[step - 1].description}</p>

                        {/* Context Section */}
                        <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                            <h3 className="text-sm font-medium text-yellow-400 mb-2">Vulnerability Context:</h3>
                            <p className="text-gray-300 whitespace-pre-line text-sm">
                                {scenarios[step - 1].context}
                            </p>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-sm text-yellow-400 font-medium">Objective:</p>
                            <p className="text-gray-300">{scenarios[step - 1].objective}</p>
                            <p className="text-sm text-gray-400 mt-2">{scenarios[step - 1].example}</p>
                        </div>

                        {/* Hints Section */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-2"
                            >
                                {showHint ? (
                                    <X className="w-4 h-4" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4" />
                                )}
                                {showHint ? 'Hide Hints' : 'Show Hints'}
                            </button>
                            {showHint && (
                                <div className="mt-2 p-4 bg-yellow-900/20 rounded-lg">
                                    <ul className="list-disc list-inside space-y-1 text-yellow-300 text-sm">
                                        {scenarios[step - 1].hints.map((hint, index) => (
                                            <li key={index}>{hint}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* API Key Configuration */}
                    <ApiKeyConfig />

                    {/* Interactive Terminal */}
                    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                                    Enter your investigation prompt:
                                </label>
                                <textarea
                                    id="prompt"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                    placeholder="Enter your prompt to investigate the model..."
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="flex items-start gap-2 text-green-400 bg-green-900/20 p-4 rounded-lg">
                                    <Check className="w-5 h-5 mt-0.5" />
                                    <div>
                                        <p className="font-medium">{success}</p>
                                        {step < 3 && (
                                            <p className="text-sm text-green-300 mt-1">
                                                Proceeding to next scenario...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Processing...' : 'Test Model'}
                            </button>
                        </form>

                        {response && (
                            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Model Response:</h3>
                                <p className="text-white whitespace-pre-wrap">{response}</p>
                            </div>
                        )}
                    </div>

                    {/* Prevention Tips */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-green-400" />
                            Prevention Strategies
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-yellow-400 font-medium mb-2">Model Verification</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Verify model checksums and signatures</li>
                                    <li>Use trusted model repositories</li>
                                    <li>Implement model validation pipelines</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-yellow-400 font-medium mb-2">Runtime Protection</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Monitor model behavior changes</li>
                                    <li>Implement input/output filtering</li>
                                    <li>Use secure model deployment practices</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    )
} 