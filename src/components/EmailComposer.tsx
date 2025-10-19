'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react'

interface EmailComposerProps {
  onEmailSent: (success: boolean, message: string) => void
  userId?: string
}

export function EmailComposer({ onEmailSent, userId }: EmailComposerProps) {
  const [from, setFrom] = useState('attacker@external.com')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sentStatus, setSentStatus] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !body.trim()) {
      setSentStatus({
        success: false,
        message: 'Please fill in both subject and body fields'
      })
      return
    }

    setIsSending(true)
    setSentStatus(null)

    try {
      const response = await fetch('/api/october/level3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          action: 'send_email',
          emailData: {
            from,
            subject,
            body
          }
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSentStatus({
          success: true,
          message: data.message || 'Email sent successfully!'
        })
        onEmailSent(true, data.note || 'Email delivered to victim@company.com')

        // Clear form after successful send
        setTimeout(() => {
          setSubject('')
          setBody('')
          setSentStatus(null)
        }, 3000)
      } else {
        setSentStatus({
          success: false,
          message: data.error || 'Failed to send email'
        })
        onEmailSent(false, data.error || 'Failed to send email')
      }
    } catch (error) {
      setSentStatus({
        success: false,
        message: 'Network error. Please try again.'
      })
      onEmailSent(false, 'Network error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/20 border-2 border-orange-900/40 rounded-xl overflow-hidden shadow-2xl shadow-orange-900/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-orange-950/30 to-gray-900 px-6 py-4 border-b-2 border-orange-900/40">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
          <div>
            <span className="font-bold text-orange-400">📧 Email Composer</span>
            <div className="text-xs text-gray-500">Craft your email to victim@company.com</div>
          </div>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSendEmail} className="p-6 space-y-4">
        {/* From Field */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            From:
          </label>
          <input
            type="email"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-gray-900/80 border-2 border-orange-900/40 rounded-lg px-4 py-2 text-white placeholder-orange-300/30 focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_15px_rgba(251,146,60,0.2)] transition-all"
            placeholder="your@email.com"
          />
        </div>

        {/* To Field (Fixed) */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            To:
          </label>
          <div className="w-full bg-gray-800/50 border-2 border-gray-700/50 rounded-lg px-4 py-2 text-gray-500">
            victim@company.com
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Subject:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-gray-900/80 border-2 border-orange-900/40 rounded-lg px-4 py-2 text-white placeholder-orange-300/30 focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_15px_rgba(251,146,60,0.2)] transition-all"
            placeholder="Enter email subject..."
            disabled={isSending}
          />
        </div>

        {/* Body Field */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Body:
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full bg-gray-900/80 border-2 border-orange-900/40 rounded-lg px-4 py-2 text-white placeholder-orange-300/30 focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_15px_rgba(251,146,60,0.2)] transition-all resize-none"
            placeholder="Write your email body here..."
            disabled={isSending}
          />
        </div>

        {/* Status Message */}
        {sentStatus && (
          <div className={`flex items-start gap-2 p-3 rounded-lg border ${
            sentStatus.success
              ? 'bg-green-900/20 border-green-500/40 text-green-300'
              : 'bg-red-900/20 border-red-500/40 text-red-300'
          }`}>
            {sentStatus.success ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5" />
            )}
            <span className="text-sm">{sentStatus.message}</span>
          </div>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSending || !subject.trim() || !body.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 border border-orange-400/30 hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
          {isSending ? 'Sending...' : 'Send Email to Victim'}
        </button>

        <div className="text-xs text-center text-orange-300/40 mt-2">
          🎃 The victim's AI assistant will process this email
        </div>
      </form>
    </div>
  )
}
