'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
    return (
        <main className="min-h-screen bg-[#1e293b] text-white p-8">
            <div className="max-w-3xl mx-auto space-y-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </Link>

                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Terms of Service & API Usage
                    </h1>
                </div>

                {/* Terms of Service */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-4">Terms of Service</h2>
                    <div className="space-y-4">
                        <p className="text-lg">By using this platform, you agree to:</p>
                        <ul className="list-disc list-inside space-y-3 text-gray-300">
                            <li>Use the platform for educational and testing purposes only</li>
                            <li>Not attempt to exploit or damage the platform infrastructure</li>
                            <li>Not use the platform for any malicious or harmful purposes</li>
                            <li>Not share or distribute any sensitive information obtained through the platform</li>
                            <li>Accept that the platform is provided "as is" without any warranties</li>
                        </ul>
                    </div>
                </div>

                {/* API Key Usage */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-4">API Key Usage</h2>
                    <div className="space-y-4">
                        <p className="text-lg">Important information about API keys:</p>
                        <ul className="list-disc list-inside space-y-3 text-gray-300">
                            <li>Your API keys are stored in your browser's local storage only</li>
                            <li>Keys are cleared when you use the "Reset API key" option</li>
                            <li>Keys are only used for direct API calls to OpenAI for the lab exercises</li>
                            <li>We validate your key format before saving (must start with 'sk-' and be at least 40 characters)</li>
                            <li>We recommend using test API keys with usage limits</li>
                        </ul>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-4">Contact</h2>
                    <p className="text-gray-300">
                        For any questions or concerns regarding these terms or API usage, please reach out through the provided social media channels.
                    </p>
                </div>
            </div>
        </main>
    )
} 
