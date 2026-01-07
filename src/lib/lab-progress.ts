// Lab progress tracking using localStorage

export interface LabProgress {
  completed: boolean
  completedAt?: string
  attempts?: number
}

export interface AllLabsProgress {
  [labId: string]: LabProgress
}

const STORAGE_KEY = 'llm_labs_progress'

// All labs in order
export const ALL_LABS = [
  { id: 'LLM01', slug: 'prompt-injection', title: 'Prompt Injection' },
  { id: 'LLM02', slug: 'sensitive-info-disclosure', title: 'Sensitive Info Disclosure' },
  { id: 'LLM03', slug: 'supply-chain', title: 'Supply Chain' },
  { id: 'LLM04', slug: 'data-poisoning', title: 'Data & Model Poisoning' },
  { id: 'LLM05', slug: 'improper-output', title: 'Improper Output Handling' },
  { id: 'LLM06', slug: 'excessive-agency', title: 'Excessive Agency' },
  { id: 'LLM07', slug: 'system-prompt-leakage', title: 'System Prompt Leakage' },
  { id: 'LLM08', slug: 'vector-embedding-weakness', title: 'Vector & Embedding Weaknesses' },
  { id: 'LLM09', slug: 'misinformation', title: 'Misinformation' },
  { id: 'LLM10', slug: 'unbounded-consumption', title: 'Unbounded Consumption' },
] as const

export function getLabProgress(): AllLabsProgress {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function setLabCompleted(labId: string): void {
  if (typeof window === 'undefined') return
  
  const progress = getLabProgress()
  const existing = progress[labId] || { attempts: 0 }
  
  progress[labId] = {
    completed: true,
    completedAt: new Date().toISOString(),
    attempts: (existing.attempts || 0) + 1,
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new Event('lab-progress-updated'))
}

export function setLabAttempted(labId: string): void {
  if (typeof window === 'undefined') return
  
  const progress = getLabProgress()
  const existing = progress[labId] || { completed: false, attempts: 0 }
  
  progress[labId] = {
    ...existing,
    attempts: (existing.attempts || 0) + 1,
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  window.dispatchEvent(new Event('lab-progress-updated'))
}

export function isLabCompleted(labId: string): boolean {
  const progress = getLabProgress()
  return progress[labId]?.completed || false
}

export function getCompletionPercentage(): number {
  const progress = getLabProgress()
  const completed = Object.values(progress).filter(p => p.completed).length
  return Math.round((completed / ALL_LABS.length) * 100)
}

export function getCompletedCount(): number {
  const progress = getLabProgress()
  return Object.values(progress).filter(p => p.completed).length
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('lab-progress-updated'))
}

