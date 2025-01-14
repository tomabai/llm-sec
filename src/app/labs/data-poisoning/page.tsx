'use client'

import React from 'react'
import { Database, AlertTriangle, Shield, FileWarning, ChevronRight, BarChart2 } from 'lucide-react'
import { LabLayout } from '@/components/LabLayout'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'

export default function DataPoisoningLab() {
    const [selectedDataset, setSelectedDataset] = React.useState<string | null>(null)
    const [modelMetrics, setModelMetrics] = React.useState<{
        accuracy: number;
        bias: number;
        toxicity: number;
    } | null>(null)
    const [trainingLogs, setTrainingLogs] = React.useState<string[]>([])
    const [isTraining, setIsTraining] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)
    const [poisonedExamples, setPoisonedExamples] = React.useState<Array<{
        original: string;
        poisoned: string;
        type: string;
    }> | null>(null)

    // Available training datasets with different poisoning techniques
    const datasets = [
        {
            id: 'clean',
            name: 'Base Dataset',
            description: 'Clean dataset without poisoning',
            size: '10,000 samples',
            source: 'Verified internal data'
        },
        {
            id: 'biased',
            name: 'News Articles Dataset',
            description: 'Collection of news articles and social media posts',
            size: '15,000 samples',
            source: 'External vendor',
            warning: 'Unverified sources'
        },
        {
            id: 'toxic',
            name: 'Customer Feedback Dataset',
            description: 'User reviews and feedback data',
            size: '8,000 samples',
            source: 'Third-party API',
            warning: 'Mixed quality'
        },
        {
            id: 'backdoor',
            name: 'Enhanced Training Set',
            description: 'Augmented dataset with additional examples',
            size: '12,000 samples',
            source: 'Open-source contribution',
            warning: 'Recent modifications'
        }
    ]

    const trainModel = async (datasetId: string) => {
        setIsTraining(true)
        setError(null)
        setSuccess(null)
        setModelMetrics(null)
        setPoisonedExamples(null)  // Reset examples
        setTrainingLogs([])

        const apiKey = localStorage.getItem('openai_api_key')
        if (!apiKey) {
            setError('Please configure your OpenAI API key first')
            setIsTraining(false)
            return
        }

        try {
            const res = await fetch('/api/data-poisoning/train', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ datasetId }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Training failed')

            setModelMetrics(data.metrics)
            setTrainingLogs(data.logs)

            if (data.poisoningDetected) {
                console.log('Poisoning detected:', data.poisonedExamples) // Debug log
                setSuccess(data.success)
                setPoisonedExamples(data.poisonedExamples)
            }
        } catch (err) {
            console.error('Training error:', err) // Debug log
            setError(err instanceof Error ? err.message : 'Failed to train model')
        } finally {
            setIsTraining(false)
        }
    }

    // Debug log for state changes
    React.useEffect(() => {
        console.log('Poisoned examples updated:', poisonedExamples)
    }, [poisonedExamples])

    return (
        <LabLayout>
            <div className="text-white p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Database className="w-8 h-8 text-green-400" />
                            LLM04: Data Poisoning Lab
                        </h1>
                        <div className="text-gray-300 space-y-2">
                            <p>
                                Explore how malicious actors can compromise LLM systems through data poisoning attacks.
                                In this lab, you&apos;ll analyze different training datasets and detect signs of poisoning.
                            </p>
                            <p className="text-sm text-gray-400">
                                Objective: Identify poisoned datasets by analyzing model behavior and training metrics.
                            </p>
                        </div>
                    </div>

                    {/* Vulnerability Details Section */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-green-400 mb-4">Understanding Data Poisoning</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-green-400 mb-2">What is Data Poisoning?</h3>
                                <p className="text-gray-300">
                                    Data poisoning occurs when training data is manipulated to introduce vulnerabilities, backdoors, or biases.
                                    This can happen during pre-training, fine-tuning, or through compromised data sources, leading to degraded
                                    model performance or malicious behavior.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-green-400 mb-2">Attack Vectors</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><span className="text-green-400">Training Data:</span> Injecting harmful content</li>
                                        <li><span className="text-green-400">Fine-tuning:</span> Manipulating model adaptation</li>
                                        <li><span className="text-green-400">Embeddings:</span> Corrupting vector representations</li>
                                        <li><span className="text-green-400">Backdoors:</span> Implementing hidden triggers</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-green-400 mb-2">Warning Signs</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li>Unexpected model behavior</li>
                                        <li>Biased or toxic outputs</li>
                                        <li>Anomalous training metrics</li>
                                        <li>Inconsistent performance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Key Configuration */}
                    <ApiKeyConfig />

                    {/* Interactive Training Environment */}
                    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <BarChart2 className="w-6 h-6 text-green-400" />
                            Training Environment
                        </h2>

                        {/* Dataset Selection */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {datasets.map((dataset) => (
                                <div
                                    key={dataset.id}
                                    onClick={() => setSelectedDataset(dataset.id)}
                                    className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedDataset === dataset.id
                                        ? 'bg-green-900/30 border-green-500'
                                        : 'bg-gray-800 hover:bg-gray-700'
                                        } border ${selectedDataset === dataset.id ? 'border-green-500' : 'border-gray-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-green-400">{dataset.name}</h3>
                                        {dataset.warning && (
                                            <FileWarning className="w-4 h-4 text-yellow-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-300 mb-2">{dataset.description}</p>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>{dataset.size}</span>
                                        <span>{dataset.source}</span>
                                    </div>
                                    {dataset.warning && (
                                        <p className="text-xs text-yellow-400 mt-2">{dataset.warning}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Training Controls */}
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => selectedDataset && trainModel(selectedDataset)}
                                disabled={!selectedDataset || isTraining}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isTraining ? (
                                    <>Training...</>
                                ) : (
                                    <>
                                        Train Model
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
                                <AlertTriangle className="w-5 h-5 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-start gap-2 text-green-400 bg-green-900/20 p-4 rounded-lg">
                                <Shield className="w-5 h-5 mt-0.5" />
                                <div>
                                    <p className="font-medium">{success}</p>
                                    <p className="text-sm text-green-300 mt-1">
                                        You&apos;ve successfully identified a poisoned dataset!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Poisoned Examples - Directly tied to success message */}
                        {poisonedExamples && poisonedExamples.length > 0 && (
                            <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <FileWarning className="w-5 h-5 text-yellow-400" />
                                    Detected Poisoned Data Examples
                                </h3>
                                <div className="grid gap-4">
                                    {poisonedExamples.map((example, index) => (
                                        <div key={index} className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-800">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-medium text-green-400">
                                                    Example {index + 1}
                                                </h4>
                                                <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                                                    {example.type}
                                                </span>
                                            </div>
                                            <div className="grid gap-2">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Original Data:</p>
                                                    <p className="text-sm text-gray-300 bg-black/30 p-3 rounded">
                                                        {example.original}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Poisoned Version:</p>
                                                    <p className="text-sm text-red-300 bg-red-900/20 p-3 rounded border border-red-900/30">
                                                        {example.poisoned}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Training Metrics */}
                        {modelMetrics && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Training Metrics</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400 mb-1">Accuracy</p>
                                        <div className="flex items-end gap-1">
                                            <span className="text-2xl font-medium">
                                                {modelMetrics.accuracy}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400 mb-1">Bias Score</p>
                                        <div className="flex items-end gap-1">
                                            <span className="text-2xl font-medium">
                                                {modelMetrics.bias}
                                            </span>
                                            <span className="text-sm text-gray-400 mb-1">/10</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400 mb-1">Toxicity Level</p>
                                        <div className="flex items-end gap-1">
                                            <span className="text-2xl font-medium">
                                                {modelMetrics.toxicity}
                                            </span>
                                            <span className="text-sm text-gray-400 mb-1">/10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Training Logs */}
                        {trainingLogs.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Training Logs</h3>
                                <div className="bg-black/50 p-4 rounded-lg space-y-1">
                                    {trainingLogs.map((log, index) => (
                                        <p key={index} className="font-mono text-sm text-gray-300">
                                            {log}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Prevention Tips */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-green-400" />
                            Prevention Strategies
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-green-400 font-medium mb-2">Data Validation</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Track data origins and transformations</li>
                                    <li>Implement strict data validation</li>
                                    <li>Use data version control (DVC)</li>
                                    <li>Monitor training metrics closely</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-green-400 font-medium mb-2">Security Controls</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                    <li>Sandbox training environments</li>
                                    <li>Validate data sources</li>
                                    <li>Implement anomaly detection</li>
                                    <li>Regular security audits</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    )
} 