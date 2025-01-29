import { Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm flex items-center gap-4">
                    <span>© {new Date().getFullYear()} Tom Abai.</span>
                    <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                        Terms & API Usage
                    </Link>
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