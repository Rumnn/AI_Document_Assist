export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mx-auto shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">AI Document Assistant</h1>
        <p className="text-xl text-gray-600 max-w-md">
          Your intelligent knowledge retrieval platform. Upload documents, ask questions, get answers with citations.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/dashboard" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Enter Dashboard
          </a>
          <a href="/login" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-xs">
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
}
