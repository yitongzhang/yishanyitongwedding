'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function TestSupabase() {
  const [result, setResult] = useState<any>(null)
  const supabase = createClient()

  const testAuth = async () => {
    try {
      // Test 1: Check if we can get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      // Test 2: Check if we can access the database
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('email')
        .limit(1)
      
      setResult({
        session: sessionData?.session ? {
          user: sessionData.session.user.email,
          expires: new Date(sessionData.session.expires_at! * 1000).toLocaleString()
        } : 'No session',
        sessionError: sessionError?.message || null,
        databaseAccess: guestData ? 'Success' : 'Failed',
        databaseError: guestError?.message || null,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        timestamp: new Date().toLocaleString()
      })
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const testSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: 'zha.yitong@gmail.com',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      })
      
      if (error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('Check your email for the magic link!')
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Supabase Configuration Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testAuth}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Current Auth Status
          </button>
          
          <button
            onClick={testSignIn}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
          >
            Test Sign In (zha.yitong@gmail.com)
          </button>
        </div>
        
        {result && (
          <pre className="mt-8 p-4 bg-gray-100 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
        
        <div className="mt-8 p-4 bg-yellow-50 rounded">
          <h2 className="font-bold mb-2">Supabase Dashboard Checklist:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to your Supabase project → Authentication → URL Configuration</li>
            <li>Set Site URL to: <code className="bg-gray-200 px-1">http://localhost:3000</code></li>
            <li>Add to Redirect URLs: <code className="bg-gray-200 px-1">http://localhost:3000/**</code></li>
            <li>Enable Email provider in Authentication → Providers</li>
            <li>Check Authentication → Email Templates → Magic Link template</li>
          </ol>
        </div>
      </div>
    </main>
  )
} 