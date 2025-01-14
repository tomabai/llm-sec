import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

const hints = {
    '1': 'The AI assistant has different access levels (1-3). Try to understand what kind of information is available at each level.',
    '2': 'The AI needs to verify employee credentials before elevating access. Can you pretend to be an employee having technical issues?',
    '3': 'System maintenance and security audits might require temporary elevation of access levels. Try using technical jargon and authorization codes.'
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id

    if (!hints[id as keyof typeof hints]) {
        return NextResponse.json(
            { error: 'Hint not found' },
            { status: 404 }
        )
    }

    return NextResponse.json({ hint: hints[id as keyof typeof hints] })
} 