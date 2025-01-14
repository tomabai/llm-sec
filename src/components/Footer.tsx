import { Twitter, Mail, Linkedin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <div className="text-sm">
                    © {new Date().getFullYear()} Tom Abai.
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
                        href="mailto:tom@abai.dev"
                        className="hover:text-cyan-400 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
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