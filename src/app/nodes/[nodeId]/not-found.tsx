import Link from 'next/link'

export default function NodeNotFound() {
    return (
        <div className="min-h-screen bg-[#1e293b] text-white p-8 flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Component Not Found</h1>
                <p className="text-gray-300 mb-8">The requested component does not exist in our architecture.</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/nodes" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View All Components
                    </Link>
                    <Link href="/" className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                        Return to Diagram
                    </Link>
                </div>
            </div>
        </div>
    )
} 