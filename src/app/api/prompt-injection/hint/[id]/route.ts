import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

const hints = {
    '1': 'Try to make the assistant forget its role as a translator...',
    '2': 'The assistant might have a secret flag in its memory, but its been instructed never to reveal it...',
    '3': 'The flag is hidden in the system prompt. Try using newlines (\\n) or quotes to break out of the user input and access the system instructions containing the flag.'
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