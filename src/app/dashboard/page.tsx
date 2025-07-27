'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import SignInPrompt from '@/components/SignInPrompt'
import { Database } from '@/lib/supabase/types'

type Guest = Database['public']['Tables']['guests']['Row']

export default function Dashboard() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    is_attending: null as boolean | null,
    dietary_preferences: '',
    has_plus_one: false,
    plus_one_name: '',
    plus_one_email: '',
    plus_one_dietary_preferences: '',
    additional_notes: ''
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Get guest data
        const { data: guestData } = await supabase
          .from('guests')
          .select('*')
          .eq('email', session.user.email!)
          .single()

        if (guestData) {
          setGuest(guestData)
          setFormData({
            is_attending: guestData.is_attending,
            dietary_preferences: guestData.dietary_preferences || '',
            has_plus_one: guestData.has_plus_one ?? false,
            plus_one_name: guestData.plus_one_name || '',
            plus_one_email: guestData.plus_one_email || '',
            plus_one_dietary_preferences: guestData.plus_one_dietary_preferences || '',
            additional_notes: guestData.additional_notes || ''
          })
        }
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Get guest data
          const { data: guestData } = await supabase
            .from('guests')
            .select('*')
            .eq('email', session.user.email!)
            .single()

          if (guestData) {
            setGuest(guestData)
            setFormData({
              is_attending: guestData.is_attending,
              dietary_preferences: guestData.dietary_preferences || '',
              has_plus_one: guestData.has_plus_one ?? false,
              plus_one_name: guestData.plus_one_name || '',
              plus_one_email: guestData.plus_one_email || '',
              plus_one_dietary_preferences: guestData.plus_one_dietary_preferences || '',
              additional_notes: guestData.additional_notes || ''
            })
          }
        } else {
          setGuest(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guest) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          has_rsvped: true,
          is_attending: formData.is_attending,
          dietary_preferences: formData.dietary_preferences,
          has_plus_one: formData.has_plus_one,
          plus_one_name: formData.has_plus_one ? formData.plus_one_name : null,
          plus_one_email: formData.has_plus_one ? formData.plus_one_email : null,
          plus_one_dietary_preferences: formData.has_plus_one ? formData.plus_one_dietary_preferences : null,
          additional_notes: formData.additional_notes,
          rsvp_completed_at: new Date().toISOString()
        })
        .eq('id', guest.id)

      if (error) throw error

      // Reload guest data
      const { data: updatedGuest } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guest.id)
        .single()
      
      if (updatedGuest) {
        setGuest(updatedGuest)
      }

      alert('RSVP submitted successfully!')
    } catch (error) {
      console.error('Error saving RSVP:', error)
      alert('Error saving RSVP. Please try again.')
    } finally {
      setSaving(false)
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

  // If not logged in, show sign-in prompt
  if (!user) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">RSVP</h1>
            <p className="text-lg text-gray-600">Please sign in to view and submit your RSVP</p>
          </div>
          <SignInPrompt 
            title="Sign In to RSVP"
            message="Please sign in with your email to access your RSVP form."
          />
        </div>
      </main>
    )
  }

  // If logged in but not a guest, show error
  if (!guest) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-800">Guest Not Found</h2>
            <p className="text-red-700">Your email ({user.email}) was not found in our guest list. Please contact the wedding organizers if you think this is an error.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">RSVP</h1>
          <p className="text-lg text-gray-600">Welcome, {user.email}!</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Wedding Details</h2>
          <p className="text-lg mb-2"><strong>Date:</strong> October 4th, 2025</p>
          <p className="text-lg mb-2"><strong>Venue:</strong> Penny Roma</p>
          <p className="text-lg mb-2"><strong>Address:</strong> 3000 20th St, San Francisco, CA 94110</p>
          <p className="text-lg">We can&apos;t wait to celebrate with you!</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Your RSVP</h2>
          
          {guest.has_rsvped && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800">
                ✓ Thank you for your RSVP! You can update your response below if needed.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Will you be attending?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_attending"
                    value="true"
                    checked={formData.is_attending === true}
                    onChange={(e) => setFormData({...formData, is_attending: true})}
                    className="mr-2"
                  />
                  Yes, I&apos;ll be there!
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_attending"
                    value="false"
                    checked={formData.is_attending === false}
                    onChange={(e) => setFormData({...formData, is_attending: false})}
                    className="mr-2"
                  />
                  Sorry, I can&apos;t make it
                </label>
              </div>
            </div>

            {formData.is_attending === true && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dietary Preferences/Restrictions
                  </label>
                  <textarea
                    value={formData.dietary_preferences}
                    onChange={(e) => setFormData({...formData, dietary_preferences: e.target.value})}
                    placeholder="Please let us know about any dietary restrictions or preferences..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.has_plus_one}
                      onChange={(e) => setFormData({...formData, has_plus_one: e.target.checked})}
                      className="mr-2"
                    />
                    I will be bringing a plus one
                  </label>
                </div>

                {formData.has_plus_one && (
                  <div className="space-y-4 ml-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Plus One Name
                      </label>
                      <input
                        type="text"
                        value={formData.plus_one_name}
                        onChange={(e) => setFormData({...formData, plus_one_name: e.target.value})}
                        placeholder="Full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Plus One Email (optional)
                      </label>
                      <input
                        type="email"
                        value={formData.plus_one_email}
                        onChange={(e) => setFormData({...formData, plus_one_email: e.target.value})}
                        placeholder="Email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Plus One Dietary Preferences/Restrictions
                      </label>
                      <textarea
                        value={formData.plus_one_dietary_preferences}
                        onChange={(e) => setFormData({...formData, plus_one_dietary_preferences: e.target.value})}
                        placeholder="Any dietary restrictions or preferences for your plus one..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.additional_notes}
                onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                placeholder="Any additional notes or special requests..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={saving || formData.is_attending === null}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Submit RSVP'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}