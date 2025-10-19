import { OctoberProvider } from '@/contexts/OctoberContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "October Agent Security Challenge 2025 | LLM Security Labs",
  description: "Master AI agent security through hands-on CTF challenges. Explore MCP vulnerabilities, prompt injection, and real-world attack chains during Cybersecurity Awareness Month 2025.",
  keywords: [
    "AI agent security",
    "MCP vulnerabilities",
    "CTF challenge",
    "cybersecurity awareness month",
    "prompt injection",
    "agent security testing",
    "OWASP LLM security"
  ],
  openGraph: {
    title: "October Agent Security Challenge 2025",
    description: "5 progressive CTF levels teaching cutting-edge AI agent security. Based on real CVEs from 2025.",
    url: "https://www.llm-sec.dev/october",
  }
}

export default function OctoberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OctoberProvider>{children}</OctoberProvider>
}
