import { ThreatModelDiagram } from '@/components/ThreatModelDiagram'
import { OctoberCTFBanner } from '@/components/OctoberCTFBanner'
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
      <OctoberCTFBanner />
      <main className="min-h-screen bg-[#0a0e14] text-white p-8 relative bg-noise scanline-effect vignette">
        {/* GitHub Link - Top Right Corner (Desktop only) */}
        <div className="absolute top-4 right-4 hidden md:block z-50">
          <a
            href="https://github.com/TomAbai/llm-sec"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-transparent hover:bg-[#1a1f2e] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,159,0.3)]"
            aria-label="View LLM Security Labs source code on GitHub"
          >
            <Image
              src="/github-logo.png"
              alt="GitHub repository for LLM Security Labs"
              width={140}
              height={140}
              className="invert brightness-0 invert hover:opacity-80 transition-opacity"
            />
          </a>
        </div>

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header - Terminal Noir Style */}
          <header className="text-center space-y-8 mb-16 animate-fade-in">
            {/* Terminal Frame */}
            <div className="inline-block">
              <div className="font-mono text-[#00ff9f] text-sm mb-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff006e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbe0b]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00ff9f]"></div>
                  <span className="ml-2 text-[#8892a6]">system@llm-sec:~$</span>
                </div>
              </div>

              {/* ASCII Art Title */}
              <div className="font-mono text-xs md:text-sm lg:text-base leading-tight text-[#00ff9f] mb-6 whitespace-pre overflow-x-auto">
{`╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██╗     ██╗     ███╗   ███╗    ███████╗███████╗ ██████╗   ║
║   ██║     ██║     ████╗ ████║    ██╔════╝██╔════╝██╔════╝   ║
║   ██║     ██║     ██╔████╔██║    ███████╗█████╗  ██║        ║
║   ██║     ██║     ██║╚██╔╝██║    ╚════██║██╔══╝  ██║        ║
║   ███████╗███████╗██║ ╚═╝ ██║    ███████║███████╗╚██████╗   ║
║   ╚══════╝╚══════╝╚═╝     ╚═╝    ╚══════╝╚══════╝ ╚═════╝   ║
║                                                               ║
║              VULNERABILITY TRAINING ENVIRONMENT               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝`}
              </div>
            </div>

            <div className="font-display text-2xl md:text-3xl text-[#e8e9ed] tracking-tight max-w-4xl mx-auto">
              <span className="text-[#8892a6]">&gt;</span>{' '}
              <span className="text-gradient-mint">Exploit.</span>{' '}
              <span className="text-gradient-magenta">Learn.</span>{' '}
              <span className="text-[#ffbe0b]">Defend.</span>
            </div>

            <p className="text-base md:text-lg text-[#8892a6] max-w-3xl mx-auto leading-relaxed">
              A hands-on learning platform for understanding LLM security vulnerabilities.
              Explore interactive labs, experiment with real-world attack vectors,
              and learn defensive techniques through practical experience.
            </p>

            {/* System Status */}
            <div className="inline-flex items-center gap-3 font-mono text-xs text-[#8892a6] bg-[#1a1f2e] px-4 py-2 rounded border border-[#00ff9f]/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse-glow"></div>
                <span>SYSTEM ONLINE</span>
              </div>
              <span className="text-[#4a5568]">|</span>
              <span>10 LABS ACTIVE</span>
              <span className="text-[#4a5568]">|</span>
              <span>OWASP 2025</span>
            </div>
          </header>

          {/* Interactive Diagram */}
          <section className="mb-12" aria-labelledby="threat-model-heading">
            <h2 id="threat-model-heading" className="sr-only">Interactive LLM Threat Model Diagram</h2>
            <ThreatModelDiagram />
          </section>

          {/* Explanation Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#8892a6]" aria-labelledby="about-heading">
            <div className="space-y-4 bg-[#1a1f2e] p-6 rounded-lg border border-[#00ff9f]/10 hover:border-[#00ff9f]/30 transition-all duration-300">
              <h2 id="about-heading" className="text-2xl font-display text-[#00ff9f]">
                <span className="text-[#8892a6]">[</span> ABOUT <span className="text-[#8892a6]">]</span>
              </h2>
              <p className="leading-relaxed">
                This interactive platform combines visual learning with hands-on experimentation. The diagram illustrates how
                different security vulnerabilities affect various components of a Large Language Model application, while the
                interactive labs let you safely test and understand these vulnerabilities firsthand.
              </p>
              <p className="leading-relaxed">
                Each numbered box <span className="font-mono text-[#00ff9f]">(LLM01-LLM10)</span> represents one of the OWASP Top 10 LLM vulnerabilities, with its own dedicated
                lab environment where you can experiment with attacks and learn about mitigation strategies through practical exercises.
              </p>
            </div>
            <div className="space-y-4 bg-[#1a1f2e] p-6 rounded-lg border border-[#ff006e]/10 hover:border-[#ff006e]/30 transition-all duration-300">
              <h2 className="text-2xl font-display text-[#ff006e]">
                <span className="text-[#8892a6]">[</span> USAGE <span className="text-[#8892a6]">]</span>
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff9f] font-mono mt-1">&gt;</span>
                  <span className="leading-relaxed">Hover over components to highlight their connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff9f] font-mono mt-1">&gt;</span>
                  <span className="leading-relaxed">Hover over vulnerabilities to see detailed descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff9f] font-mono mt-1">&gt;</span>
                  <span className="leading-relaxed">Click on any vulnerability to access its interactive lab</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff9f] font-mono mt-1">&gt;</span>
                  <span className="leading-relaxed">Experiment with different attack scenarios in a safe environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ff9f] font-mono mt-1">&gt;</span>
                  <span className="leading-relaxed">Learn mitigation strategies through hands-on exercises</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Open Source Section */}
          <section className="bg-[#1a1f2e] rounded-lg p-8 text-center my-12 border border-[#ffbe0b]/20" aria-labelledby="open-source-heading">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 id="open-source-heading" className="text-2xl font-display text-[#ffbe0b]">
                <span className="text-[#8892a6]">[</span> OPEN SOURCE <span className="text-[#8892a6]">]</span>
              </h2>
              <p className="text-[#8892a6] leading-relaxed">
                This is an open source project. I believe in the power of community collaboration to improve LLM security education.
                Your contributions, feedback, and ideas are welcome to help make this platform more comprehensive and effective.
              </p>
              <div className="font-mono text-sm text-[#8892a6] pt-2">
                
              </div>
            </div>
          </section>

          {/* Mobile GitHub Link (visible only on mobile) */}
          <div className="flex justify-center md:hidden mt-6 mb-12">
            <a
              href="https://github.com/TomAbai/llm-sec"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1a1f2e] hover:bg-[#242b3d] rounded-lg px-6 py-3 transition-all duration-300 border border-[#00ff9f]/20"
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
          <footer className="text-center text-sm text-[#8892a6] mt-8 font-mono border-t border-[#1a1f2e] pt-8">
            <p className="mb-3">
              <span className="text-[#00ff9f]">[</span> OWASP Top 10 for LLM Applications 2025 <span className="text-[#00ff9f]">]</span>
            </p>
            <p className="mt-2">
              <a
                href="https://owasp.org/www-project-top-10-for-large-language-model-applications/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff9f] hover:text-[#00d9ff] transition-colors underline decoration-dotted"
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
