import Link from 'next/link'

export default function NodesNotFound() {
    return (
        <div className="min-h-screen bg-[#1e293b] text-white p-8 flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Node Not Found</h1>
                <p className="text-gray-300 mb-8">Sorry, we couldn&apos;t find the component you&apos;re looking for.</p>
                <Link href="/nodes" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Return to Components
                </Link>
            </div>
        </div>
    )
} 