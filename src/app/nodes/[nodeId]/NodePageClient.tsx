'use client'

import React from 'react'
import { Globe, Server, Database, Code, Shield, Bot, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { LabLayout } from '@/components/LabLayout'
import { LabHeader } from '@/components/LabHeader'
import { TerminalSection } from '@/components/TerminalSection'

interface NodeInfo {
    id: string
    label: string
    description: string
    icon: string
    color: string
}

interface Vulnerability {
    id: string
    title: string
    description: string
    color: string
    path: string
}

interface VulnerabilityCardProps {
    id: string
    title: string
    description: string
    color: string
    path: string
}

interface NodePageClientProps {
    nodeInfo: NodeInfo
    iconName: string
    relatedVulnerabilities: Vulnerability[]
}

const iconMap: Record<string, LucideIcon> = {
    Globe,
    Server,
    Database,
    Code,
    Shield,
    Bot
}

export function NodePageClient({ nodeInfo, iconName, relatedVulnerabilities }: NodePageClientProps) {
    const IconComponent = iconMap[iconName] || Globe
    const ACCENT_COLOR = nodeInfo.color

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <LabHeader
                        labNumber={nodeInfo.id.toUpperCase()}
                        title={`${nodeInfo.label} Component`}
                        description={nodeInfo.description}
                        icon={IconComponent}
                        accentColor={ACCENT_COLOR}
                    />

                    {/* Component Description */}
                    <TerminalSection title="Component Overview" accentColor={ACCENT_COLOR}>
                        <div className="space-y-4 text-[#8892a6]">
                            <p>
                                The {nodeInfo.label} is a critical component in the LLM architecture.
                            </p>
                            <p>
                                It will usually serve as the starting point for injection attacks
                                or other experiments to exploit the model behavior.
                            </p>
                        </div>
                    </TerminalSection>

                    {/* Vulnerabilities Section */}
                    <TerminalSection title="Related Vulnerabilities" accentColor={ACCENT_COLOR}>
                        {relatedVulnerabilities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedVulnerabilities.map(vuln => (
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
                        ) : (
                            <div className="bg-[#1a1f2e] border-2 rounded-lg p-6 text-center" style={{ borderColor: `${ACCENT_COLOR}33` }}>
                                <p className="text-[#8892a6]">No specific vulnerabilities found for this component.</p>
                            </div>
                        )}
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

