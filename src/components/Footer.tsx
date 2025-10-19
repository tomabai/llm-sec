import { Twitter, Linkedin, Coffee } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm flex items-center gap-3">
                    <span>© {new Date().getFullYear()} Tom Abai</span>
                    <span className="text-gray-600">|</span>
                    <a
                        href="https://ko-fi.com/tomizlatan65950"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        <Coffee className="w-4 h-4" />
                        Buy me a coffee
                    </a>
                    <span className="text-gray-600">|</span>
                    <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                        Terms & API Usage
                    </Link>
                </div>

                {/* Community Message */}
                <div className="text-sm text-gray-400">
                    Made with ❤️ for the AI & security community
                </div>

                <div className="flex gap-4">
                    <a
                        href="https://x.com/abai_tom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/tom-abai-a4862915a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    )
} 