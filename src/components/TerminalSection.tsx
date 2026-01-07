'use client'

import React from 'react'

interface TerminalSectionProps {
  title: string
  children: React.ReactNode
  accentColor: string
  className?: string
}

export function TerminalSection({ title, children, accentColor, className = '' }: TerminalSectionProps) {
  return (
    <div 
      className={`bg-[#1a1f2e] border-2 rounded-lg p-6 ${className}`}
      style={{ 
        borderColor: `${accentColor}33`, // 20% opacity
        boxShadow: `0 0 30px ${accentColor}1a` // 10% opacity
      }}
    >
      <h2 className="text-xl font-display mb-4 flex items-center gap-2" style={{ color: accentColor }}>
        <span className="text-[#8892a6]">[</span>
        {title}
        <span className="text-[#8892a6]">]</span>
      </h2>
      {children}
    </div>
  )
}

