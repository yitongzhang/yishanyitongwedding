'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log('Checking auth state...')
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('Supabase client:', supabase)
        
        // Check if user is already logged in
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session check:', session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          
          // Check if user is admin and redirect appropriately
          const { data: guest } = await supabase
            .from('guests')
            .select('is_admin')
            .eq('email', session.user.email!)
            .single()
          
          if (guest?.is_admin) {
            console.log('User is admin, redirecting to /admin')
            router.push('/admin')
          } else {
            console.log('User is not admin, redirecting to /dashboard')
            router.push('/dashboard')
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error in auth check:', error)
        setLoading(false)
      }
    }
    
    checkAuthState()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user is admin and redirect appropriately
          const { data: guest } = await supabase
            .from('guests')
            .select('is_admin')
            .eq('email', session.user.email!)
            .single()
          
          if (guest?.is_admin) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleSignIn called')
    
    if (!email) {
      console.log('No email provided')
      return
    }

    setIsLoading(true)
    setMessage('')
    console.log('Starting sign in process for email:', email)

    try {
      // Test basic connection first
      console.log('Testing Supabase connection...')
      try {
        const testStart = Date.now()
        const { data: testData, error: testError } = await supabase
          .from('guests')
          .select('count')
          .limit(1)
        const testTime = Date.now() - testStart
        console.log(`Connection test completed in ${testTime}ms`, { testData, testError })
      } catch (testErr) {
        console.error('Connection test failed:', testErr)
      }

      // First check if the email exists in our guests table
      console.log('Checking if email exists in guests table...')
      const startTime = Date.now()
      
      // Use a simpler approach without Promise.race
      let guest = null
      let guestError = null
      let timedOut = false
      
      const timeoutId = setTimeout(() => {
        timedOut = true
        console.error('Database query timed out after 5 seconds')
      }, 5000)
      
      try {
        const result = await supabase
          .from('guests')
          .select('email')
          .eq('email', email)
          .single()
        
        clearTimeout(timeoutId)
        guest = result.data
        guestError = result.error
      } catch (err) {
        clearTimeout(timeoutId)
        guestError = err
      }
      
      if (timedOut) {
        setMessage('Database connection timeout. Please try again.')
        setIsLoading(false)
        return
      }
      
      const checkTime = Date.now() - startTime
      console.log(`Guest check completed in ${checkTime}ms`)
      console.log('Guest data:', guest)
      console.log('Guest error:', guestError)

      if (!guest) {
        console.log('Email not found in guests table')
        setMessage('Email not found. Please contact the wedding organizers if you think this is an error.')
        setIsLoading(false)
        return
      }

      console.log('Email found, sending OTP...')
      const otpStartTime = Date.now()
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true, // Allow creating users for invited guests
        },
      })
      
      const otpTime = Date.now() - otpStartTime
      console.log(`OTP request completed in ${otpTime}ms`)

      if (error) {
        console.error('OTP Error:', error)
        setMessage('Error sending magic link. Please try again.')
        console.error('Error:', error)
      } else {
        console.log('OTP sent successfully')
        setMessage('Check your email for the magic link to sign in!')
      }
    } catch (error) {
      console.error('Catch block error:', error)
      if (error instanceof Error && error.message.includes('timeout')) {
        setMessage('Request timed out. Please try again.')
      } else {
        setMessage('Error sending magic link. Please try again.')
      }
      console.error('Error:', error)
    } finally {
      console.log('Finally block - setting loading to false')
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading... (Check browser console for errors)</p>
        </div>
      </main>
    )
  }

  if (user) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Redirecting...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Yishan & Yitong
        </h1>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-4">We&apos;re Getting Married!</h2>
          <p className="text-lg mb-2">October 4th, 2025</p>
          <p className="text-lg">San Francisco, CA</p>
        </div>

        <div className="text-center">
          <p className="mb-6">
            Join us for our special day! Please enter your email to sign in and RSVP.
          </p>
          
          <form onSubmit={handleSignIn} className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Error') || message.includes('not found') 
                ? 'bg-red-50 text-red-700' 
                : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}