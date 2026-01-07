'use client'

import React from 'react'
import { Database } from 'lucide-react'
import Link from 'next/link'
import { LabLayout } from '@/components/LabLayout'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'

const ACCENT_COLOR = '#22c55e' // Green for Vector DB

interface VulnerabilityCardProps {
    id: string
    title: string
    description: string
    color: string
    path: string
}

export default function VectorDBPage() {
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
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <LabHeader
                        labNumber="VECTOR_DB"
                        title="Vector DB Component"
                        description="The Vector Database stores embeddings that represent text, images, and other data in a high-dimensional space, enabling semantic search and retrieval augmentation for the LLM."
                        icon={Database}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* Component Description */}
                    <TerminalSection title="Component Overview" accentColor={ACCENT_COLOR}>
                        <div className="space-y-4 text-[#8892a6]">
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
                    </TerminalSection>

                    {/* Vulnerabilities Section */}
                    <TerminalSection title="Related Vulnerabilities" accentColor={ACCENT_COLOR}>
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