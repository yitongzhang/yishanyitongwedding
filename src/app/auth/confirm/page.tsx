'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function AuthConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing...')
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const confirmAuth = async () => {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')
      
      console.log('Auth confirm page loaded:', { token_hash: !!token_hash, type })
      
      if (!token_hash || !type) {
        setError('Missing token or type')
        return
      }
      
      try {
        const supabase = createClient()
        
        console.log('Verifying OTP...')
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        })
        
        console.log('OTP verification result:', { 
          success: !!data?.session,
          error: error?.message,
          user: data?.user?.email 
        })
        
        if (error) {
          setError(error.message)
          setStatus('Authentication failed')
        } else if (data?.session && data?.user) {
          setStatus('Success! Redirecting...')
          
          // Check if user is admin
          const { data: guest } = await supabase
            .from('guests')
            .select('is_admin')
            .eq('email', data.user.email!)
            .single()
          
          // Redirect based on user type
          if (guest?.is_admin) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        } else {
          setError('No session created')
          setStatus('Authentication failed')
        }
      } catch (err) {
        console.error('Auth confirm error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('Error occurred')
      }
    }
    
    confirmAuth()
  }, [searchParams, router])
  
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Confirming your sign in...</h1>
        <p className="text-lg mb-4">{status}</p>
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded">
            Error: {error}
          </div>
        )}
      </div>
    </main>
  )
}

export default function AuthConfirm() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </main>
    }>
      <AuthConfirmContent />
    </Suspense>
  )
} 