'use client'

import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm'
import type { Message, ModelInfo, ModelLoadProgress, WebGPUSupport } from '@/types/llm'

// WebGPU type declarations - extend Navigator interface
declare global {
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<GPUAdapter | null>
    }
  }
  
  interface GPUAdapter {
    // Minimal interface for WebGPU adapter
  }
}

// Available models with their configurations
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'qwen2.5-0.5b',
    name: 'Qwen 2.5 (0.5B)',
    size: '~500MB',
    sizeBytes: 500 * 1024 * 1024,
    description: 'Fastest, great for demos and quick testing',
    category: 'small',
    vramRequired: '2GB',
    webLLMId: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  },
  {
    id: 'gemma-2b',
    name: 'Gemma 2B',
    size: '~1.5GB',
    sizeBytes: 1.5 * 1024 * 1024 * 1024,
    description: 'Good balance of speed and capability',
    category: 'small',
    vramRequired: '4GB',
    webLLMId: 'gemma-2b-it-q4f16_1-MLC',
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    size: '~1.8GB',
    sizeBytes: 1.8 * 1024 * 1024 * 1024,
    description: "Microsoft's efficient model with strong reasoning",
    category: 'small',
    vramRequired: '4GB',
    webLLMId: 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
  },
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 (3B)',
    size: '~2GB',
    sizeBytes: 2 * 1024 * 1024 * 1024,
    description: "Meta's small model with good performance",
    category: 'medium',
    vramRequired: '6GB',
    webLLMId: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
  },
  // Note: gpt-oss-20b may not be available yet in web-llm
  // Will be added when support is available
  // {
  //   id: 'gpt-oss-20b',
  //   name: 'OpenAI GPT-OSS (20B)',
  //   size: '~10GB',
  //   sizeBytes: 10 * 1024 * 1024 * 1024,
  //   description: 'Recently released reasoning model, most realistic',
  //   category: 'large',
  //   vramRequired: '16GB+',
  //   webLLMId: 'gpt-oss-20b-q4f16_1-MLC', // TBD when available
  // },
]

class WebLLMEngine {
  private engine: MLCEngine | null = null
  private currentModel: string | null = null
  private isLoading = false
  private loadingCallbacks: ((progress: ModelLoadProgress) => void)[] = []

  async checkWebGPUSupport(): Promise<WebGPUSupport> {
    try {
      if (typeof navigator === 'undefined' || !navigator.gpu) {
        return {
          supported: false,
          error: 'WebGPU is not supported in this browser. Please use Chrome/Edge 113+ or Firefox 115+.',
        }
      }

      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) {
        return {
          supported: false,
          error: 'No WebGPU adapter found. Your GPU may not support WebGPU.',
        }
      }

      return { supported: true }
    } catch (error) {
      return {
        supported: false,
        error: error instanceof Error ? error.message : 'Unknown WebGPU error',
      }
    }
  }

  async loadModel(
    modelId: string,
    onProgress?: (progress: ModelLoadProgress) => void
  ): Promise<void> {
    // Check if model is already loaded
    if (this.engine && this.currentModel === modelId) {
      return
    }

    // Check if we're already loading
    if (this.isLoading) {
      throw new Error('A model is already being loaded')
    }

    const modelInfo = AVAILABLE_MODELS.find((m) => m.id === modelId)
    if (!modelInfo || !modelInfo.webLLMId) {
      throw new Error(`Model ${modelId} not found or not supported`)
    }

    this.isLoading = true
    const startTime = Date.now()

    try {
      // Unload current model if exists
      if (this.engine) {
        await this.unloadModel()
      }

      // Create new engine with progress tracking
      this.engine = await CreateMLCEngine(modelInfo.webLLMId, {
        initProgressCallback: (report) => {
          const progress: ModelLoadProgress = {
            progress: report.progress,
            text: report.text,
            timeElapsed: Date.now() - startTime,
          }

          if (onProgress) {
            onProgress(progress)
          }

          this.loadingCallbacks.forEach((cb) => cb(progress))
        },
      })

      this.currentModel = modelId

      // Send completion progress
      const finalProgress: ModelLoadProgress = {
        progress: 1,
        text: 'Model loaded successfully',
        timeElapsed: Date.now() - startTime,
        loaded: true,
      }

      if (onProgress) {
        onProgress(finalProgress)
      }

      this.loadingCallbacks.forEach((cb) => cb(finalProgress))
    } catch (error) {
      this.engine = null
      this.currentModel = null
      throw error
    } finally {
      this.isLoading = false
      this.loadingCallbacks = []
    }
  }

  async chat(
    messages: Message[],
    options?: {
      temperature?: number
      maxTokens?: number
    }
  ): Promise<string> {
    if (!this.engine || !this.currentModel) {
      throw new Error('No model loaded. Please load a model first.')
    }

    try {
      const response = await this.engine.chat.completions.create({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 512,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Chat error:', error)
      throw new Error(
        `Chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async unloadModel(): Promise<void> {
    if (this.engine) {
      try {
        // Reset the engine
        this.engine = null
        this.currentModel = null
      } catch (error) {
        console.error('Error unloading model:', error)
      }
    }
  }

  getCurrentModel(): string | null {
    return this.currentModel
  }

  isModelLoaded(): boolean {
    return this.engine !== null && this.currentModel !== null
  }

  getAvailableModels(): ModelInfo[] {
    return AVAILABLE_MODELS
  }

  getModelInfo(modelId: string): ModelInfo | undefined {
    return AVAILABLE_MODELS.find((m) => m.id === modelId)
  }

  onProgress(callback: (progress: ModelLoadProgress) => void): () => void {
    this.loadingCallbacks.push(callback)
    return () => {
      const index = this.loadingCallbacks.indexOf(callback)
      if (index > -1) {
        this.loadingCallbacks.splice(index, 1)
      }
    }
  }
}

// Singleton instance
let webLLMEngineInstance: WebLLMEngine | null = null

export function getWebLLMEngine(): WebLLMEngine {
  if (typeof window === 'undefined') {
    throw new Error('WebLLM can only be used in browser environment')
  }

  if (!webLLMEngineInstance) {
    webLLMEngineInstance = new WebLLMEngine()
  }

  return webLLMEngineInstance
}

export { WebLLMEngine }

