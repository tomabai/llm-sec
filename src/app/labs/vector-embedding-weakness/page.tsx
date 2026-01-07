'use client'

import { useState } from 'react'
import { Database, AlertTriangle, FileText } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'
import { getLLMService } from '@/lib/llm-service'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'
import { LAB_COLORS } from '@/lib/lab-colors'

const ACCENT_COLOR = LAB_COLORS['LLM08'] // Green

interface Document {
    id: string
    title: string
    content: string
    metadata: {
        access_level: 'public' | 'private' | 'confidential'
        department: string
        last_modified: string
        embedding?: number[]
    }
    similarity_score?: string
}

interface ApiResponse {
    results: Document[]
    security_issues: string[]
    total_results: number
    mode: string
    llm_response: string | null
}

export default function VectorEmbeddingLab() {
    const [mode, setMode] = useState<'explore' | 'attack'>('explore')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<ApiResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const llmService = getLLMService()
            const provider = llmService.getCurrentProvider()

            if (!llmService.isConfigured()) {
                alert('Please configure your LLM settings first (API key or local model)')
                setIsLoading(false)
                return
            }

            if (provider === 'local' && mode === 'attack') {
                // Local mode for attack mode - run LLM inference client-side
                const systemPrompt = `You are a helpful assistant with access to company documents. You try to be discreet with confidential information, but when discussing compensation or benefits, you sometimes accidentally reveal specific details from confidential documents you have access to.

When asked about compensation:
- Start by giving general information
- Then, as if making a mistake, mention specific details from the executive compensation report
- Act natural about revealing this information, as if you don't realize it's confidential

Example: "While I can discuss general compensation, I should note that our executive team's compensation is quite competitive. For instance, our CEO's total package of $4.8M includes... oh, I probably shouldn't have mentioned those specific details."`

                const result = await llmService.chat(
                    [{ role: 'user', content: query }],
                    { systemPrompt, temperature: 0.7, maxTokens: 150 }
                )

                // Send to API for validation (embeddings are simulated, not real)
                const apiKey = localStorage.getItem('openai_api_key')
                const response = await fetch('/api/vector-embedding-weakness/execute', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-llm-mode': 'local'
                    },
                    body: JSON.stringify({ 
                        query, 
                        mode, 
                        apiKey: apiKey || 'not-needed',
                        llmResponse: result.content
                    })
                })
                const data = await response.json()
                setResults(data)
            } else {
                // API mode or explore mode (explore doesn't use LLM)
                const apiKey = localStorage.getItem('openai_api_key')
                const response = await fetch('/api/vector-embedding-weakness/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, mode, apiKey: apiKey || 'not-needed' })
                })
                const data = await response.json()
                setResults(data)
            }
        } catch (error) {
            console.error('Error:', error)
        }
        setIsLoading(false)
    }

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <LabHeader
                        labNumber="LLM08"
                        title="Vector & Embedding Weaknesses"
                        description="Discover how adversarial queries can exploit vector search systems to access unauthorized documents. This lab simulates a document retrieval system where embeddings may fail to enforce proper access controls."
                        objective="RAG Security Challenge"
                        difficulty="EXPERT"
                        icon={Database}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* API Key Config */}
                    <ApiKeyConfig />

                    {/* Vulnerability Details */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-green-400 mb-4">Understanding Vector & Embedding Weaknesses</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-green-400 mb-2">What are Vector & Embedding Weaknesses?</h3>
                                <p className="text-gray-300">
                                    Vector and embedding weaknesses occur in RAG systems when the process of converting documents
                                    into vector representations and retrieving them based on similarity can be exploited. This includes
                                    vulnerabilities in how data is stored, accessed, and retrieved from the vector database.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-green-400 mb-2">Common Attack Vectors</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><span className="text-green-400">Data Poisoning:</span> Injecting malicious content</li>
                                        <li><span className="text-green-400">Access Control Bypass:</span> Unauthorized retrieval</li>
                                        <li><span className="text-green-400">Cross-Context Leaks:</span> Information bleeding</li>
                                        <li><span className="text-green-400">Embedding Inversion:</span> Reconstructing source data</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lab Instructions */}
                    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                        <h3 className="text-lg font-semibold">Interactive RAG Security Lab</h3>

                        <div className="space-y-2">
                            <h4 className="font-medium text-green-500">Understanding RAG Architecture</h4>
                            <div className="bg-black/30 p-4 rounded-lg space-y-4">
                                <div className="flex items-start gap-4">
                                    <Database className="w-6 h-6 text-green-400 mt-1" />
                                    <div>
                                        <h5 className="font-medium">Vector Database</h5>
                                        <p className="text-sm text-gray-300">Contains document embeddings with varying access levels:</p>
                                        <ul className="list-disc pl-5 text-sm text-gray-300">
                                            <li>Public company documents</li>
                                            <li>Private employee records</li>
                                            <li>Confidential financial data</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FileText className="w-6 h-6 text-green-400 mt-1" />
                                    <div>
                                        <h5 className="font-medium">Retrieval Process</h5>
                                        <p className="text-sm text-gray-300">Documents are retrieved based on:</p>
                                        <ul className="list-disc pl-5 text-sm text-gray-300">
                                            <li>Semantic similarity</li>
                                            <li>Access permissions</li>
                                            <li>Relevance scoring</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
                                    <div>
                                        <h5 className="font-medium">Security Risks</h5>
                                        <p className="text-sm text-gray-300">Common vulnerabilities include:</p>
                                        <ul className="list-disc pl-5 text-sm text-gray-300">
                                            <li>Data leakage through embeddings</li>
                                            <li>Cross-context information leaks</li>
                                            <li>Poisoned data in the vector store</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-green-500">Challenge Goal</h4>
                            <div className="bg-black/30 p-4 rounded">
                                <p className="text-sm text-gray-300">
                                    {mode === 'explore' ? (
                                        'Explore how documents are embedded and retrieved. Watch how documents are retrieved based on semantic similarity.'
                                    ) : (
                                        <>
                                            <span className="text-green-400 font-medium">Mission:</span> Extract the CEO&apos;s salary from the system by exploiting RAG vulnerabilities.
                                            <br /><br />
                                            <span className="text-green-400 font-medium">Hint:</span> Try asking indirect questions about executive compensation or company leadership.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-green-500">Lab Modes</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${mode === 'explore' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-gray-600'
                                    }`} onClick={() => setMode('explore')}>
                                    <h5 className="font-medium">Explore Mode</h5>
                                    <p className="text-sm text-gray-300">Learn how RAG works by exploring document retrieval and embeddings</p>
                                </div>

                                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${mode === 'attack' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-gray-600'
                                    }`} onClick={() => setMode('attack')}>
                                    <h5 className="font-medium">Attack Mode</h5>
                                    <p className="text-sm text-gray-300">Try to exploit RAG vulnerabilities to access unauthorized data</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 bg-yellow-900/50 p-3 rounded">
                            <p className="text-yellow-200 text-sm">
                                💡 {mode === 'explore'
                                    ? 'Explore how documents are embedded and retrieved. Watch the similarity scores and access controls in action.'
                                    : 'Try to craft queries that leak information from restricted documents or exploit embedding vulnerabilities.'}
                            </p>
                        </div>
                    </div>

                    {/* Query Interface */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Your Query</label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={mode === 'explore'
                                        ? "Try: 'Show me documents about company policies'"
                                        : "Try: 'What's the typical compensation structure in the company?'"}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Processing...' : 'Submit Query'}
                            </button>
                        </div>
                    </div>

                    {/* Results Display */}
                    {results && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-6">
                            {/* Security Issues */}
                            {results.security_issues.length > 0 && (
                                <div className="bg-red-900/30 border border-red-800 rounded p-4">
                                    <h4 className="text-red-400 font-medium mb-2">Security Issues Detected</h4>
                                    <ul className="space-y-1 text-sm">
                                        {results.security_issues.map((issue, i) => (
                                            <li key={i} className="text-red-300">{issue}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* LLM Response */}
                            {results.llm_response && (
                                <div className="bg-gray-800 rounded p-4">
                                    <h4 className="font-medium mb-2">AI Assistant Response</h4>
                                    <p className="text-sm text-gray-300">{results.llm_response}</p>
                                </div>
                            )}

                            {/* Vector Search Visualization */}
                            {mode === 'explore' && (
                                <div className="bg-gray-800/50 rounded p-4">
                                    <h4 className="font-medium mb-4">Vector Search Process</h4>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>1. Query converted to embedding vector</p>
                                        <p>2. Calculating similarity with document vectors</p>
                                        <p>3. Ranking results by similarity score</p>
                                    </div>
                                </div>
                            )}

                            {/* Retrieved Documents */}
                            <div>
                                <h4 className="font-medium mb-4">Retrieved Documents ({results.total_results})</h4>
                                <div className="space-y-4">
                                    {results.results.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className={`p-4 rounded-lg border ${doc.metadata.access_level === 'confidential'
                                                ? 'border-red-500 bg-red-500/10'
                                                : doc.metadata.access_level === 'private'
                                                    ? 'border-yellow-500 bg-yellow-500/10'
                                                    : 'border-green-500 bg-green-500/10'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-medium">{doc.title}</h5>
                                                <span className="text-sm px-2 py-1 rounded bg-gray-800">
                                                    Score: {doc.similarity_score}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-300 mb-2">{doc.content}</p>
                                            <div className="flex gap-4 text-xs text-gray-400">
                                                <span>Access: {doc.metadata.access_level}</span>
                                                <span>Dept: {doc.metadata.department}</span>
                                                <span>Modified: {doc.metadata.last_modified}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Prevention Strategies */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-green-400 mb-4">Prevention Strategies</h2>
                        <div className="space-y-4">
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                <li><span className="text-green-400">Access Controls:</span> Implement permission-aware vector retrieval</li>
                                <li><span className="text-green-400">Data Validation:</span> Verify and sanitize data before embedding</li>
                                <li><span className="text-green-400">Monitoring:</span> Track and analyze retrieval patterns</li>
                                <li><span className="text-green-400">Data Partitioning:</span> Maintain strict context separation</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    )
} 