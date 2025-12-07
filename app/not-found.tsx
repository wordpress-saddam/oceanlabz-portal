import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
            <h2 className="text-4xl font-bold mb-4">Not Found</h2>
            <p className="text-[#9a9a9a] mb-8">Could not find requested resource</p>
            <Link
                href="/"
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Return Home
            </Link>
        </div>
    )
}
