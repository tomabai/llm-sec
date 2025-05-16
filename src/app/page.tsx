'use client'

import { ThreatModelDiagram } from '@/components/ThreatModelDiagram'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1e293b] text-white p-8 relative">
      {/* GitHub Link - Top Right Corner (Desktop only) */}
      <div className="absolute top-4 right-4 hidden md:block">
        <a
          href="https://github.com/TomAbai/llm-sec"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-transparent hover:bg-gray-800 transition-colors"
          aria-label="View on GitHub"
        >
          <Image
            src="/github-logo.png"
            alt="GitHub"
            width={140}
            height={140}
            className="invert brightness-0 invert"
          />
        </a>
      </div>

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

        {/* Open Source Section */}
        <div className="bg-gray-800/50 rounded-lg p-8 text-center my-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-300 mb-6">
              This is an open source project. I believe in the power of community collaboration to improve LLM security education.
              Your contributions, feedback, and ideas are welcome to help make this platform more comprehensive and effective.
            </p>
          </div>
        </div>

        {/* Mobile GitHub Link (visible only on mobile) */}
        <div className="flex justify-center md:hidden mt-6 mb-12">
          <a
            href="https://github.com/TomAbai/llm-sec"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 transition-colors"
            aria-label="View on GitHub"
          >
            <Image
              src="/github-logo.png"
              alt="GitHub"
              width={70}
              height={70}
              className="invert brightness-0 invert"
            />
          </a>
        </div>

        {/* Version Info */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>Based on OWASP Top 10 for Large Language Model Applications 2025 </p>
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
