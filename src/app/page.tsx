'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import SignInPrompt from '@/components/SignInPrompt'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Yishan & Yitong
          </h1>
          <h2 className="text-2xl mb-6 text-gray-700">We&apos;re Getting Married!</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-xl mb-4 text-gray-800"><strong>Date:</strong> October 4th, 2025</p>
            <p className="text-xl mb-4 text-gray-800"><strong>Venue:</strong> Penny Roma</p>
            <p className="text-xl mb-4 text-gray-800"><strong>Address:</strong> 3000 20th St, San Francisco, CA 94110</p>
            <p className="text-lg text-gray-600">We can&apos;t wait to celebrate with you!</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Wedding Details</h3>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div>
                <h4 className="font-semibold text-gray-800">Schedule</h4>
                <p className="text-gray-600">More details coming soon...</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Getting There</h4>
                <p className="text-gray-600">The venue is located in the Mission District of San Francisco. Parking information and directions will be provided closer to the date.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Accommodation</h4>
                <p className="text-gray-600">We&apos;ll share recommended hotels and accommodations for out-of-town guests soon.</p>
              </div>
            </div>
          </div>
        </div>



        {user && (
          <div className="text-center">
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-green-800">Welcome back!</h3>
              <p className="text-green-700">You&apos;re signed in as {user.email}. Use the navigation above to access your RSVP or admin features.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}