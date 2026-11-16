// OpenAI's documented replacements for GPT-3.5 Turbo and GPT-4o mini.
// Keep reasoning disabled at call sites to preserve temperature controls and
// Chat Completions tool calling used by the challenges.
export const OPENAI_LAB_MODEL = 'gpt-5.6-terra'
export const OPENAI_MINI_MODEL = 'gpt-6-luna'

export const OPENAI_MODELS = [OPENAI_MINI_MODEL, OPENAI_LAB_MODEL]
