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
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user is admin
          const { data: guest } = await supabase
            .from('guests')
            .select('is_admin')
            .eq('email', session.user.email)
            .single()
          
          if (guest?.is_admin) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
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
    if (!email) return

    setIsLoading(true)
    setMessage('')

    try {
      // First check if the email exists in our guests table
      const { data: guest } = await supabase
        .from('guests')
        .select('email')
        .eq('email', email)
        .single()

      if (!guest) {
        setMessage('Email not found. Please contact the wedding organizers if you think this is an error.')
        setIsLoading(false)
        return
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false, // Don't create user if they don't exist
        },
      })

      if (error) {
        setMessage('Error sending magic link. Please try again.')
        console.error('Error:', error)
      } else {
        setMessage('Check your email for the magic link to sign in!')
      }
    } catch (error) {
      setMessage('Error sending magic link. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading...</p>
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
          <h2 className="text-2xl mb-4">We're Getting Married!</h2>
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