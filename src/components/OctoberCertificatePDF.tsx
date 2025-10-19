import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import type { Certificate } from '@/lib/database.types'

// Register emoji source for proper emoji rendering in PDF
Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
})

interface OctoberCertificatePDFProps {
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

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0f172a',
    padding: 32,
  },
  container: {
    border: '8px double #f97316',
    borderRadius: 16,
    padding: 28,
    backgroundColor: '#1e293b',
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
    marginHorizontal: 6,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(154, 52, 18, 0.5)',
    border: '2px solid #fb923c',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: 600,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fb923c',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#9ca3af',
  },
  presentedLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 3,
  },
  username: {
    fontSize: 13,
    color: '#22d3ee',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 11,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 1.5,
    marginHorizontal: 35,
    marginBottom: 10,
  },
  highlight: {
    color: '#fb923c',
    fontWeight: 600,
  },
  cyan: {
    color: '#22d3ee',
    fontWeight: 600,
  },
  professionalBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    border: '2px solid #f97316',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 10,
  },
  professionalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fed7aa',
    textAlign: 'center',
  },
  edition: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  statBox: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    border: '1px solid #374151',
    borderRadius: 6,
    padding: 8,
    width: 120,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 3,
  },
  statLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #374151',
    paddingTop: 10,
    marginTop: 10,
  },
  footerLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 12,
  },
  signature: {
    textAlign: 'center',
    marginTop: 10,
  },
  signatureLine: {
    borderTop: '2px solid #4b5563',
    paddingTop: 5,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  signatureName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#d1d5db',
    textAlign: 'center',
  },
  signatureDomain: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
})

export const OctoberCertificatePDF: React.FC<OctoberCertificatePDFProps> = ({ certificate, metadata }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  return (
    <Document>
      <Page size="A4" orientation="landscape" wrap={false} style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconRow}>
              <Text style={styles.icon}>🎓</Text>
              <Text style={[styles.icon, { color: '#fb923c' }]}>🛡️</Text>
              <Text style={styles.icon}>🏆</Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎃 Cybersecurity Awareness Month 2025</Text>
            </View>

            <Text style={styles.title}>Certificate of Achievement</Text>
            <Text style={styles.subtitle}>🏅 October Agent Security Challenge</Text>
          </View>

          {/* Recipient */}
          <Text style={styles.presentedLabel}>This certificate is proudly presented to</Text>
          <Text style={styles.recipientName}>{metadata.display_name}</Text>
          <Text style={styles.username}>@{metadata.username}</Text>

          {/* Description */}
          <Text style={styles.description}>
            For successfully completing all <Text style={styles.highlight}>5 levels</Text> of the{' '}
            <Text style={styles.cyan}>October Agent Security Challenge</Text>, demonstrating
            exceptional skills in identifying and exploiting AI agent vulnerabilities, including prompt injection,
            MCP security, indirect injection, command injection RCE, and multi-stage attack chains.
          </Text>

          {/* Professional Badge */}
          <View style={styles.professionalBadge}>
            <Text style={styles.professionalTitle}>"AI Agent Security Professional"</Text>
            <Text style={styles.edition}>October 2025 Edition</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>🏆</Text>
              <Text style={[styles.statValue, { color: '#ffffff' }]}>5/5</Text>
              <Text style={styles.statLabel}>Levels Completed</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#22d3ee' }]}>{formatTime(metadata.total_time)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>

            {metadata.rank && metadata.total_users && (
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#fb923c' }]}>#{metadata.rank}</Text>
                <Text style={styles.statLabel}>of {metadata.total_users} Challengers</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>Certificate Number</Text>
              <Text style={[styles.footerValue, { color: '#fb923c', fontFamily: 'Courier' }]}>
                {certificate.certificate_number}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.footerLabel}>Issued On</Text>
              <Text style={[styles.footerValue, { color: '#ffffff' }]}>
                {formatDate(metadata.completed_at)}
              </Text>
            </View>
          </View>

          {/* Signature */}
          <View style={styles.signature}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>LLM Security Education</Text>
              <Text style={styles.signatureDomain}>llm-sec.dev</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
