import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Maranatha Christian College</h1>
        <p className="text-2xl mb-12">Student Portal</p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Student Login
          </Link>
          <p className="text-sm mt-4">Don't have an account? <Link href="/register" className="underline hover:text-gray-200">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
