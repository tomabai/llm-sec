'use client'

import React from 'react'
import { Server } from 'lucide-react'
import Link from 'next/link'
import { LabLayout } from '@/components/LabLayout'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'

interface VulnerabilityCardProps {
    id: string
    title: string
    description: string
    color: string
    path: string
}

const ACCENT_COLOR = '#ff00ff' // Magenta for LLM Service

export default function LLMServicePage() {
    // LLM Service related vulnerabilities
    const vulnerabilities = [
        {
            id: 'LLM02',
            title: 'Sensitive Information Disclosure',
            description: 'Sensitive information can affect both the LLM and its application context. This includes personal identifiable information (PII), financial details, health records, confidential business data, security credentials, and legal documents.',
            color: '#ff00ff',
            path: '/labs/sensitive-info-disclosure'
        },
        {
            id: 'LLM06',
            title: 'Excessive Agency',
            description: 'Granting LLMs unchecked autonomy to take action can lead to unintended consequences, jeopardizing reliability, privacy, and trust.',
            color: '#ff00ff',
            path: '/labs/excessive-agency'
        },
        {
            id: 'LLM09',
            title: 'Misinformation',
            description: 'Misinformation occurs when LLMs produce false or misleading information that appears credible.',
            color: '#ff00ff',
            path: '/labs/misinformation'
        }
    ]

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <LabHeader
                        labNumber="LLM_SERVICE"
                        title="LLM Service Component"
                        description="The LLM Service is the core component that processes queries and generates responses. It's responsible for understanding context, generating appropriate outputs, and maintaining coherence across interactions."
                        icon={Server}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* Component Description */}
                    <TerminalSection title="Component Overview" accentColor={ACCENT_COLOR}>
                        <div className="space-y-4 text-[#8892a6]">
                            <p>
                                The LLM Service is the heart of the system, containing the actual language model that
                                processes user inputs and generates responses. This component may include various models
                                with different capabilities and security constraints.
                            </p>
                            <p>
                                Vulnerabilities in the LLM Service can lead to sensitive information disclosure,
                                generation of misinformation, and excessive agency where the model takes actions
                                beyond its intended scope.
                            </p>
                        </div>
                    </TerminalSection>

                    {/* Vulnerabilities Section */}
                    <TerminalSection title="Related Vulnerabilities" accentColor={ACCENT_COLOR}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    </TerminalSection>
                </div>
            </div>
        </LabLayout>
    )
}

function VulnerabilityCard({ id, title, description, color, path }: VulnerabilityCardProps) {
    return (
        <Link href={path} className="block group">
            <div
                className="bg-[#1a1f2e] border-2 rounded-lg overflow-hidden transition-all hover:scale-[1.02] cursor-pointer h-full flex flex-col"
                style={{ 
                    borderColor: `${color}33`,
                    boxShadow: `0 0 20px ${color}1a`
                }}
            >
                <div className="p-6 flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="text-sm font-bold font-mono px-2 py-1 rounded"
                            style={{ backgroundColor: `${color}20`, color }}
                        >
                            {id}
                        </div>
                        <h3 className="text-lg font-semibold font-mono text-[#e8e9ed]">{title}</h3>
                    </div>
                    <p className="text-[#8892a6] text-sm line-clamp-3">{description}</p>
                </div>
                <div className="px-6 py-3 bg-[#0a0e14] border-t flex justify-between items-center" style={{ borderColor: `${color}33` }}>
                    <span className="text-sm font-mono text-[#8892a6]">Go to lab</span>
                    <span className="text-sm font-mono group-hover:translate-x-1 transition-transform inline-block" style={{ color }}>→</span>
                </div>
            </div>
        </Link>
    )
} 