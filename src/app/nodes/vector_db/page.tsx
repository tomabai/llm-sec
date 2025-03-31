'use client'

import React from 'react'
import { Database, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface VulnerabilityCardProps {
    id: string
    title: string
    description: string
    color: string
    path: string
}

export default function VectorDBPage() {
    const router = useRouter()

    // Vector DB related vulnerabilities
    const vulnerabilities = [
        {
            id: 'LLM04',
            title: 'Data and Model Poisoning',
            description: 'Data poisoning occurs when pre-training, fine-tuning, or embedding data is manipulated to introduce vulnerabilities, backdoors, or biases.',
            color: '#22c55e',
            path: '/labs/data-poisoning'
        },
        {
            id: 'LLM08',
            title: 'Vector and Embedding Weaknesses',
            description: 'Weaknesses in how vectors and embeddings are generated, stored, or retrieved can be exploited by malicious actions (intentional or unintentional) to inject harmful content, manipulate model outputs, or access sensitive information.',
            color: '#22c55e',
            path: '/labs/vector-embedding-weakness'
        }
    ]

    return (
        <div className="min-h-screen bg-[#1e293b] text-white p-8">
            {/* Navigation Bar */}
            <div className="bg-gray-900/50 border-b border-gray-800 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Threat Model
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-black rounded-full border-4 border-[#22c55e]">
                            <Database className="w-10 h-10 text-[#22c55e]" />
                        </div>
                        <h1 className="text-4xl font-bold">Vector DB Component</h1>
                    </div>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        The Vector Database stores embeddings that represent text, images, and other data in a
                        high-dimensional space, enabling semantic search and retrieval augmentation for the LLM.
                    </p>
                </div>

                {/* Component Description */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Component Overview</h2>
                    <div className="space-y-4 text-gray-300">
                        <p>
                            The Vector Database is a critical component for Retrieval Augmented Generation (RAG)
                            applications, storing vector representations of data that can be efficiently queried
                            to provide relevant context to the LLM.
                        </p>
                        <p>
                            Security issues in the Vector DB component can lead to data poisoning attacks and
                            exploitation of weaknesses in how embeddings are generated, stored, or retrieved.
                            These vulnerabilities can result in manipulated model outputs or unauthorized access
                            to sensitive information.
                        </p>
                    </div>
                </div>

                {/* Vulnerabilities Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Related Vulnerabilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {vulnerabilities.map(vuln => (
                            <VulnerabilityCard
                                key={vuln.id}
                                id={vuln.id}
                                title={vuln.title}
                                description={vuln.description}
                                color={vuln.color}
                                path={vuln.path}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function VulnerabilityCard({ id, title, description, color, path }: VulnerabilityCardProps) {
    return (
        <Link href={path}>
            <div
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
            >
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="text-sm font-bold px-2 py-1 rounded"
                            style={{ backgroundColor: `${color}30`, color }}
                        >
                            {id}
                        </div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3">{description}</p>
                </div>
                <div className="px-6 py-3 bg-black/20 border-t border-gray-800">
                    <div className="text-sm flex justify-between items-center">
                        <span className="text-gray-400">Go to lab</span>
                        <span style={{ color }}>→</span>
                    </div>
                </div>
            </div>
        </Link>
    )
} 