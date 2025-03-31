'use client'

import React from 'react'

export default function NodesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#1e293b]">
            {children}
        </div>
    )
} 