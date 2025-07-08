'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface Guest {
  id: string
  email: string
  created_at: string
  is_admin: boolean
  has_rsvped: boolean
  is_attending: boolean | null
  dietary_preferences: string | null
  has_plus_one: boolean
  plus_one_name: string | null
  plus_one_email: string | null
  plus_one_dietary_preferences: string | null
  rsvp_completed_at: string | null
  additional_notes: string | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [emailLoading, setEmailLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    rsvped: 0,
    attending: 0,
    notAttending: 0,
    plusOnes: 0
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
        .select('is_admin')
        .eq('email', user.email)
        .single()

      if (!guestData?.is_admin) {
        router.push('/dashboard')
        return
      }

      await loadGuestsData()
    }

    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const loadGuestsData = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      setGuests(data || [])
      
      // Calculate stats
      const total = data?.length || 0
      const rsvped = data?.filter(g => g.has_rsvped).length || 0
      const attending = data?.filter(g => g.is_attending === true).length || 0
      const notAttending = data?.filter(g => g.is_attending === false).length || 0
      const plusOnes = data?.filter(g => g.has_plus_one).length || 0

      setStats({ total, rsvped, attending, notAttending, plusOnes })
    } catch (error) {
      console.error('Error loading guests data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const sendEmail = async (type: 'save-the-date' | 'reminder') => {
    setEmailLoading(true)
    try {
      const recipients = guests
        .filter(guest => !guest.is_admin)
        .map(guest => guest.email)

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          recipients,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const successful = data.results.filter((r: any) => r.success).length
        const failed = data.results.filter((r: any) => !r.success).length
        alert(`Email sent! ${successful} successful, ${failed} failed`)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email')
    } finally {
      setEmailLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Guests</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">RSVP'd</h3>
            <p className="text-2xl font-bold text-green-600">{stats.rsvped}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Attending</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.attending}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">Not Attending</h3>
            <p className="text-2xl font-bold text-red-600">{stats.notAttending}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Plus Ones</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.plusOnes}</p>
          </div>
        </div>

        {/* Email Actions */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Email Actions</h2>
          <div className="space-x-4">
            <button
              onClick={() => sendEmail('save-the-date')}
              disabled={emailLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {emailLoading ? 'Sending...' : 'Send Save the Date'}
            </button>
            <button
              onClick={() => sendEmail('reminder')}
              disabled={emailLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              {emailLoading ? 'Sending...' : 'Send RSVP Reminder'}
            </button>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-2xl font-semibold">Guest List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RSVP Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dietary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plus One</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">+1 Dietary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RSVP Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{guest.email}</span>
                        {guest.is_admin && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        guest.has_rsvped 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {guest.has_rsvped ? 'RSVP\'d' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        guest.is_attending === true 
                          ? 'bg-green-100 text-green-800' 
                          : guest.is_attending === false
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {guest.is_attending === true ? 'Yes' : guest.is_attending === false ? 'No' : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {guest.dietary_preferences || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {guest.has_plus_one ? (
                        <div className="text-sm">
                          <div className="font-medium">{guest.plus_one_name || 'N/A'}</div>
                          <div className="text-gray-500">{guest.plus_one_email || 'N/A'}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {guest.plus_one_dietary_preferences || 'None'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {guest.additional_notes || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(guest.rsvp_completed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}