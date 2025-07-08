'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface Guest {
  id: string
  email: string
  has_rsvped: boolean
  is_attending: boolean | null
  dietary_preferences: string | null
  has_plus_one: boolean
  plus_one_name: string | null
  plus_one_email: string | null
  plus_one_dietary_preferences: string | null
  additional_notes: string | null
}

export default function Dashboard() {
  const router = useRouter()
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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/')
        return
      }

      setUser(user)

      // Check if user is admin
      const { data: guestData } = await supabase
        .from('guests')
        .select('*')
        .eq('email', user.email)
        .single()

      if (guestData?.is_admin) {
        router.push('/admin')
        return
      }

      if (guestData) {
        setGuest(guestData)
        setFormData({
          is_attending: guestData.is_attending,
          dietary_preferences: guestData.dietary_preferences || '',
          has_plus_one: guestData.has_plus_one,
          plus_one_name: guestData.plus_one_name || '',
          plus_one_email: guestData.plus_one_email || '',
          plus_one_dietary_preferences: guestData.plus_one_dietary_preferences || '',
          additional_notes: guestData.additional_notes || ''
        })
      }
      
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

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

  if (!guest) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Guest not found. Please contact the wedding organizers.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Yishan & Yitong Wedding</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Wedding Details</h2>
          <p className="text-lg mb-2"><strong>Date:</strong> October 4th, 2025</p>
          <p className="text-lg mb-2"><strong>Venue:</strong> Penny Roma</p>
          <p className="text-lg mb-2"><strong>Address:</strong> 3000 20th St, San Francisco, CA 94110</p>
          <p className="text-lg">We can't wait to celebrate with you!</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">RSVP</h2>
          
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
                  Yes, I'll be there!
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
                  Sorry, I can't make it
                </label>
              </div>
            </div>

            {formData.is_attending && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dietary preferences or restrictions
                  </label>
                  <textarea
                    value={formData.dietary_preferences}
                    onChange={(e) => setFormData({...formData, dietary_preferences: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Let us know about any dietary restrictions or preferences..."
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
                    I will be bringing a +1
                  </label>
                </div>

                {formData.has_plus_one && (
                  <div className="space-y-4 pl-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        +1 Name
                      </label>
                      <input
                        type="text"
                        value={formData.plus_one_name}
                        onChange={(e) => setFormData({...formData, plus_one_name: e.target.value})}
                        className="w-full p-2 border rounded-md"
                        placeholder="Full name of your +1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        +1 Email
                      </label>
                      <input
                        type="email"
                        value={formData.plus_one_email}
                        onChange={(e) => setFormData({...formData, plus_one_email: e.target.value})}
                        className="w-full p-2 border rounded-md"
                        placeholder="Email address of your +1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        +1 Dietary preferences or restrictions
                      </label>
                      <textarea
                        value={formData.plus_one_dietary_preferences}
                        onChange={(e) => setFormData({...formData, plus_one_dietary_preferences: e.target.value})}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Any dietary restrictions or preferences for your +1..."
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional notes
              </label>
              <textarea
                value={formData.additional_notes}
                onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Any additional notes or special requests..."
              />
            </div>

            <button
              type="submit"
              disabled={saving || formData.is_attending === null}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              {saving ? 'Saving...' : 'Submit RSVP'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}