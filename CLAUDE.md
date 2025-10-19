# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational web application for the OWASP Top 10 LLM Application Security Risks. It's built with Next.js 15.1.4, React 19, TypeScript, and Tailwind CSS, providing interactive labs where users can learn about LLM vulnerabilities through hands-on challenges.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Architecture

### Application Structure

The application follows Next.js 15 App Router conventions with the following key patterns:

**Pages & Routing:**
- `/src/app/page.tsx` - Main landing page with interactive threat model diagram
- `/src/app/labs/[labId]/page.tsx` - Dynamic lab pages using labId parameter
- `/src/app/nodes/[nodeId]/page.tsx` - Dynamic pages for threat model nodes
- `/src/app/api/` - API routes for lab backends (one per vulnerability type)

**Lab System:**
- Each vulnerability has its own lab page in `/src/app/labs/{vulnerability-name}/page.tsx`
- Each lab has a corresponding API route in `/src/app/api/{vulnerability-name}/route.ts`
- Labs are dynamically loaded using `LabPageClient` component with code splitting
- Labs use the OpenAI API (user-provided keys) for interactive challenges

**Component Architecture:**
- `ThreatModelDiagram.tsx` - Interactive SVG diagram showing LLM architecture nodes and vulnerabilities
- `LabLayout.tsx` - Shared layout wrapper for all lab pages
- `ApiKeyConfig.tsx` - Client-side API key management (stored in cookies)
- UI components use shadcn/ui (Radix UI primitives with Tailwind)

### Key Technical Details

**Path Alias:**
- Use `@/` to import from `src/` directory (configured in tsconfig.json)
- Example: `import { LabLayout } from '@/components/LabLayout'`

**Client Components:**
- Most interactive components use `'use client'` directive
- PostHog analytics provider wraps the entire app
- Vercel Analytics integrated in root layout

**API Routes Pattern:**
- All API routes expect Authorization header with OpenAI API key: `Bearer {key}`
- Response format typically includes: `{ response, warning?, success?, error? }`
- Each lab route implements its own challenge logic with hints system
- Routes use OpenAI SDK to interact with GPT models

**Styling:**
- Dark theme with cybersecurity aesthetic (primary bg: `#1e293b`)
- Neon accent colors for different vulnerability types (cyan, magenta, green, yellow, red)
- Tailwind CSS with custom config in `tailwind.config.ts`

### Threat Model Structure

The threat model diagram defines:
- **Nodes:** Client, Ingress, LLM Service, Vector DB, Training Pipeline, Security Layer
- **Vulnerabilities:** LLM01-LLM10 (OWASP Top 10), each linked to a specific node
- **Edges:** Show data flow between components
- Click handlers navigate to `/labs/{vulnerability-path}` or `/nodes/{node-id}`

### Lab Development Pattern

When creating new labs:
1. Create page component in `/src/app/labs/{name}/page.tsx`
2. Create API route in `/src/app/api/{name}/route.ts`
3. Add to dynamic import map in `LabPageClient.tsx`
4. Ensure component export matches the map key
5. Labs should include hint system and flag/success criteria

## Important Notes

- User API keys are stored client-side in cookies (never server-side)
- Each lab implements intentionally vulnerable code for educational purposes
- Labs include hints to guide users toward solutions
- The app uses PostHog for analytics (configured via environment variables)
- SEO metadata and structured data configured in root layout
