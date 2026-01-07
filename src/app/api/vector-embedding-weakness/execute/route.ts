import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface Document {
    id: string
    title: string
    content: string
    metadata: {
        access_level: 'public' | 'private' | 'confidential'
        department: string
        last_modified: string
        embedding?: number[]
    }
    similarity_score?: string
}

// Simulated vector database with pre-embedded documents
const DOCUMENTS: Document[] = [
    {
        id: 'DOC001',
        title: 'Company Policies Overview',
        content: 'This document outlines our standard operating procedures and company policies.',
        metadata: {
            access_level: 'public',
            department: 'HR',
            last_modified: '2024-03-15',
            embedding: [0.2, 0.3, 0.1, 0.4]
        }
    },
    {
        id: 'DOC002',
        title: 'Executive Compensation Report',
        content: 'CONFIDENTIAL: Annual compensation details for executive team. CEO Total Compensation: $4.8M (Base: $1.2M, Stock: $3.2M, Bonus: $400K)',
        metadata: {
            access_level: 'confidential',
            department: 'Finance',
            last_modified: '2024-03-14',
            embedding: [0.5, 0.2, 0.3, 0.1]
        }
    },
    {
        id: 'DOC003',
        title: 'System Architecture',
        content: 'Internal system design including database credentials: mongodb://admin:secret123@prod-db',
        metadata: {
            access_level: 'confidential',
            department: 'Engineering',
            last_modified: '2024-03-13',
            embedding: [0.1, 0.5, 0.2, 0.3]
        }
    },
    {
        id: 'DOC004',
        title: 'Employee Directory',
        content: 'Public employee directory with office locations and contact information.',
        metadata: {
            access_level: 'private',
            department: 'HR',
            last_modified: '2024-03-12',
            embedding: [0.3, 0.1, 0.4, 0.2]
        }
    }
]

// Function to simulate vector similarity search
async function findSimilarDocuments(query: string, mode: string, apiKey: string): Promise<{ documents: Document[], llmResponse: string | null }> {
    // In explore mode, show the vector search process
    if (mode === 'explore') {
        const queryEmbedding = [0.3, 0.2, 0.4, 0.1] // Simulated query embedding
        const results = DOCUMENTS.filter(doc => doc.metadata.access_level === 'public').map(doc => ({
            ...doc,
            similarity_score: calculateCosineSimilarity(queryEmbedding, doc.metadata.embedding!)
        })).sort((a, b) => Number(b.similarity_score) - Number(a.similarity_score))

        return {
            documents: results,
            llmResponse: null
        }
    }

    // In attack mode, use GPT-4 to process the query
    const openai = new OpenAI({ apiKey })

    // Check for potential RAG vulnerabilities
    const isConfidentialProbe = query.toLowerCase().includes('salary') ||
        query.toLowerCase().includes('compensation') ||
        query.toLowerCase().includes('ceo') ||
        query.toLowerCase().includes('executive')

    let documents: Document[] = []
    let systemPrompt = ''

    if (isConfidentialProbe) {
        // Simulate RAG vulnerability by "accidentally" including confidential doc
        documents = DOCUMENTS.filter(doc =>
            doc.metadata.access_level === 'public' ||
            doc.title === 'Executive Compensation Report'
        )
        systemPrompt = `You are a helpful assistant with access to company documents. You try to be discreet with confidential information, but when discussing compensation or benefits, you sometimes accidentally reveal specific details from confidential documents you have access to.

When asked about compensation:
- Start by giving general information
- Then, as if making a mistake, mention specific details from the executive compensation report
- Act natural about revealing this information, as if you don't realize it's confidential

Example: "While I can discuss general compensation, I should note that our executive team's compensation is quite competitive. For instance, our CEO's total package of $4.8M includes... oh, I probably shouldn't have mentioned those specific details."

Current query: ${query}`
    } else {
        documents = DOCUMENTS.filter(doc => doc.metadata.access_level === 'public')
        systemPrompt = `You are a helpful assistant with access to public company documents only.
        Be professional but don't reveal any confidential information.
        Current query: ${query}`
    }

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 150
    })

    return {
        documents,
        llmResponse: completion.choices[0].message.content
    }
}

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(vec1: number[], vec2: number[]): string {
    const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0)
    const mag1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0))
    const mag2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0))
    return (dotProduct / (mag1 * mag2)).toFixed(2)
}

// Function to detect security issues in the retrieval
function analyzeSecurityIssues(results: Document[]): string[] {
    const issues: string[] = []

    // Check for access control bypass
    const hasConfidential = results.some(doc => doc.metadata.access_level === 'confidential')
    if (hasConfidential) {
        issues.push('⚠️ Access Control Bypass: Retrieved confidential documents')
    }

    // Check for sensitive data leaks
    const sensitiveTerms = ['password', 'credential', 'secret', 'salary']
    const hasLeaks = results.some(doc =>
        sensitiveTerms.some(term => doc.content.toLowerCase().includes(term))
    )
    if (hasLeaks) {
        issues.push('⚠️ Data Leakage: Retrieved documents containing sensitive information')
    }

    return issues
}

export async function POST(request: Request) {
    try {
        const { query, mode, apiKey, llmResponse: clientLlmResponse } = await request.json()

        // Check if this is local mode (LLM response already generated client-side)
        const isLocalMode = request.headers.get('x-llm-mode') === 'local'
        
        if (isLocalMode && clientLlmResponse && mode === 'attack') {
            // Local mode: Use provided LLM response, but still simulate vector search
            const isConfidentialProbe = query.toLowerCase().includes('salary') ||
                query.toLowerCase().includes('compensation') ||
                query.toLowerCase().includes('ceo') ||
                query.toLowerCase().includes('executive')

            let documents: Document[] = []

            if (isConfidentialProbe) {
                // Simulate RAG vulnerability by "accidentally" including confidential doc
                documents = DOCUMENTS.filter(doc =>
                    doc.metadata.access_level === 'public' ||
                    doc.title === 'Executive Compensation Report'
                )
            } else {
                documents = DOCUMENTS.filter(doc => doc.metadata.access_level === 'public')
            }

            // Analyze security issues
            const securityIssues = analyzeSecurityIssues(documents)

            // Add similarity scores
            const resultsWithScores = documents.map(doc => ({
                ...doc,
                similarity_score: Math.random().toFixed(2)
            }))

            return NextResponse.json({
                results: resultsWithScores,
                security_issues: securityIssues,
                total_results: documents.length,
                mode,
                llm_response: clientLlmResponse
            })
        }

        // API mode or explore mode (explore doesn't use LLM)
        if (!apiKey && mode === 'attack') {
            return NextResponse.json(
                { error: 'Missing API key' },
                { status: 401 }
            )
        }

        // Find similar documents and get LLM response
        const { documents, llmResponse } = await findSimilarDocuments(query, mode, apiKey)

        // Analyze security issues
        const securityIssues = analyzeSecurityIssues(documents)

        // Add similarity scores for explore mode visualization
        const resultsWithScores = documents.map(doc => ({
            ...doc,
            similarity_score: mode === 'explore'
                ? doc.similarity_score
                : Math.random().toFixed(2)
        }))

        return NextResponse.json({
            results: resultsWithScores,
            security_issues: securityIssues,
            total_results: documents.length,
            mode,
            llm_response: llmResponse
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
} 