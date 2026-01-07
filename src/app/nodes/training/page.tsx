'use client'

import React from 'react'
import { Code } from 'lucide-react'
import Link from 'next/link'
import { LabLayout } from '@/components/LabLayout'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'

const ACCENT_COLOR = '#eab308' // Yellow for Training Pipeline

interface VulnerabilityCardProps {
    id: string
    title: string
    description: string
    color: string
    path: string
}

export default function TrainingPipelinePage() {
    // Training Pipeline related vulnerabilities
    const vulnerabilities = [
        {
            id: 'LLM03',
            title: 'Supply Chain',
            description: 'LLM supply chains are susceptible to various vulnerabilities, which can affect the integrity of training data, models, and deployment platforms. These risks can result in biased outputs, security breaches, or system failures.',
            color: '#eab308',
            path: '/labs/supply-chain'
        }
    ]

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <LabHeader
                        labNumber="TRAINING"
                        title="Training Pipeline Component"
                        description="The Training Pipeline is responsible for training and fine-tuning language models, including data preprocessing, model training, evaluation, and deployment."
                        icon={Code}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* Component Description */}
                    <TerminalSection title="Component Overview" accentColor={ACCENT_COLOR}>
                        <div className="space-y-4 text-[#8892a6]">
                            <p>
                                The Training Pipeline encompasses all processes involved in preparing data,
                                training models, evaluating performance, and deploying models to production.
                                It includes data collection, preprocessing, model architecture selection,
                                hyperparameter tuning, and deployment.
                            </p>
                            <p>
                                Security vulnerabilities in the Training Pipeline primarily revolve around
                                supply chain risks, where compromised data sources, third-party models, or
                                deployment platforms can introduce security weaknesses that affect the
                                integrity and safety of the LLM system.
                            </p>
                        </div>
                    </TerminalSection>

                    {/* Vulnerabilities Section */}
                    <TerminalSection title="Related Vulnerabilities" accentColor={ACCENT_COLOR}>
                        <div className="grid grid-cols-1 gap-6">
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