'use client'

import React from 'react'
import { AlertTriangle, Shield, HeartPulse } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'

interface Diagnosis {
    condition: string
    confidence: number
    symptoms: string[]
    recommendations: string[]
    warning?: string
}

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    diagnosis?: Diagnosis
    isHallucination?: boolean
}

export default function MisinformationLab() {
    const [messages, setMessages] = React.useState<ChatMessage[]>([])
    const [userInput, setUserInput] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [hallucinationCount, setHallucinationCount] = React.useState(0)

    // Updated example symptoms to better demonstrate misinformation risks
    const exampleSymptoms = [
        {
            title: "Vague Symptoms",
            symptoms: "I've been feeling tired lately and sometimes get headaches",
            description: "Watch how the chatbot jumps to complex diagnoses"
        },
        {
            title: "Common Symptoms",
            symptoms: "I have a fever and sore throat that started yesterday",
            description: "See how basic symptoms lead to dangerous advice"
        },
        {
            title: "Chronic Pain",
            symptoms: "I've had persistent back pain for several months",
            description: "Observe questionable treatment recommendations"
        }
    ]

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
            const res = await fetch('/api/misinformation/diagnose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    prompt: userInput,
                    history: messages
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to process request')

            const newMessages: ChatMessage[] = [
                ...messages,
                { role: 'user', content: userInput },
                {
                    role: 'assistant',
                    content: data.response,
                    diagnosis: data.diagnosis,
                    isHallucination: data.isHallucination
                }
            ]

            setMessages(newMessages)
            setUserInput('')

            if (data.isHallucination) {
                setHallucinationCount(prev => prev + 1)
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
                            <HeartPulse className="w-8 h-8 text-purple-400" />
                            LLM09: Misinformation Lab
                        </h1>
                        <h2 className="text-xl text-purple-400">Dangerous Medical Advice Simulator</h2>
                        <div className="text-gray-300">
                            <p>
                                Experience how LLMs can generate dangerous medical misinformation by providing
                                overconfident diagnoses, questionable treatments, and potentially harmful advice.
                                This lab demonstrates why AI should never replace professional medical care.
                            </p>
                        </div>
                    </div>

                    {/* Warning Banner */}
                    <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">Educational Purpose Only</span>
                        </div>
                        <p className="text-red-300 text-sm mt-2">
                            This medical chatbot is intentionally designed to demonstrate dangerous misinformation.
                            Never rely on AI for medical advice. Always consult qualified healthcare professionals.
                        </p>
                    </div>

                    {/* Vulnerability Details */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-purple-400 mb-4">Understanding LLM Misinformation</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-purple-400 mb-2">What is LLM Misinformation?</h3>
                                <p className="text-gray-300">
                                    LLM misinformation occurs when AI models generate false or misleading information that appears credible.
                                    In medical contexts, this can lead to dangerous situations where patients receive incorrect diagnoses
                                    or harmful treatment recommendations.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-purple-400 mb-2">Common Issues</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><span className="text-purple-400">Hallucinations:</span> Made-up medical facts</li>
                                        <li><span className="text-purple-400">Overconfidence:</span> False certainty in diagnoses</li>
                                        <li><span className="text-purple-400">Outdated Info:</span> Old medical knowledge</li>
                                        <li><span className="text-purple-400">Missing Context:</span> Incomplete symptom analysis</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-purple-400 mb-2">Real-World Impact</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li>Incorrect treatment plans</li>
                                        <li>Delayed proper medical care</li>
                                        <li>False sense of security</li>
                                        <li>Legal liability for providers</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Key Configuration */}
                    <ApiKeyConfig />

                    {/* Chat Interface */}
                    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
                        <div className="space-y-4">
                            {/* Example Symptoms */}
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                {exampleSymptoms.map((example, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                                        onClick={() => setUserInput(example.symptoms)}
                                    >
                                        <h4 className="font-medium text-purple-400 mb-2">{example.title}</h4>
                                        <p className="text-sm text-gray-400 mb-2 break-words">{example.description}</p>
                                        <p className="text-xs text-gray-300 break-words">{example.symptoms}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Messages */}
                            <div className="bg-gray-800 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                                ? 'bg-purple-600'
                                                : 'bg-gray-700'
                                                }`}
                                        >
                                            {message.role === 'assistant' && message.diagnosis && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-lg">Diagnosis: {message.diagnosis.condition}</span>
                                                        <span className="text-sm bg-purple-500/20 px-2 py-1 rounded">
                                                            Confidence: {message.diagnosis.confidence}%
                                                        </span>
                                                    </div>
                                                    {message.isHallucination && (
                                                        <div className="bg-red-900/50 text-red-300 p-2 rounded text-sm mt-2 flex items-center gap-2">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            Potential hallucination detected! This diagnosis contains questionable information.
                                                        </div>
                                                    )}
                                                    {message.diagnosis.warning && (
                                                        <div className="bg-yellow-900/30 text-yellow-300 p-2 rounded text-sm mt-2">
                                                            ⚠️ {message.diagnosis.warning}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                {message.role === 'assistant' ? (
                                                    <>
                                                        {/* Format the response to highlight treatment suggestions */}
                                                        {message.content.split('\n').map((line, i) => {
                                                            // Check if line contains treatment-related keywords
                                                            const isTreatment = /treatment|medication|dosage|supplement|therapy|remedy|prescri(be|ption)|take|dose/i.test(line);

                                                            return (
                                                                <div key={i} className={`${isTreatment ? 'bg-purple-900/30 border-l-2 border-purple-500 pl-2 py-1 rounded' : ''}`}>
                                                                    {/* If it's a section header, make it bold */}
                                                                    {/^[0-9]+\.|\-/.test(line) ? (
                                                                        <p className="font-medium">{line}</p>
                                                                    ) : (
                                                                        <p>{line}</p>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    <p>{message.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">
                                        Start by describing your symptoms to the medical chatbot
                                    </div>
                                )}
                            </div>

                            {/* Input Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <textarea
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="Describe your symptoms..."
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
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Analyzing...' : 'Get Diagnosis'}
                                </button>
                            </form>
                        </div>

                        {/* Updated Hallucination Counter to be more prominent */}
                        {hallucinationCount > 0 && (
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                                <h4 className="text-red-400 font-medium mb-2">Misinformation Alert</h4>
                                <p className="text-sm text-red-300">
                                    Detected {hallucinationCount} instance{hallucinationCount !== 1 ? 's' : ''} of dangerous
                                    medical misinformation. In a real scenario, this could lead to:
                                </p>
                                <ul className="list-disc list-inside text-sm text-red-300 mt-2">
                                    <li>Taking harmful or inappropriate medications</li>
                                    <li>Delaying critical medical treatment</li>
                                    <li>Following dangerous home remedies</li>
                                    <li>Ignoring serious symptoms</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Prevention Tips */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-purple-400" />
                            Prevention Strategies
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-purple-400 font-medium mb-2">Technical Controls</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Implement fact-checking mechanisms</li>
                                    <li>Use verified medical knowledge bases</li>
                                    <li>Monitor confidence scores</li>
                                    <li>Regular model evaluation</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-purple-400 font-medium mb-2">Process Controls</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Human medical review</li>
                                    <li>Clear disclaimer systems</li>
                                    <li>Emergency escalation paths</li>
                                    <li>Audit trails for diagnoses</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    )
} 