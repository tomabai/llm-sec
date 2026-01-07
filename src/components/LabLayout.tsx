'use client'

import React from 'react'
import { ArrowLeft, Terminal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ModeBadge } from './ModeBadge'
import { LabSidebar } from './LabSidebar'
import { LabProgressBar } from './LabProgressBar'

interface LabLayoutProps {
    children: React.ReactNode
}

export function LabLayout({ children }: LabLayoutProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#0a0e14] bg-noise scanline-effect vignette">
            {/* Terminal-style Navigation Bar - Fixed */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e] border-b-2 border-r-2 border-l-2 border-[#00ff9f]/30 shadow-[0_4px_20px_rgba(0,255,159,0.1)] backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Terminal window decorations */}
                        <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff006e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbe0b]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#00ff9f]"></div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 font-mono text-sm text-[#8892a6]">
                            <Terminal className="w-4 h-4 text-[#00ff9f]" />
                            <span className="text-[#00ff9f]">lab@llm-sec</span>
                            <span>:</span>
                            <span className="text-[#00d9ff]">~</span>
                            <span>$</span>
                        </div>

                        {/* Progress Bar */}
                        <LabProgressBar />

                        <ModeBadge />
                    </div>

                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-[#8892a6] hover:text-[#00ff9f] transition-all duration-300 font-mono text-sm px-4 py-2 rounded border border-[#00ff9f]/20 hover:border-[#00ff9f]/60 hover:shadow-[0_0_15px_rgba(0,255,159,0.3)]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">cd ..</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <LabSidebar />

            {/* Spacer for fixed nav */}
            <div className="h-16"></div>

            {/* Main Content with left margin for sidebar */}
            <main className="relative ml-64">
                {children}
            </main>
        </div>
    )
} 