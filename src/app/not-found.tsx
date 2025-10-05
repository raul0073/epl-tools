'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Sorry, the page you are looking for does not exist.</p>
            <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
                Go Home
            </Link>
        </div>
    )
}
