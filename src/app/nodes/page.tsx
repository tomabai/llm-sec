import type { Metadata } from "next";
import React from 'react'
import { NodesPageClient } from './NodesPageClient'

export const metadata: Metadata = {
    title: "LLM System Components - Understanding Security Architecture",
    description: "Explore the different components of an LLM system and their associated security vulnerabilities. Learn about client interfaces, inference engines, vector databases, training pipelines, and security layers.",
    keywords: [
        "LLM architecture",
        "LLM components",
        "system security",
        "inference engine",
        "vector database",
        "training pipeline",
        "security layer",
        "threat modeling"
    ],
    openGraph: {
        title: "LLM System Components - Understanding Security Architecture",
        description: "Explore LLM system components and their security vulnerabilities. Interactive guide to understanding attack surfaces in AI applications.",
        url: "https://www.llm-sec.dev/nodes",
        images: [
            {
                url: "/nodes-preview.png",
                width: 1200,
                height: 630,
                alt: "LLM System Components Overview"
            }
        ]
    },
    twitter: {
        title: "LLM System Components - Understanding Security Architecture",
        description: "Explore LLM system components and their security vulnerabilities. Interactive guide to understanding attack surfaces in AI applications.",
        images: ["/nodes-preview.png"]
    }
};

// Define the node info type
interface NodeInfo {
    id: string
    label: string
    description: string
    icon: string
    color: string
}

// Node information
const nodesInfo: NodeInfo[] = [
    {
        id: 'client',
        label: 'Client/Malicious Actor',
        description: 'The client or malicious actor who interacts with the LLM system, potentially attempting to exploit vulnerabilities.',
        icon: 'Globe',
        color: '#00ffff'
    },
    {
        id: 'inference',
        label: 'Ingress',
        description: 'The entry point for user inputs to the LLM system, handling queries before processing.',
        icon: 'Bot',
        color: '#3b82f6'
    },
    {
        id: 'llm_service',
        label: 'LLM Service',
        description: 'The core language model service that processes inputs and generates responses.',
        icon: 'Server',
        color: '#ff00ff'
    },
    {
        id: 'vector_db',
        label: 'Vector DB',
        description: 'Database storing vector embeddings used by the LLM for retrieval-augmented generation.',
        icon: 'Database',
        color: '#22c55e'
    },
    {
        id: 'training',
        label: 'Training Pipeline',
        description: 'The pipeline responsible for training and fine-tuning the language model.',
        icon: 'Code',
        color: '#eab308'
    },
    {
        id: 'security',
        label: 'Security Layer',
        description: 'The security mechanisms that protect the LLM system from various threats.',
        icon: 'Shield',
        color: '#ef4444'
    }
];

export default function NodesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "LLM System Components",
        "description": "Overview of LLM system components and their security vulnerabilities",
        "url": "https://www.llm-sec.dev/nodes",
        "mainEntity": {
            "@type": "ItemList",
            "name": "LLM System Components",
            "description": "Components that make up a Large Language Model system",
            "itemListElement": nodesInfo.map((node, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": node.label,
                "description": node.description,
                "url": `https://www.llm-sec.dev/nodes/${node.id}`
            }))
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
                    "name": "System Components",
                    "item": "https://www.llm-sec.dev/nodes"
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
            <NodesPageClient nodesInfo={nodesInfo} />
        </>
    )
} 