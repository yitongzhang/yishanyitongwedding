import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="mb-6">
          Sorry, we couldn&apos;t authenticate you. The magic link may have expired or already been used.
        </p>
        <Link 
          href="/"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </Link>
      </div>
    </main>
  )
}