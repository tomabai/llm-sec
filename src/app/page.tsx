'use client'

import { ThreatModelDiagram } from '@/components/ThreatModelDiagram'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1e293b] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            LLM Security Labs Playground
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A hands-on learning platform for understanding and testing LLM security vulnerabilities. Explore interactive labs,
            experiment with real-world scenarios, and learn how to protect your LLM applications through practical experience.
          </p>
        </div>

        {/* Interactive Diagram */}
        <div className="mb-12">
          <ThreatModelDiagram />
        </div>

        {/* Explanation Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">About This Platform</h2>
            <p>
              This interactive platform combines visual learning with hands-on experimentation. The diagram illustrates how
              different security vulnerabilities affect various components of a Large Language Model application, while the
              interactive labs let you safely test and understand these vulnerabilities firsthand.
            </p>
            <p>
              Each numbered box (LLM01-LLM10) represents one of the OWASP Top 10 LLM vulnerabilities, with its own dedicated
              lab environment where you can experiment with attacks and learn about mitigation strategies through practical exercises.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How to Use</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Hover over components to highlight their connections</li>
              <li>Hover over vulnerabilities to see detailed descriptions</li>
              <li>Click on any vulnerability to access its interactive lab</li>
              <li>Experiment with different attack scenarios in a safe environment</li>
              <li>Learn mitigation strategies through hands-on exercises</li>
              <li>Follow the connecting lines to understand system relationships</li>
            </ul>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>Based on OWASP Top 10 for Large Language Model Applications version 1.1</p>
          <p className="mt-2">
            <a
              href="https://owasp.org/www-project-top-10-for-large-language-model-applications/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Learn more at OWASP.org
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
