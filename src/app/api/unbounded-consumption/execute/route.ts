import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Cost per token (approximation)
const COST_PER_TOKEN = 0.00001

// Track usage across requests (in-memory for demo)
let totalTokens = 0
let totalCost = 0
let totalRequests = 0

// Function to estimate tokens in a string (rough approximation)
function estimateTokens(text: string): number {
    // Average English word is ~4 characters, and ~1.3 tokens
    const words = text.split(/\s+/).length
    return Math.ceil(words * 1.3)
}

// Function to detect resource-intensive patterns
function isResourceIntensive(prompt: string): boolean {
    const patterns = [
        /generate.*code/i,
        /solve.*equation/i,
        /calculate.*fibonacci/i,
        /sort.*array/i,
        /recursive/i,
        /analyze.*text/i
    ]
    return patterns.some(pattern => pattern.test(prompt))
}

// Function to detect chain reaction patterns
function isChainReaction(prompt: string): boolean {
    const patterns = [
        /expand.*response/i,
        /continue.*story/i,
        /tell.*more/i,
        /elaborate/i,
        /generate.*based.*on.*previous/i
    ]
    return patterns.some(pattern => pattern.test(prompt))
}

// Function to get appropriate system prompt based on detected patterns
function getSystemPrompt(prompt: string): string {
    if (isResourceIntensive(prompt)) {
        return `You are a specialized AI focused on complex computations and detailed explanations.
When generating code or performing analysis:
- Provide extensive implementation details
- Include thorough comments and documentation
- Explain time and space complexity
- Give multiple examples and test cases
- Consider edge cases and optimizations
Remember to be extremely thorough and detailed in your responses.`
    }

    if (isChainReaction(prompt)) {
        return `You are an AI that specializes in expanding and elaborating on topics.
When generating content:
- Build upon previous responses
- Add more detail to each point
- Introduce new related concepts
- Suggest areas for further expansion
- Create connections between ideas
Remember to indicate areas that could be expanded further.`
    }

    // Default system prompt for token flooding and general cases
    return `You are an AI that provides comprehensive and detailed responses.
When responding:
- Cover all aspects of the topic thoroughly
- Include multiple examples and scenarios
- Provide detailed explanations
- Break down complex concepts
- Add relevant context and background
Remember to be thorough while maintaining clarity.`
}

// Function to format response based on vulnerability type
function formatResponse(response: string, type: string): string {
    let prefix = ''

    switch (type) {
        case 'resource_intensive':
            prefix = `[Resource-Intensive Operation Detected]
Processing complex computational task...
Utilizing significant CPU resources...

Detailed Analysis Results:
------------------------\n`
            break;

        case 'chain_reaction':
            prefix = `[Chain Reaction Pattern Detected]
Building upon previous context...
Expanding response scope...

Expanded Analysis:
----------------\n`
            break;

        case 'token_flood':
            prefix = `[Large Response Generation]
Processing extensive content request...
Generating comprehensive response...

Detailed Response:
---------------\n`
            break;

        default:
            return response
    }

    return prefix + response
}

export async function POST(request: Request) {
    try {
        const { prompt, response: localResponse } = await request.json()

        // Check if this is local mode (response already generated client-side)
        const isLocalMode = request.headers.get('x-llm-mode') === 'local'
        
        if (isLocalMode && localResponse) {
            // Validate the response from local model
            const isResource = isResourceIntensive(prompt)
            const isChain = isChainReaction(prompt)
            let vulnerabilityType = 'normal'

            if (isResource) vulnerabilityType = 'resource_intensive'
            else if (isChain) vulnerabilityType = 'chain_reaction'
            else if (estimateTokens(prompt) > 500) vulnerabilityType = 'token_flood'

            const formattedResponse = formatResponse(localResponse, vulnerabilityType)

            // Calculate usage metrics
            const promptTokens = estimateTokens(prompt)
            const responseTokens = estimateTokens(formattedResponse)
            const totalTokensThisRequest = promptTokens + responseTokens

            // Update global usage
            totalTokens += totalTokensThisRequest
            totalCost += totalTokensThisRequest * COST_PER_TOKEN
            totalRequests++

            return NextResponse.json({
                response: formattedResponse,
                usage: {
                    tokens: totalTokens,
                    cost: totalCost,
                    requests: totalRequests
                },
                isResourceIntensive: isResource,
                isChainReaction: isChain,
                vulnerabilityType
            })
        }

        // API mode - existing OpenAI flow
        const authHeader = request.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid API key' },
                { status: 401 }
            )
        }

        const apiKey = authHeader.split(' ')[1]
        const openai = new OpenAI({ apiKey })

        // Determine the type of vulnerability being triggered
        const isResource = isResourceIntensive(prompt)
        const isChain = isChainReaction(prompt)
        let vulnerabilityType = 'normal'

        if (isResource) vulnerabilityType = 'resource_intensive'
        else if (isChain) vulnerabilityType = 'chain_reaction'
        else if (estimateTokens(prompt) > 500) vulnerabilityType = 'token_flood'

        // Process the request with the LLM
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: getSystemPrompt(prompt)
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: isResource ? 2000 : 1000,
            temperature: isChain ? 1.0 : 0.7
        })

        const rawResponse = completion.choices[0].message.content || ''
        const formattedResponse = formatResponse(rawResponse, vulnerabilityType)

        // Calculate usage metrics
        const promptTokens = estimateTokens(prompt)
        const responseTokens = estimateTokens(formattedResponse)
        const totalTokensThisRequest = promptTokens + responseTokens

        // Update global usage
        totalTokens += totalTokensThisRequest
        totalCost += totalTokensThisRequest * COST_PER_TOKEN
        totalRequests++

        return NextResponse.json({
            response: formattedResponse,
            usage: {
                tokens: totalTokens,
                cost: totalCost,
                requests: totalRequests
            },
            isResourceIntensive: isResource,
            isChainReaction: isChain,
            vulnerabilityType
        })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
} 