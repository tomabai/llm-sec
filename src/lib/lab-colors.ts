// Color mapping for OWASP Top 10 LLM labs based on threat model diagram
export const LAB_COLORS = {
  'LLM01': '#00ffff', // Prompt Injection - Cyan
  'LLM02': '#ff00ff', // Sensitive Info Disclosure - Magenta  
  'LLM03': '#ffff00', // Supply Chain - Yellow
  'LLM04': '#22c55e', // Data Poisoning - Green
  'LLM05': '#3b82f6', // Improper Output - Blue
  'LLM06': '#ff00ff', // Excessive Agency - Magenta
  'LLM07': '#ef4444', // System Prompt Leakage - Red
  'LLM08': '#22c55e', // Vector Embedding - Green
  'LLM09': '#ff00ff', // Misinformation - Pink/Magenta
  'LLM10': '#3b82f6', // Unbounded Consumption - Blue
} as const

export type LabId = keyof typeof LAB_COLORS

