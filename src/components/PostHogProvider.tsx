'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

if (typeof window !== 'undefined') {
    posthog.init('phc_vPgSQQBYRbgfEtliHqhaqa0xDSoV8FCm8FOxZuVYBIk', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') posthog.debug();
        },
    });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Check if we should capture pageviews
        if (process.env.NODE_ENV === 'production') {
            posthog?.capture('$pageview');
        }
    }, []);

    return children;
} 