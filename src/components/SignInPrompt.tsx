'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface SignInPromptProps {
  title: string
  message: string
}

export default function SignInPrompt({ title, message }: SignInPromptProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      return
    }

    setIsLoading(true)
    setStatusMessage('')

    try {
      // First check if the email exists in our guests table
      const { data: guest } = await supabase
        .from('guests')
        .select('email')
        .eq('email', email)
        .single()

      if (!guest) {
        setStatusMessage('Email not found. Please contact the wedding organizers if you think this is an error.')
        setIsLoading(false)
        return
      }

      // Send OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) {
        setStatusMessage('Error sending magic link. Please try again.')
        console.error('Error:', error)
      } else {
        setStatusMessage('Check your email for the magic link to sign in!')
      }
    } catch (error) {
      setStatusMessage('Error sending magic link. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      
      <form onSubmit={handleSignIn} className="space-y-4">
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
      
      {statusMessage && (
        <div className={`mt-4 p-4 rounded-lg ${
          statusMessage.includes('Error') || statusMessage.includes('not found') 
            ? 'bg-red-50 text-red-700' 
            : 'bg-green-50 text-green-700'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  )
} 