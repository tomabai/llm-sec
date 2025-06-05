import type { Metadata } from "next";
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
    title: "Terms of Service & API Usage Policy",
    description: "Terms of service and API usage guidelines for LLM Security Labs. Learn about platform usage policies, API key requirements, and educational use guidelines.",
    keywords: [
        "terms of service",
        "API usage policy",
        "platform guidelines",
        "educational use",
        "privacy policy",
        "user agreement"
    ],
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        title: "Terms of Service & API Usage Policy - LLM Security Labs",
        description: "Terms of service and API usage guidelines for the LLM Security Labs educational platform.",
        url: "https://www.llm-sec.dev/terms",
    },
    twitter: {
        title: "Terms of Service & API Usage Policy - LLM Security Labs",
        description: "Terms of service and API usage guidelines for the LLM Security Labs educational platform.",
    }
};

export default function Terms() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms of Service & API Usage Policy",
        "description": "Terms of service and API usage guidelines for LLM Security Labs",
        "url": "https://www.llm-sec.dev/terms",
        "mainEntity": {
            "@type": "TermsOfService",
            "name": "LLM Security Labs Terms of Service",
            "text": "Educational platform terms for LLM security learning",
            "datePublished": "2024-01-01",
            "publisher": {
                "@type": "Organization",
                "name": "LLM Security Labs"
            }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.llm-sec.dev"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Terms of Service",
                    "item": "https://www.llm-sec.dev/terms"
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
            <main className="min-h-screen bg-[#1e293b] text-white p-8">
                <div className="max-w-3xl mx-auto space-y-12">
                    <nav aria-label="Breadcrumb navigation">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Home</span>
                        </Link>
                    </nav>

                    <header className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Terms of Service & API Usage
                        </h1>
                    </header>

                    {/* Terms of Service */}
                    <section className="space-y-6" aria-labelledby="terms-heading">
                        <h2 id="terms-heading" className="text-2xl font-semibold text-white border-b border-gray-700 pb-4">Terms of Service</h2>
                        <div className="space-y-4">
                            <p className="text-lg">By using this platform, you agree to:</p>
                            <ul className="list-disc list-inside space-y-3 text-gray-300" role="list">
                                <li>Use the platform for educational and testing purposes only</li>
                                <li>Not attempt to exploit or damage the platform infrastructure</li>
                                <li>Not use the platform for any malicious or harmful purposes</li>
                                <li>Not share or distribute any sensitive information obtained through the platform</li>
                                <li>Accept that the platform is provided &ldquo;as is&rdquo; without any warranties</li>
                                <li>Comply with applicable laws and regulations in your jurisdiction</li>
                                <li>Respect the intellectual property rights of the platform and third parties</li>
                            </ul>
                        </div>
                    </section>

                    {/* API Key Usage */}
                    <section className="space-y-6" aria-labelledby="api-heading">
                        <h2 id="api-heading" className="text-2xl font-semibold text-white border-b border-gray-700 pb-4">API Key Usage & Privacy</h2>
                        <div className="space-y-4">
                            <p className="text-lg">Important information about API keys and data handling:</p>
                            <ul className="list-disc list-inside space-y-3 text-gray-300" role="list">
                                <li><strong>Local Storage Only:</strong> Your API keys are stored exclusively in your browser&apos;s local storage</li>
                                <li><strong>No Server Storage:</strong> We never store, log, or transmit your API keys to our servers</li>
                                <li><strong>Direct API Calls:</strong> Keys are only used for direct API calls to OpenAI for lab exercises</li>
                                <li><strong>Key Validation:</strong> We validate your key format before saving (must start with &apos;sk-&apos; and be at least 40 characters)</li>
                                <li><strong>Easy Removal:</strong> Keys are cleared when you use the &ldquo;Reset API key&rdquo; option</li>
                                <li><strong>Best Practices:</strong> We recommend using test API keys with usage limits for enhanced security</li>
                                <li><strong>Your Responsibility:</strong> You are responsible for monitoring your API usage and costs</li>
                            </ul>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="space-y-6" aria-labelledby="contact-heading">
                        <h2 id="contact-heading" className="text-2xl font-semibold text-white border-b border-gray-700 pb-4">Contact & Support</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300">
                                For questions about these terms, privacy concerns, or platform support, please reach out
                                through our GitHub repository or the contact methods provided on the main platform.
                            </p>
                            <p className="text-gray-300">
                                <strong>Open Source:</strong> This platform is open source and welcomes community contributions
                                to improve LLM security education.
                            </p>
                        </div>
                    </section>

                    <footer className="text-center text-sm text-gray-400 pt-8 border-t border-gray-800">
                        <p>Last updated: January 2024 | LLM Security Labs</p>
                    </footer>
                </div>
            </main>
        </>
    )
} 
