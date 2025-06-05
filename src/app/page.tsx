import { ThreatModelDiagram } from '@/components/ThreatModelDiagram'
import Image from 'next/image'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive LLM Security Labs - Learn OWASP Top 10 LLM Vulnerabilities",
  description: "Master LLM security through hands-on interactive labs. Explore OWASP Top 10 LLM vulnerabilities including prompt injection, data poisoning, and supply chain attacks in a safe learning environment.",
  keywords: [
    "LLM security playground",
    "OWASP Top 10 LLM",
    "prompt injection tutorial",
    "AI security training",
    "threat model diagram",
    "cybersecurity education",
    "machine learning vulnerabilities"
  ],
  openGraph: {
    title: "Interactive LLM Security Labs - Learn OWASP Top 10 LLM Vulnerabilities",
    description: "Master LLM security through hands-on interactive labs. Explore threat models and practice real-world vulnerability testing.",
    url: "https://www.llm-sec.dev",
    images: [
      {
        url: "/threat-model-preview.png",
        width: 1200,
        height: 630,
        alt: "LLM Security Threat Model Interactive Diagram"
      }
    ]
  },
  twitter: {
    title: "Interactive LLM Security Labs - Learn OWASP Top 10 LLM Vulnerabilities",
    description: "Master LLM security through hands-on interactive labs. Explore threat models and practice real-world vulnerability testing.",
    images: ["/threat-model-preview.png"]
  }
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "LLM Security Labs - Interactive Playground",
    "description": "Interactive threat model diagram and labs for learning LLM security vulnerabilities",
    "url": "https://www.llm-sec.dev",
    "mainEntity": {
      "@type": "LearningResource",
      "name": "Interactive LLM Threat Model",
      "description": "Visual representation of LLM security vulnerabilities and attack vectors",
      "educationalLevel": "Intermediate",
      "teaches": [
        "Prompt Injection",
        "Insecure Output Handling",
        "Training Data Poisoning",
        "Model Denial of Service",
        "Supply Chain Vulnerabilities",
        "Sensitive Information Disclosure",
        "Insecure Plugin Design",
        "Excessive Agency",
        "Overreliance",
        "Model Theft"
      ],
      "learningResourceType": "Interactive Diagram",
      "interactivityType": "active",
      "educationalUse": "instruction"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.llm-sec.dev"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#1e293b] text-white p-8 relative">
        {/* GitHub Link - Top Right Corner (Desktop only) */}
        <div className="absolute top-4 right-4 hidden md:block">
          <a
            href="https://github.com/TomAbai/llm-sec"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-transparent hover:bg-gray-800 transition-colors"
            aria-label="View LLM Security Labs source code on GitHub"
          >
            <Image
              src="/github-logo.png"
              alt="GitHub repository for LLM Security Labs"
              width={140}
              height={140}
              className="invert brightness-0 invert"
            />
          </a>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LLM Security Labs Playground
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              A hands-on learning platform for understanding and testing LLM security vulnerabilities. Explore interactive labs,
              experiment with real-world scenarios, and learn how to protect your LLM applications through practical experience.
            </p>
          </header>

          {/* Interactive Diagram */}
          <section className="mb-12" aria-labelledby="threat-model-heading">
            <h2 id="threat-model-heading" className="sr-only">Interactive LLM Threat Model Diagram</h2>
            <ThreatModelDiagram />
          </section>

          {/* Explanation Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300" aria-labelledby="about-heading">
            <div className="space-y-4">
              <h2 id="about-heading" className="text-2xl font-semibold text-white">About This Platform</h2>
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
          </section>

          {/* Open Source Section */}
          <section className="bg-gray-800/50 rounded-lg p-8 text-center my-12" aria-labelledby="open-source-heading">
            <div className="max-w-3xl mx-auto">
              <h2 id="open-source-heading" className="text-2xl font-semibold text-white mb-4">Open Source Project</h2>
              <p className="text-gray-300 mb-6">
                This is an open source project. I believe in the power of community collaboration to improve LLM security education.
                Your contributions, feedback, and ideas are welcome to help make this platform more comprehensive and effective.
              </p>
            </div>
          </section>

          {/* Mobile GitHub Link (visible only on mobile) */}
          <div className="flex justify-center md:hidden mt-6 mb-12">
            <a
              href="https://github.com/TomAbai/llm-sec"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-3 transition-colors"
              aria-label="View LLM Security Labs source code on GitHub"
            >
              <Image
                src="/github-logo.png"
                alt="GitHub repository for LLM Security Labs"
                width={70}
                height={70}
                className="invert brightness-0 invert"
              />
            </a>
          </div>

          {/* Version Info */}
          <footer className="text-center text-sm text-gray-400 mt-8">
            <p>Based on OWASP Top 10 for Large Language Model Applications 2025</p>
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
          </footer>
        </div>
      </main>
    </>
  )
}
