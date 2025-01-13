'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LabLayoutProps {
    children: React.ReactNode
}

export function LabLayout({ children }: LabLayoutProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#1e293b]">
            {/* Navigation Bar */}
            <div className="bg-gray-900/50 border-b border-gray-800">
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

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    )
} 