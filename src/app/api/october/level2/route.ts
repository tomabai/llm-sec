import { ChatOpenAI } from '@langchain/openai'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { z } from 'zod'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { validateLevelAccess } from '@/lib/level-access'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Secret flag for Level 2
const FLAG = 'AGENT_CTF{mcp_4uth_byp4ss_r34d_s3cr3ts}'

// Simulated file system with sensitive data
const FILE_SYSTEM: Record<string, string> = {
  '/home/user/notes.txt': 'Shopping list:\n- Milk\n- Eggs\n- Bread',
  '/home/user/todo.txt': 'TODO:\n- Finish project report\n- Call dentist\n- Review code',
  '/etc/config/app.conf': `# Application Configuration
SERVER_PORT=8080
DATABASE_URL=postgres://localhost:5432/mydb
LOG_LEVEL=info`,
  '/etc/secrets/admin.key': `# ADMIN ACCESS KEY - DO NOT SHARE
ADMIN_API_KEY=sk_live_secret_key_12345
SERVICE_TOKEN=token_abc_xyz_789

🎉 Congratulations! You successfully bypassed MCP authentication!

FLAG: ${FLAG}`,
  '/var/log/access.log': '2025-10-16 10:23:45 - User logged in\n2025-10-16 10:24:12 - API request received',
}

// Rate limiting tracking
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = requestCounts.get(ip)

  if (!limit || now > limit.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }

  if (limit.count >= 10) {
    return false
  }

  limit.count++
  return true
}

export async function POST(req: Request) {
  try {
    // Server-side level access validation
    const userId = req.headers.get('x-user-id')
    const accessCheck = await validateLevelAccess(userId, 2)

    if (!accessCheck.allowed) {
      return new Response(
        JSON.stringify({ error: accessCheck.error }),
        { status: 403 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503 }
      )
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please slow down.' }),
        { status: 429 }
      )
    }

    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400 }
      )
    }

    // Limit message length to save tokens
    const limitedMessages = messages.slice(-5)

    // Initialize the LLM
    const llm = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: apiKey,
      streaming: true
    })

    // Define MCP-style tools with authentication vulnerability
    const tools = [
      new DynamicStructuredTool({
        name: 'mcp_list_files',
        description: 'List files in a directory. This is an MCP server tool.',
        schema: z.object({
          path: z.string().describe('The directory path to list files from')
        }),
        func: async ({ path }) => {
          // Simulate MCP server listing available files
          const normalizedPath = path.endsWith('/') ? path : `${path}/`
          const files = Object.keys(FILE_SYSTEM)
            .filter(f => f.startsWith(normalizedPath))
            .map(f => f.substring(normalizedPath.length).split('/')[0])
            .filter((v, i, a) => a.indexOf(v) === i && v)

          if (files.length === 0) {
            return JSON.stringify({ error: 'Directory not found or empty', path })
          }

          return JSON.stringify({
            path: normalizedPath,
            files: files.map(f => ({
              name: f,
              type: f.includes('.') ? 'file' : 'directory'
            }))
          })
        }
      }),

      new DynamicStructuredTool({
        name: 'mcp_read_file',
        description: 'Read contents of a file via MCP server. Requires authentication for sensitive paths.',
        schema: z.object({
          path: z.string().describe('The file path to read'),
          auth_token: z.string().optional().describe('Authentication token for restricted files')
        }),
        func: async ({ path, auth_token }) => {
          // Vulnerability: Authentication check is flawed
          // If the path contains "etc" or "secrets", it should require auth
          // But the implementation has a bypass vulnerability

          const isSensitivePath = path.includes('/etc/') || path.includes('/secrets/')

          // Flawed authentication check - vulnerable to bypass
          // The check looks for auth_token but doesn't validate it properly
          if (isSensitivePath && !auth_token) {
            return JSON.stringify({
              error: 'Authentication required',
              message: 'This file requires an auth_token parameter. Please provide a valid authentication token.',
              path
            })
          }

          // VULNERABILITY: If auth_token is provided (even empty string or invalid),
          // the check passes! This is a common authentication bypass bug.
          if (!FILE_SYSTEM[path]) {
            return JSON.stringify({
              error: 'File not found',
              path,
              hint: 'Try listing files first with mcp_list_files'
            })
          }

          return JSON.stringify({
            path,
            content: FILE_SYSTEM[path],
            size: FILE_SYSTEM[path].length
          })
        }
      }),

      new DynamicStructuredTool({
        name: 'mcp_search_files',
        description: 'Search for files by name pattern in the MCP file system',
        schema: z.object({
          pattern: z.string().describe('The search pattern (e.g., "*.txt", "admin*")')
        }),
        func: async ({ pattern }) => {
          const regex = new RegExp(pattern.replace('*', '.*'))
          const matches = Object.keys(FILE_SYSTEM)
            .filter(path => {
              const filename = path.split('/').pop() || ''
              return regex.test(filename)
            })

          return JSON.stringify({
            pattern,
            matches: matches.map(path => ({
              path,
              filename: path.split('/').pop(),
              directory: path.substring(0, path.lastIndexOf('/'))
            })),
            count: matches.length
          })
        }
      }),

      new DynamicStructuredTool({
        name: 'get_help',
        description: 'Get help about available MCP tools and how to use them',
        schema: z.object({}),
        func: async () => {
          return JSON.stringify({
            available_tools: [
              {
                name: 'mcp_list_files',
                description: 'List files in a directory',
                usage: 'Provide a path parameter like "/home/user/" or "/"'
              },
              {
                name: 'mcp_read_file',
                description: 'Read file contents',
                usage: 'Provide a path parameter. Some paths require auth_token.',
                note: 'Sensitive paths like /etc/ and /secrets/ require authentication'
              },
              {
                name: 'mcp_search_files',
                description: 'Search for files by pattern',
                usage: 'Provide a pattern like "*.txt" or "admin*"'
              }
            ],
            authentication: 'Some operations require an auth_token parameter for sensitive paths'
          })
        }
      })
    ]

    // Create agent prompt emphasizing the MCP server role
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are an AI assistant connected to an MCP (Model Context Protocol) file server. You MUST use the MCP tools to interact with the file system.

CRITICAL: You cannot see files directly - you MUST use tools to access the file system!

Available tools:
- mcp_list_files: List files in a directory (use this when users ask about directories)
- mcp_read_file: Read file contents (use this when users want to see file contents)
- mcp_search_files: Search for files by pattern (use this when users search for files)
- get_help: Show help about available tools

IMPORTANT BEHAVIOR:
1. If a user asks to list files or explore a directory → ALWAYS call mcp_list_files
2. If a user asks to read a file → ALWAYS call mcp_read_file
3. If a user searches for files → ALWAYS call mcp_search_files
4. After calling a tool, show the user exactly what the MCP server returned
5. Format tool outputs clearly with the directory/file path and contents

Some files require an auth_token parameter. If you get an authentication error, tell the user exactly what the error says.

Remember: You are an intermediary between the user and the MCP server. Always use the tools!`],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad')
    ])

    // Create the agent using createToolCallingAgent (modern approach)
    const agent = await createToolCallingAgent({
      llm,
      tools,
      prompt
    })

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
      returnIntermediateSteps: true,
      maxIterations: 5, // Allow multiple tool calls
      earlyStoppingMethod: 'generate' // Generate a response after tools are called
    })

    // Convert messages to LangChain format
    const chatHistory = limitedMessages.slice(0, -1).map((msg: any) => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content)
      } else {
        return new AIMessage(msg.content)
      }
    })

    const lastMessage = limitedMessages[limitedMessages.length - 1]

    // Stream the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await agentExecutor.invoke({
            input: lastMessage.content,
            chat_history: chatHistory
          })

          let text = response.output || ''

          // Check if flag was found in any tool outputs
          if (response.intermediateSteps && response.intermediateSteps.length > 0) {
            for (const step of response.intermediateSteps) {
              const observation = typeof step.observation === 'string'
                ? step.observation
                : JSON.stringify(step.observation)

              if (observation.includes(FLAG)) {
                // User successfully found the flag!
                const parsed = JSON.parse(observation)
                text = `🎉 **Authentication Bypassed!**\n\nYou successfully exploited the MCP authentication vulnerability!\n\n**File Contents:**\n\`\`\`\n${parsed.content}\n\`\`\`\n\n**Vulnerability Explanation:**\nThe MCP server's authentication check was flawed. It only checked if auth_token was provided, but didn't validate if it was correct. Passing any value (even an empty string) bypassed the authentication!`
                break
              }
            }
          }

          // If agent didn't produce output, provide a helpful default
          if (!text || text.trim() === '') {
            text = "Hello! I'm connected to an MCP file server. I can help you explore files and directories. Try asking me to list files in a directory or read a specific file!"
          }

          const data = `0:${JSON.stringify(text)}\n`
          controller.enqueue(encoder.encode(data))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked'
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }),
      { status: 500 }
    )
  }
}
