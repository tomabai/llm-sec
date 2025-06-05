'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe, Server, Database, Code, Shield, Bot } from 'lucide-react'
import Link from 'next/link'

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

    return (
        <div className="min-h-screen bg-[#1e293b] text-white p-8">
            {/* Navigation Bar */}
            <nav className="bg-gray-900/50 border-b border-gray-800 mb-8" aria-label="Breadcrumb navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                            aria-label="Go back to threat model"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Threat Model
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold">LLM System Components</h1>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        Explore the different components of an LLM system and their associated security vulnerabilities.
                        Each component represents a potential attack surface that must be secured in production deployments.
                    </p>
                </header>

                {/* Components Grid */}
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
                                    className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-[1.02] hover:border-opacity-100 overflow-hidden h-full flex flex-col"
                                    style={{ borderColor: node.color, borderWidth: '1px', borderStyle: 'solid' }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="p-3 bg-black rounded-full border-2 group-hover:scale-110 transition-transform"
                                            style={{ borderColor: node.color }}
                                            aria-hidden="true"
                                        >
                                            {Icon && <Icon className="w-6 h-6" style={{ color: node.color }} />}
                                        </div>
                                        <h3 className="text-xl font-semibold">{node.label}</h3>
                                    </div>
                                    <p
                                        className="text-gray-300 text-sm flex-grow"
                                        id={`component-${node.id}-desc`}
                                    >
                                        {node.description}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end">
                                        <span className="text-sm" style={{ color: node.color }}>
                                            View vulnerabilities →
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        )
                    })}
                </section>
            </div>
        </div>
    )
} 