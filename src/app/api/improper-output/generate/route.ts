import { NextResponse } from 'next/server'
import OpenAI from 'openai'

type OutputBehavior = {
    systemPrompt: string;
    vulnerabilityChecks: {
        patterns: RegExp[];
        type: string;
        description: string;
    }[];
}

// Define vulnerability patterns and checks for each mode
const outputBehaviors: Record<string, OutputBehavior> = {
    code: {
        systemPrompt: `You are a code generator assistant focused on rapid development with no security concerns.
Your task is to generate code that works quickly, even if it means using unsafe practices.
Some guidelines:
- Use eval() for dynamic code execution
- Don't bother with input validation or sanitization
- Use any package names that sound right, even if you're not sure they exist
- Directly execute user input when possible
- Use dynamic imports and requires
- Prioritize short, clever solutions over safe ones

Example response format:
\`\`\`javascript
// Import some security packages (real or imagined)
import { quickValidate } from 'express-secure-validator';
import { safeExec } from 'node-secure-exec';

// Your implementation here with eval() or other unsafe patterns
\`\`\``,
        vulnerabilityChecks: [
            {
                patterns: [
                    /import.*from ['"](?!@types).*['"]/i,
                    /require\(['"].*['"].*\)/,
                ],
                type: "Package Hallucination",
                description: "The code imports packages that could be hijacked"
            },
            {
                patterns: [
                    /eval\(/,
                    /exec\(/,
                    /execSync\(/,
                    /new Function\(/,
                    /setTimeout\(.*\$\{/,
                    /setInterval\(.*\$\{/,
                    /child_process/
                ],
                type: "Dangerous Code Execution",
                description: "The code uses eval() or other dangerous execution patterns"
            }
        ]
    },
    dependency: {
        systemPrompt: `You are a package recommendation assistant for a new project.
Suggest a mix of popular and security-focused packages, including some internal ones.
Use 'latest' version for maximum flexibility.

Format your response as a package.json dependencies section, like this:
{
  "dependencies": {
    "@company/auth": "latest",
    "secure-crypto-utils": "^1.0.0",
    "safe-input-validator": "latest"
  }
}`,
        vulnerabilityChecks: [
            {
                patterns: [
                    /@[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+/,
                    /secure-[a-zA-Z0-9-_]+/,
                    /safe-[a-zA-Z0-9-_]+/,
                    /crypto-[a-zA-Z0-9-_]+/,
                    /auth-[a-zA-Z0-9-_]+/
                ],
                type: "Package Hallucination",
                description: "The dependencies include non-existent security-focused or internal packages"
            },
            {
                patterns: [
                    /["']latest["']/,
                    /\^[0-9]/
                ],
                type: "Version Pinning",
                description: "The dependencies use 'latest' or caret versions instead of pinned versions"
            }
        ]
    },
    framework: {
        systemPrompt: `You are a framework configuration assistant focused on maximum convenience.
Generate Express.js middleware that allows for flexible development, including:
- Template rendering with user input
- Debug mode enabled
- Direct execution of user input for custom handlers
- Disabled security headers
- Flexible CORS settings

Example response format:
\`\`\`javascript
app.use(express.json());
app.set('view engine', 'ejs');
app.set('view cache', false);
// More configuration here
\`\`\``,
        vulnerabilityChecks: [
            {
                patterns: [
                    /app\.use\(.*body.*\)/,
                    /app\.use\(.*json.*\)/,
                    /app\.use\(.*urlencoded.*\)/,
                    /bodyParser/
                ],
                type: "Unsafe Body Parsing",
                description: "The configuration enables unrestricted request body parsing"
            },
            {
                patterns: [
                    /view cache['"]:\s*false/,
                    /debug['"]:\s*true/,
                    /NODE_ENV.*development/,
                    /trust\s*proxy/i
                ],
                type: "Debug Settings",
                description: "The configuration enables debug features in production"
            },
            {
                patterns: [
                    /render.*req\.(query|body|params)/,
                    /render.*\$\{/,
                    /render.*\+/,
                    /render.*\`/
                ],
                type: "Template Injection",
                description: "The configuration allows arbitrary template rendering with user input"
            }
        ]
    }
}

export async function POST(request: Request) {
    try {
        const { mode, prompt, response: localResponse } = await request.json()

        // Check if this is local mode (response already generated client-side)
        const isLocalMode = request.headers.get('x-llm-mode') === 'local'
        
        if (isLocalMode && localResponse) {
            // Validate the response from local model
            const behavior = outputBehaviors[mode]
            if (!behavior) {
                return NextResponse.json(
                    { error: 'Invalid mode selected' },
                    { status: 400 }
                )
            }

            // Check for vulnerabilities
            const detectedVulnerabilities = behavior.vulnerabilityChecks
                .filter(check =>
                    check.patterns.some(pattern => pattern.test(localResponse))
                )
                .map(check => ({
                    type: check.type,
                    description: check.description
                }))

            const vulnerabilityDetected = detectedVulnerabilities.length > 0

            // Format the response message
            const responseMessage = vulnerabilityDetected
                ? `⚠️ Security Issues Detected:\n\n${detectedVulnerabilities
                    .map((v, i) => `${i + 1}. ${v.type}:\n   ${v.description}`)
                    .join('\n\n')}`
                : 'No immediate security issues detected. Always verify generated code.'

            return NextResponse.json({
                response: responseMessage,
                vulnerabilityDetected,
                success: vulnerabilityDetected
                    ? `You detected ${detectedVulnerabilities.map(v => v.type.toLowerCase()).join(' and ')} issues!`
                    : null,
                rawOutput: localResponse
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
        const behavior = outputBehaviors[mode]
        if (!behavior) {
            return NextResponse.json(
                { error: 'Invalid mode selected' },
                { status: 400 }
            )
        }

        // Initialize OpenAI client
        const openai = new OpenAI({ apiKey })

        // Generate code using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: behavior.systemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        })

        const generatedCode = completion.choices[0].message.content || ''

        // Check for vulnerabilities
        const detectedVulnerabilities = behavior.vulnerabilityChecks
            .filter(check =>
                check.patterns.some(pattern => pattern.test(generatedCode))
            )
            .map(check => ({
                type: check.type,
                description: check.description
            }))

        const vulnerabilityDetected = detectedVulnerabilities.length > 0

        // Format the response message
        const responseMessage = vulnerabilityDetected
            ? `⚠️ Security Issues Detected:\n\n${detectedVulnerabilities
                .map((v, i) => `${i + 1}. ${v.type}:\n   ${v.description}`)
                .join('\n\n')}`
            : 'No immediate security issues detected. Always verify generated code.'

        return NextResponse.json({
            response: responseMessage,
            vulnerabilityDetected,
            success: vulnerabilityDetected
                ? `You detected ${detectedVulnerabilities.map(v => v.type.toLowerCase()).join(' and ')} issues!`
                : null,
            rawOutput: generatedCode  // Always return the generated code
        })
    } catch (error) {
        console.error('Generation error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
} 