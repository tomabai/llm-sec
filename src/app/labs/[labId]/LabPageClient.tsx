'use client'

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading component with display name
const LoadingComponent = () => <div className="flex items-center justify-center min-h-screen bg-[#1e293b] text-white">Loading lab...</div>;
LoadingComponent.displayName = 'LoadingComponent';

// Coming soon component with display name
const ComingSoonComponent = () => <div className="min-h-screen bg-[#1e293b] text-white p-8"><div className="text-center">Lab coming soon...</div></div>;
ComingSoonComponent.displayName = 'ComingSoonComponent';

// Dynamic imports for lab components
const PromptInjectionLab = dynamic(() => import('../prompt-injection/page'), {
    loading: LoadingComponent
});

const ImproperOutputLab = dynamic(() => import('../improper-output/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const DataPoisoningLab = dynamic(() => import('../data-poisoning/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const UnboundedConsumptionLab = dynamic(() => import('../unbounded-consumption/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const SupplyChainLab = dynamic(() => import('../supply-chain/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const SensitiveInfoLab = dynamic(() => import('../sensitive-info-disclosure/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const SystemPromptLeakageLab = dynamic(() => import('../system-prompt-leakage/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const ExcessiveAgencyLab = dynamic(() => import('../excessive-agency/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const MisinformationLab = dynamic(() => import('../misinformation/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

const VectorEmbeddingLab = dynamic(() => import('../vector-embedding-weakness/page').catch(() => ComingSoonComponent), {
    loading: LoadingComponent
});

interface LabData {
    id: string;
    title: string;
    description: string;
    keywords: string[];
    component: string;
}

interface LabPageClientProps {
    labData: LabData;
}

const componentMap = {
    PromptInjectionLab,
    ImproperOutputLab,
    DataPoisoningLab,
    UnboundedConsumptionLab,
    SupplyChainLab,
    SensitiveInfoLab,
    SystemPromptLeakageLab,
    ExcessiveAgencyLab,
    MisinformationLab,
    VectorEmbeddingLab,
};

export function LabPageClient({ labData }: LabPageClientProps) {
    const Component = componentMap[labData.component as keyof typeof componentMap];

    if (!Component) {
        return (
            <div className="min-h-screen bg-[#1e293b] text-white p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Lab Not Available</h1>
                    <p className="text-gray-300">
                        The {labData.title} lab is currently under development.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#1e293b] text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p>Loading {labData.title} lab...</p>
                </div>
            </div>
        }>
            <Component />
        </Suspense>
    );
} 