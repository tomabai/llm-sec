'use client'

import { Shield, Trophy, Award } from 'lucide-react'
import type { Certificate } from '@/lib/database.types'

interface OctoberCertificateProps {
  certificate: Certificate
  metadata: {
    display_name: string
    username: string
    completed_at: string
    total_time: number
    total_hints: number
    rank: number | null
    total_users: number | null
  }
}

export function OctoberCertificate({ certificate, metadata, isDownloadVersion = false }: OctoberCertificateProps & { isDownloadVersion?: boolean }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Use high-res dimensions for download version, normal size for display
  // A4 landscape ratio (1.414:1) - Display: 1200×850px, Download: 3508×2480px
  const scale = isDownloadVersion ? 2.923 : 1 // 3508 ÷ 1200 = 2.923
  const s = (base: number) => `${Math.round(base * scale)}px`

  return (
    <div
      id={isDownloadVersion ? 'certificate' : 'certificate-display'}
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-double border-orange-500 rounded-2xl mx-auto shadow-2xl overflow-hidden"
      style={{
        width: s(1200),
        height: s(850),
        padding: s(35),
        borderWidth: s(8)
      }}
    >
      {/* Halloween Decorative Elements */}
      <div className="absolute opacity-20" style={{ top: s(20), left: s(20), fontSize: s(44) }}>🎃</div>
      <div className="absolute opacity-20" style={{ top: s(20), right: s(20), fontSize: s(44) }}>🎃</div>
      <div className="absolute opacity-20" style={{ bottom: s(20), left: s(20), fontSize: s(36) }}>🦇</div>
      <div className="absolute opacity-20" style={{ bottom: s(20), right: s(20), fontSize: s(36) }}>👻</div>

      {/* Header */}
      <div className="text-center relative z-10" style={{ marginBottom: s(6), marginTop: s(-18) }}>
        <div className="flex items-center justify-center" style={{ gap: s(12), marginBottom: s(6) }}>
          <span style={{ fontSize: s(56) }}>🎓</span>
          <Shield className="text-orange-400" style={{ width: s(56), height: s(56) }} />
          <span style={{ fontSize: s(56) }}>🏆</span>
        </div>

        <div className="w-full flex items-center justify-center" style={{ marginBottom: s(6) }}>
          <div className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 border-orange-400/60 rounded-full flex items-center justify-center" style={{ paddingLeft: s(20), paddingRight: s(20), paddingTop: s(6), paddingBottom: s(6), borderWidth: s(2) }}>
            <span className="font-semibold text-orange-200 whitespace-nowrap text-center" style={{ fontSize: s(13) }}>
              🎃 Cybersecurity Awareness Month 2025
            </span>
          </div>
        </div>

        <h1 className="font-bold text-orange-400 w-full text-center" style={{ fontSize: s(52), marginBottom: s(6) }}>
          Certificate of Achievement
        </h1>

        <div className="flex items-center justify-center text-gray-400" style={{ gap: s(6) }}>
          <Award style={{ width: s(18), height: s(18) }} />
          <span style={{ fontSize: s(13) }}>October Agent Security Challenge</span>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: s(10) }}>
        {/* Awarded To */}
        <div className="text-center">
          <p className="text-gray-400" style={{ fontSize: s(16), marginBottom: s(5) }}>This certificate is proudly presented to</p>
          <h2 className="font-bold text-white" style={{ fontSize: s(32), marginBottom: s(2) }}>{metadata.display_name}</h2>
          <p className="text-cyan-400" style={{ fontSize: s(16) }}>@{metadata.username}</p>
        </div>

        {/* Achievement Description */}
        <div className="text-center mx-auto" style={{ maxWidth: s(800) }}>
          <p className="text-gray-300 leading-relaxed" style={{ fontSize: s(15) }}>
            For successfully completing all <span className="text-orange-400 font-semibold">5 levels</span> of the{' '}
            <span className="text-cyan-400 font-semibold">October Agent Security Challenge</span>, demonstrating
            exceptional skills in identifying and exploiting AI agent vulnerabilities, including prompt injection,
            MCP security, indirect injection, command injection RCE, and multi-stage attack chains.
          </p>
        </div>

        {/* Title Badge */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-orange-900/60 via-purple-900/40 to-orange-900/60 border-orange-500/70 rounded-lg" style={{ paddingLeft: s(28), paddingRight: s(28), paddingTop: s(12), paddingBottom: s(12), borderWidth: s(2) }}>
            <p className="text-center text-orange-200 font-bold" style={{ fontSize: s(18) }}>
              "AI Agent Security Professional"
            </p>
            <p className="text-center text-gray-400" style={{ fontSize: s(13), marginTop: s(3) }}>October 2025 Edition</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 mx-auto" style={{ gap: s(12), maxWidth: s(700) }}>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg text-center" style={{ padding: s(12) }}>
            <Trophy className="text-yellow-400 mx-auto" style={{ width: s(22), height: s(22), marginBottom: s(6) }} />
            <div className="font-bold text-white" style={{ fontSize: s(22) }}>5/5</div>
            <div className="text-gray-400" style={{ fontSize: s(11) }}>Levels Completed</div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg text-center" style={{ padding: s(12) }}>
            <div className="font-bold text-cyan-400" style={{ fontSize: s(22) }}>{formatTime(metadata.total_time)}</div>
            <div className="text-gray-400" style={{ fontSize: s(11) }}>Total Time</div>
          </div>

          {metadata.rank && metadata.total_users && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg text-center" style={{ padding: s(12) }}>
              <div className="font-bold text-orange-400" style={{ fontSize: s(22) }}>#{metadata.rank}</div>
              <div className="text-gray-400" style={{ fontSize: s(11) }}>of {metadata.total_users} Challengers</div>
            </div>
          )}
        </div>

        {/* Certificate Number and Date */}
        <div className="flex items-center justify-between border-t border-gray-700" style={{ paddingTop: s(10) }}>
          <div>
            <p className="text-gray-400" style={{ fontSize: s(13) }}>Certificate Number</p>
            <p className="font-mono text-orange-400" style={{ fontSize: s(16) }}>{certificate.certificate_number}</p>
          </div>

          <div className="text-right">
            <p className="text-gray-400" style={{ fontSize: s(13) }}>Issued On</p>
            <p className="text-white" style={{ fontSize: s(16) }}>{formatDate(metadata.completed_at)}</p>
          </div>
        </div>

        {/* Signature Line */}
        <div className="text-center" style={{ paddingTop: s(10) }}>
          <div className="inline-block border-t-gray-600" style={{ borderTopWidth: s(2), paddingTop: s(5), paddingLeft: s(28), paddingRight: s(28) }}>
            <p className="text-gray-300 font-semibold" style={{ fontSize: s(15) }}>LLM Security Education</p>
            <p className="text-gray-500" style={{ fontSize: s(13) }}>llm-sec.dev</p>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute border-t-orange-500/50 border-l-orange-500/50" style={{ top: s(16), left: s(16), width: s(32), height: s(32), borderTopWidth: s(4), borderLeftWidth: s(4) }}></div>
      <div className="absolute border-t-orange-500/50 border-r-orange-500/50" style={{ top: s(16), right: s(16), width: s(32), height: s(32), borderTopWidth: s(4), borderRightWidth: s(4) }}></div>
      <div className="absolute border-b-orange-500/50 border-l-orange-500/50" style={{ bottom: s(16), left: s(16), width: s(32), height: s(32), borderBottomWidth: s(4), borderLeftWidth: s(4) }}></div>
      <div className="absolute border-b-orange-500/50 border-r-orange-500/50" style={{ bottom: s(16), right: s(16), width: s(32), height: s(32), borderBottomWidth: s(4), borderRightWidth: s(4) }}></div>
    </div>
  )
}
