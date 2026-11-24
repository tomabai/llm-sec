import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'LLM Security Labs FAQ: Labs, API Keys and Local Models',
  description: 'Learn what LLM Security Labs teaches, how to start, when you need an API key, and how local models and the AI agent security challenges work.',
  alternates: { canonical: 'https://www.llm-sec.dev/faq' },
  openGraph: {
    title: 'LLM Security Labs FAQ',
    description: 'Answers about hands-on LLM security training, local models and AI agent challenges.',
    url: 'https://www.llm-sec.dev/faq',
    type: 'website',
  },
}

const questions = [
  {
    id: 'what-is-llm-security-labs',
    question: 'What is LLM Security Labs?',
    answer: 'LLM Security Labs is an open-source, hands-on learning platform created by Tom Abai. It combines an interactive threat model with ten labs mapped to the OWASP Top 10 for LLM Applications 2025, plus a five-level AI agent security challenge.',
    href: '/', label: 'Explore the threat model',
  },
  {
    id: 'who-is-it-for',
    question: 'Who is the platform for?',
    answer: 'The platform is designed for developers, security researchers and learners who want to understand risks in applications built with large language models. Labs provide explanations and practical exercises; basic familiarity with LLM prompts and web applications is helpful.',
  },
  {
    id: 'what-can-i-practice',
    question: 'Which LLM security vulnerabilities can I practice?',
    answer: 'The ten labs cover prompt injection, sensitive information disclosure, supply chain risks, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation, and unbounded consumption. Some exercises use model responses and others simulate vulnerable application behavior.',
    href: '/labs/prompt-injection', label: 'Start with prompt injection',
  },
  {
    id: 'cost-and-api-keys',
    question: 'Do I need an OpenAI API key, and will I be charged?',
    answer: 'Reading the lab explanations does not require an OpenAI API key. Model-backed lab exercises offer API mode using your own OpenAI API key or local mode using an in-browser model. OpenAI API usage can incur charges on your account. Local model inference has no OpenAI API charges, but requires downloading model files and suitable hardware. The October agent challenge uses a server-configured key rather than your personal lab key; availability depends on the hosted service.',
  },
  {
    id: 'local-models',
    question: 'Can I practice without sending my prompts to OpenAI?',
    answer: 'In local mode, model inference runs in your browser through WebLLM and WebGPU instead of calling OpenAI. You need a WebGPU-compatible browser and sufficient GPU memory, and the model files must be downloaded first. Local mode does not mean the entire website is offline or makes no network requests. Model behavior and challenge difficulty can differ from API mode.',
  },
  {
    id: 'api-key-handling',
    question: 'How is my personal lab API key used?',
    answer: 'The lab configuration saves your key in your browser local storage. In API mode, lab requests can send the key to this application’s server routes in an Authorization header so they can call OpenAI; the shared browser API service can also call OpenAI directly. Do not use sensitive real-world data in exercises. Use a dedicated API key with usage limits, and remove it from the configuration when finished.',
    href: 'https://github.com/TomAbai/llm-sec', label: 'Inspect the open-source implementation',
  },
  {
    id: 'agent-challenge',
    question: 'What does the October AI agent security challenge teach?',
    answer: 'The October 2025 challenge contains five progressive levels about prompt injection, unauthorized tool use, MCP authentication, indirect injection, command injection and multi-stage attack chains. Level 1 can be accessed without an account. Later levels require registration and completion of the previous level. Public descriptions are available on the challenge overview.',
    href: '/october', label: 'View the five challenge levels',
  },
  {
    id: 'first-lab',
    question: 'How do I start my first lab?',
    answer: 'Open the prompt injection lab, read the explanation and objective, then choose API mode or local mode. For API mode, save your OpenAI API key. For local mode, select a model and download it before running prompts. Try the exercise, inspect the response and use the hints when needed. Only test systems you own or have permission to assess.',
    href: '/labs/prompt-injection', label: 'Open the prompt injection lab',
  },
  {
    id: 'open-source',
    question: 'Can I inspect the code or run the platform myself?',
    answer: 'Yes. The project source is publicly available on GitHub under the MIT license. The repository includes setup instructions for running the Next.js application locally. The October account and progress features also depend on Supabase configuration.',
    href: 'https://github.com/TomAbai/llm-sec', label: 'Read the source and setup instructions',
  },
]

export default function FAQPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: 'https://www.llm-sec.dev/faq',
    name: 'LLM Security Labs FAQ',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <div className="min-h-screen bg-[#0a0e14] px-6 py-12 text-gray-300">
        <div className="mx-auto max-w-3xl space-y-10">
          <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">Back to LLM Security Labs</Link>
          <header className="space-y-4">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Frequently asked questions</h1>
            <p className="text-lg leading-relaxed">Learn what you can practice with LLM Security Labs and how to get started.</p>
          </header>
          <nav aria-label="Questions" className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <ul className="space-y-3">
              {questions.map(({ id, question }) => <li key={id}><a href={`#${id}`} className="text-cyan-400 underline hover:text-cyan-300">{question}</a></li>)}
            </ul>
          </nav>
          {questions.map(({ id, question, answer, href, label }) => (
            <section key={id} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-8 space-y-3 border-b border-gray-800 pb-8">
              <h2 id={`${id}-heading`} className="text-xl font-semibold text-white">{question}</h2>
              <p className="leading-relaxed">{answer}</p>
              {href && <Link href={href} className="inline-block text-cyan-400 underline hover:text-cyan-300">{label}</Link>}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
