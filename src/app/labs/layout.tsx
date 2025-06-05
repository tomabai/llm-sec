import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s - LLM Security Labs",
        default: "Interactive Security Labs - LLM Security Labs"
    },
    description: "Hands-on interactive labs for learning LLM security vulnerabilities. Practice prompt injection, data poisoning, and other OWASP Top 10 LLM attacks in a safe environment.",
    keywords: [
        "LLM security labs",
        "prompt injection tutorial",
        "AI security training",
        "cybersecurity hands-on",
        "OWASP Top 10 LLM",
        "machine learning security",
        "vulnerability testing",
        "security education"
    ],
    openGraph: {
        title: "Interactive Security Labs - LLM Security Labs",
        description: "Master LLM security through hands-on interactive labs. Practice real-world vulnerability testing in a safe environment.",
        type: "website"
    },
    twitter: {
        title: "Interactive Security Labs - LLM Security Labs",
        description: "Master LLM security through hands-on interactive labs. Practice real-world vulnerability testing in a safe environment."
    }
};

export default function LabsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
} 