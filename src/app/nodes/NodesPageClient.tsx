'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Server, Database, Code, Shield, Bot, Network } from 'lucide-react'
import Link from 'next/link'
import { LabLayout } from '@/components/LabLayout'
import { TerminalSection } from '@/components/TerminalSection'

interface NodeInfo {
    id: string
    label: string
    description: string
    icon: string
    color: string
}

const iconMap = {
    Globe,
    Server,
    Database,
    Code,
    Shield,
    Bot
} as const;

interface NodesPageClientProps {
    nodesInfo: NodeInfo[]
}

export function NodesPageClient({ nodesInfo }: NodesPageClientProps) {
    const router = useRouter()
    const ACCENT_COLOR = '#00d9ff' // Cyan for system components

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="border-l-4 pl-6 py-2 bg-[#1a1f2e]/50 animate-fade-in" style={{ borderColor: ACCENT_COLOR }}>
                        <div className="flex items-center gap-3 mb-3">
                            <Network className="w-8 h-8 animate-pulse-glow" style={{ color: ACCENT_COLOR }} />
                            <h1 className="text-3xl font-display text-[#e8e9ed]">
                                <span className="font-mono" style={{ color: ACCENT_COLOR }}>[SYS]</span> LLM System Components
                            </h1>
                        </div>
                        <div className="font-mono text-xs text-[#8892a6] flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ACCENT_COLOR }}></div>
                            <span>COMPONENT_MAP ACTIVE</span>
                        </div>
                    </div>

                    <p className="text-lg text-[#8892a6] max-w-3xl leading-relaxed">
                        Explore the different components of an LLM system and their associated security vulnerabilities.
                        Each component represents a potential attack surface that must be secured in production deployments.
                    </p>

                    {/* Components Grid */}
                    <TerminalSection title="System Components" accentColor={ACCENT_COLOR}>
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-labelledby="components-heading">
                            <h2 id="components-heading" className="sr-only">System Components List</h2>
                            {nodesInfo.map(node => {
                                const Icon = iconMap[node.icon as keyof typeof iconMap]
                                return (
                                    <Link
                                        key={node.id}
                                        href={`/nodes/${node.id}`}
                                        className="block group"
                                        aria-describedby={`component-${node.id}-desc`}
                                    >
                                        <article
                                            className="bg-[#1a1f2e] border-2 rounded-lg p-6 transition-all hover:scale-[1.02] overflow-hidden h-full flex flex-col"
                                            style={{ 
                                                borderColor: `${node.color}33`,
                                                boxShadow: `0 0 20px ${node.color}1a`
                                            }}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div
                                                    className="p-3 bg-[#0a0e14] rounded-full border-2 group-hover:scale-110 transition-transform group-hover:animate-pulse-glow"
                                                    style={{ borderColor: node.color }}
                                                    aria-hidden="true"
                                                >
                                                    {Icon && <Icon className="w-6 h-6" style={{ color: node.color }} />}
                                                </div>
                                                <h3 className="text-xl font-semibold font-mono text-[#e8e9ed]">
                                                    <span className="text-[#8892a6]">[</span>
                                                    <span style={{ color: node.color }}>{node.label}</span>
                                                    <span className="text-[#8892a6]">]</span>
                                                </h3>
                                            </div>
                                            <p
                                                className="text-[#8892a6] text-sm flex-grow leading-relaxed"
                                                id={`component-${node.id}-desc`}
                                            >
                                                {node.description}
                                            </p>
                                            <div className="mt-4 pt-4 border-t flex justify-end" style={{ borderColor: `${node.color}33` }}>
                                                <span className="text-sm font-mono group-hover:translate-x-1 transition-transform inline-block" style={{ color: node.color }}>
                                                    VIEW_VULNERABILITIES <span className="text-[#8892a6]">&gt;&gt;</span>
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                )
                            })}
                        </section>
                    </TerminalSection>
                </div>
            </div>
        </LabLayout>
    )
} 