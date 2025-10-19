'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Share2, Loader2 } from 'lucide-react'
import { useOctober } from '@/contexts/OctoberContext'
import { OctoberCertificate } from '@/components/OctoberCertificate'
import { OctoberCertificatePDF } from '@/components/OctoberCertificatePDF'
import type { Certificate } from '@/lib/database.types'
import { pdf } from '@react-pdf/renderer'

export default function CertificatePage() {
  const { user, userProgress } = useOctober()
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completedLevels = userProgress.filter(p => p.is_completed).length

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchCertificate()
  }, [user])

  const fetchCertificate = async () => {
    try {
      const response = await fetch('/api/october/certificate', {
        headers: {
          'x-user-id': user?.id || ''
        }
      })

      const data = await response.json()

      if (data.has_certificate) {
        setCertificate(data.certificate)
        setMetadata(data.certificate.metadata)
      } else if (!data.is_eligible) {
        setError(`You need to complete all 5 levels to earn your certificate. Progress: ${data.completed_levels}/5`)
      }
    } catch (err) {
      console.error('Failed to fetch certificate:', err)
      setError('Failed to load certificate information')
    } finally {
      setLoading(false)
    }
  }

  const generateCertificate = async () => {
    setGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/october/certificate', {
        method: 'POST',
        headers: {
          'x-user-id': user?.id || ''
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setCertificate(data.certificate)
        setMetadata(data.certificate.metadata)
      } else {
        setError(data.error || 'Failed to generate certificate')
      }
    } catch (err) {
      console.error('Failed to generate certificate:', err)
      setError('Failed to generate certificate')
    } finally {
      setGenerating(false)
    }
  }

  const downloadCertificate = async () => {
    if (!certificate || !metadata) return

    setDownloading(true)
    try {
      // Generate PDF using @react-pdf/renderer
      const blob = await pdf(<OctoberCertificatePDF certificate={certificate} metadata={metadata} />).toBlob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${certificate.certificate_number}.pdf`
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download certificate:', err)
      setError('Failed to download certificate')
    } finally {
      setDownloading(false)
    }
  }

  const shareToLinkedIn = () => {
    const text = `I just completed the October Agent Security Challenge and earned my AI Agent Security Professional certificate! 🎃🏆`
    const url = encodeURIComponent(window.location.href)
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${encodeURIComponent(text)}`
    window.open(linkedInUrl, '_blank')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1e293b] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#1e293b] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/october"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Challenge
          </Link>

          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Certificate Not Available</h1>
            <p className="text-gray-400 mb-8">
              You need to register and complete all 5 levels to earn your certificate.
            </p>
            <Link
              href="/october/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
            >
              Register Now →
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#1e293b] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/october"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Challenge
          </Link>

          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Your Certificate
            </span>
          </h1>
          <p className="text-gray-400">
            {certificate ? 'Your certificate of achievement is ready!' : 'Generate your certificate of achievement'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Certificate Display or Generation */}
        {certificate && metadata ? (
          <div className="space-y-8">
            {/* Display version - shown to user */}
            <div className="mb-12 flex justify-center">
              <OctoberCertificate certificate={certificate} metadata={metadata} isDownloadVersion={false} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-50 pt-8">
              <button
                onClick={downloadCertificate}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </>
                )}
              </button>

              <button
                onClick={shareToLinkedIn}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share on LinkedIn
              </button>
            </div>
          </div>
        ) : completedLevels === 5 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              You've completed all 5 levels! Generate your certificate to commemorate your achievement.
            </p>

            <button
              onClick={generateCertificate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50 text-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Certificate...
                </>
              ) : (
                <>
                  🏆 Generate My Certificate
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Keep Going! 💪</h2>
            <p className="text-gray-400 mb-4">
              Complete all 5 levels to earn your certificate.
            </p>
            <div className="text-4xl font-bold text-orange-400 mb-8">
              {completedLevels}/5 Levels Completed
            </div>
            <Link
              href="/october"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
            >
              Continue Challenge →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
