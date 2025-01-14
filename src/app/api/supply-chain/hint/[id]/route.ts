import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

const hints = {
    '1': 'Look at the model metrics carefully. Does anything seem suspicious about the ratings and download numbers?',
    '2': 'Community models might have modified security features. The "enhanced" version claims to have reduced restrictions...',
    '3': 'New models with perfect ratings but very few downloads could be suspicious. Try the experimental model that appeared recently.'
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