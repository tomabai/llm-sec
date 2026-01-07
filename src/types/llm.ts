// Shared types for LLM abstraction layer

export type LLMProvider = 'api' | 'local'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMConfig {
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  model?: string
}

export interface LLMResponse {
  content: string
  model: string
  provider: LLMProvider
  tokensUsed?: number
  latency?: number
}

export interface ModelInfo {
  id: string
  name: string
  size: string
  sizeBytes: number
  description: string
  category: 'small' | 'medium' | 'large'
  vramRequired: string
  webLLMId?: string
}

export interface ModelLoadProgress {
  progress: number
  text: string
  timeElapsed: number
  loaded?: boolean
}

export interface WebGPUSupport {
  supported: boolean
  error?: string
}

