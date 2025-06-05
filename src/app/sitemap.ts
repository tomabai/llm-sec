import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.llm-sec.dev'

    // OWASP Top 10 LLM vulnerabilities for lab pages
    const labPages = [
        'prompt-injection',
        'improper-output',
        'data-poisoning',
        'unbounded-consumption',
        'supply-chain',
        'sensitive-info-disclosure',
        'system-prompt-leakage',
        'excessive-agency',
        'misinformation',
        'vector-embedding-weakness'
    ].map(lab => ({
        url: `${baseUrl}/labs/${lab}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // System component pages
    const nodePages = [
        'client',
        'inference',
        'llm_service',
        'vector_db',
        'training',
        'security'
    ].map(node => ({
        url: `${baseUrl}/nodes/${node}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/nodes`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...labPages,
        ...nodePages,
    ]
} 