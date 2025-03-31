'use client'

import React from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface VulnerabilityCardProps {
    id: string
    title: string
    description: string
    color: string
    path: string
}

export default function SecurityLayerPage() {
    const router = useRouter()

    // Security Layer related vulnerabilities
    const vulnerabilities = [
        {
            id: 'LLM07',
            title: 'System Prompt Leakage',
            description: 'The system prompt leakage vulnerability in LLMs refers to the risk that the system prompts or instructions used to steer the behavior of the model can also contain sensitive information that was not intended to be discovered.',
            color: '#ef4444',
            path: '/labs/system-prompt-leakage'
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
                        <div className="p-4 bg-black rounded-full border-4 border-[#ef4444]">
                            <Shield className="w-10 h-10 text-[#ef4444]" />
                        </div>
                        <h1 className="text-4xl font-bold">Security Layer Component</h1>
                    </div>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        The Security Layer provides protective measures and controls to safeguard the
                        LLM system against various threats and vulnerabilities, including prompt injection,
                        unauthorized access, and data leakage.
                    </p>
                </div>

                {/* Component Description */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Component Overview</h2>
                    <div className="space-y-4 text-gray-300">
                        <p>
                            The Security Layer encompasses various mechanisms to protect the LLM system,
                            including input validation, sanitization, output filtering, access controls,
                            rate limiting, and monitoring. It serves as a critical barrier against
                            malicious attempts to exploit the system.
                        </p>
                        <p>
                            A key vulnerability in this component is System Prompt Leakage, where the
                            instructions and constraints designed to control the model&apos;s behavior may
                            be exposed through careful manipulation, potentially revealing sensitive
                            information or allowing attackers to bypass security controls.
                        </p>
                    </div>
                </div>

                {/* Vulnerabilities Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Related Vulnerabilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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