'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe, Server, Database, Code, Shield, Bot } from 'lucide-react'
import Link from 'next/link'

// Define the node info type
interface NodeInfo {
    id: string
    label: string
    description: string
    icon: React.ElementType
    color: string
}

// Node information
const nodesInfo: NodeInfo[] = [
    {
        id: 'client',
        label: 'Client/Malicious Actor',
        description: 'The client or malicious actor who interacts with the LLM system, potentially attempting to exploit vulnerabilities.',
        icon: Globe,
        color: '#00ffff'
    },
    {
        id: 'inference',
        label: 'Ingress',
        description: 'The entry point for user inputs to the LLM system, handling queries before processing.',
        icon: Bot,
        color: '#3b82f6'
    },
    {
        id: 'llm_service',
        label: 'LLM Service',
        description: 'The core language model service that processes inputs and generates responses.',
        icon: Server,
        color: '#ff00ff'
    },
    {
        id: 'vector_db',
        label: 'Vector DB',
        description: 'Database storing vector embeddings used by the LLM for retrieval-augmented generation.',
        icon: Database,
        color: '#22c55e'
    },
    {
        id: 'training',
        label: 'Training Pipeline',
        description: 'The pipeline responsible for training and fine-tuning the language model.',
        icon: Code,
        color: '#eab308'
    },
    {
        id: 'security',
        label: 'Security Layer',
        description: 'The security mechanisms that protect the LLM system from various threats.',
        icon: Shield,
        color: '#ef4444'
    }
];

export default function NodesPage() {
    const router = useRouter()

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
                    <h1 className="text-4xl font-bold">LLM Components</h1>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        Explore the different components of an LLM system and their associated security vulnerabilities.
                    </p>
                </div>

                {/* Components Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nodesInfo.map(node => {
                        const Icon = node.icon
                        return (
                            <Link
                                key={node.id}
                                href={`/nodes/${node.id}`}
                                className="block group"
                            >
                                <div
                                    className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-[1.02] hover:border-opacity-100 overflow-hidden h-full flex flex-col"
                                    style={{ borderColor: node.color, borderWidth: '1px', borderStyle: 'solid' }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="p-3 bg-black rounded-full border-2 group-hover:scale-110 transition-transform"
                                            style={{ borderColor: node.color }}
                                        >
                                            {Icon && <Icon className="w-6 h-6" style={{ color: node.color }} />}
                                        </div>
                                        <h2 className="text-xl font-semibold">{node.label}</h2>
                                    </div>
                                    <p className="text-gray-300 text-sm flex-grow">{node.description}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end">
                                        <span className="text-sm" style={{ color: node.color }}>
                                            View vulnerabilities →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
} 