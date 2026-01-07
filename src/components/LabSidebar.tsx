'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, Lock } from 'lucide-react'
import { ALL_LABS, getLabProgress, isLabCompleted } from '@/lib/lab-progress'
import { LAB_COLORS } from '@/lib/lab-colors'

export function LabSidebar() {
  const pathname = usePathname()
  const [progress, setProgress] = React.useState(() => getLabProgress())

  React.useEffect(() => {
    const handleProgressUpdate = () => {
      setProgress(getLabProgress())
    }

    window.addEventListener('lab-progress-updated', handleProgressUpdate)
    return () => window.removeEventListener('lab-progress-updated', handleProgressUpdate)
  }, [])

  return (
    <div className="fixed left-0 top-16 w-64 bg-[#1a1f2e] border-r-2 border-b-2 border-[#00ff9f]/30 overflow-y-auto z-40 backdrop-blur-sm bg-opacity-95" style={{ bottom: '80px' }}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#00ff9f]/20">
        <div className="flex items-center gap-2 text-[#00ff9f] font-mono text-sm mb-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse"></div>
          <span>OWASP TOP 10</span>
        </div>
        <p className="text-xs text-[#8892a6] font-mono">LLM Vulnerabilities</p>
      </div>

      {/* Labs List */}
      <nav className="p-2">
        {ALL_LABS.map((lab) => {
          const completed = isLabCompleted(lab.id)
          const isActive = pathname.includes(lab.slug)
          const color = LAB_COLORS[lab.id as keyof typeof LAB_COLORS] || '#00ffff'

          return (
            <Link
              key={lab.id}
              href={`/labs/${lab.slug}`}
              className={`
                group relative block p-3 mb-1 rounded transition-all duration-200
                ${isActive 
                  ? 'bg-[#00ff9f]/10 border-l-2' 
                  : 'hover:bg-[#1a1f2e]/80 border-l-2 border-transparent hover:border-l-2'
                }
              `}
              style={{
                borderLeftColor: isActive ? color : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="font-mono text-xs font-bold"
                      style={{ color }}
                    >
                      {lab.id}
                    </span>
                    {completed && (
                      <Check className="w-3 h-3 text-[#00ff9f]" />
                    )}
                  </div>
                  <p className="text-sm text-[#e8e9ed] leading-tight line-clamp-2 group-hover:text-[#00ff9f] transition-colors">
                    {lab.title}
                  </p>
                </div>

                {/* Completion indicator */}
                {completed && (
                  <div 
                    className="w-2 h-2 rounded-full ml-2 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  ></div>
                )}
              </div>

              {/* Hover effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded pointer-events-none"
                style={{ backgroundColor: color }}
              ></div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Stats */}
      <div className="sticky bottom-0 p-4 bg-[#1a1f2e] border-t border-[#00ff9f]/20 backdrop-blur-sm">
        <div className="text-xs font-mono text-[#8892a6]">
          <div className="flex justify-between mb-1">
            <span>Completed:</span>
            <span className="text-[#00ff9f]">
              {Object.values(progress).filter(p => p.completed).length}/{ALL_LABS.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

