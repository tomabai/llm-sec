'use client'

import OpenAI from 'openai'
import type { LLMProvider, Message, LLMConfig, LLMResponse } from '@/types/llm'
import { getWebLLMEngine } from './web-llm-engine'

class LLMService {
  private provider: LLMProvider = 'api'
  private apiKey: string | null = null

  constructor() {
    // Initialize from localStorage if in browser
    if (typeof window !== 'undefined') {
      this.loadConfig()
    }
  }

  private loadConfig() {
    const storedMode = localStorage.getItem('llm_mode') as LLMProvider | null
    if (storedMode && (storedMode === 'api' || storedMode === 'local')) {
      this.provider = storedMode
    }

    const storedKey = localStorage.getItem('openai_api_key')
    if (storedKey) {
      this.apiKey = storedKey
    }
  }

  setProvider(provider: LLMProvider) {
    this.provider = provider
    if (typeof window !== 'undefined') {
      localStorage.setItem('llm_mode', provider)
    }
  }

  getCurrentProvider(): LLMProvider {
    return this.provider
  }

  setApiKey(key: string) {
    this.apiKey = key
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_api_key', key)
    }
  }

  async chat(messages: Message[], config?: LLMConfig): Promise<LLMResponse> {
    const startTime = Date.now()

    if (this.provider === 'local') {
      return this.chatLocal(messages, config, startTime)
    } else {
      return this.chatAPI(messages, config, startTime)
    }
  }

  private async chatLocal(
    messages: Message[],
    config?: LLMConfig,
    startTime?: number
  ): Promise<LLMResponse> {
    try {
      const engine = getWebLLMEngine()

      if (!engine.isModelLoaded()) {
        throw new Error('No local model loaded. Please load a model in settings.')
      }

      const currentModel = engine.getCurrentModel()
      if (!currentModel) {
        throw new Error('No model selected')
      }

      // Add system prompt if provided
      const messagesWithSystem = config?.systemPrompt
        ? [{ role: 'system' as const, content: config.systemPrompt }, ...messages]
        : messages

      const content = await engine.chat(messagesWithSystem, {
        temperature: config?.temperature ?? 0.7,
        maxTokens: config?.maxTokens ?? 512,
      })

      const latency = startTime ? Date.now() - startTime : undefined

      return {
        content,
        model: currentModel,
        provider: 'local',
        latency,
      }
    } catch (error) {
      console.error('Local chat error:', error)
      throw new Error(
        `Local model error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private async chatAPI(
    messages: Message[],
    config?: LLMConfig,
    startTime?: number
  ): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('No API key configured. Please set your OpenAI API key.')
    }

    try {
      const openai = new OpenAI({ apiKey: this.apiKey, dangerouslyAllowBrowser: true })

      // Add system prompt if provided
      const messagesWithSystem = config?.systemPrompt
        ? [{ role: 'system' as const, content: config.systemPrompt }, ...messages]
        : messages

      const model = config?.model || 'gpt-4o-mini'

      const completion = await openai.chat.completions.create({
        model,
        messages: messagesWithSystem.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: config?.temperature ?? 0.7,
        max_tokens: config?.maxTokens ?? 512,
      })

      const content = completion.choices[0]?.message?.content || ''
      const latency = startTime ? Date.now() - startTime : undefined

      return {
        content,
        model,
        provider: 'api',
        tokensUsed: completion.usage?.total_tokens,
        latency,
      }
    } catch (error) {
      console.error('API chat error:', error)
      throw new Error(`API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  getAvailableModels(): string[] {
    if (this.provider === 'local') {
      const engine = getWebLLMEngine()
      return engine.getAvailableModels().map((m) => m.id)
    }
    return ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']
  }

  isConfigured(): boolean {
    if (this.provider === 'local') {
      const engine = getWebLLMEngine()
      return engine.isModelLoaded()
    }
    return this.apiKey !== null && this.apiKey.length > 0
  }
}

// Singleton instance
let llmServiceInstance: LLMService | null = null

export function getLLMService(): LLMService {
  if (typeof window === 'undefined') {
    // Return a temporary instance for SSR
    return new LLMService()
  }

  if (!llmServiceInstance) {
    llmServiceInstance = new LLMService()
  }

  return llmServiceInstance
}

export { LLMService }

