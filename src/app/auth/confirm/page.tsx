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
          console.log('Auth successful, user:', data.user.email)
          
          // Simple redirect with a short delay to ensure the session is properly set
          setTimeout(() => {
            console.log('Redirecting to home page')
            router.push('/?auth=success')
          }, 1000)
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
    <main className="min-h-screen bg-[#332917] text-[#FCF3D6] flex items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center  text-[#E4B42E] p-8 rounded-3xl -rotate-1 font-gooper-semibold">
        <p className="text-xl mb-4">{status}</p>
        {error && (
          <div className="bg-red-900 text-red-400 p-4 rounded-3xl mt-4">
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
      <main className="min-h-screen bg-[#332917] text-[#FCF3D6] flex items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center bg-[#E4B42E] text-[#332917] p-8 rounded-3xl -rotate-1 font-gooper-semibold">
          <h1 className="text-3xl mb-4">Loading...</h1>
        </div>
      </main>
    }>
      <AuthConfirmContent />
    </Suspense>
  )
} 