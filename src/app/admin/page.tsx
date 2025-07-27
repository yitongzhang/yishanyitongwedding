'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import SignInPrompt from '@/components/SignInPrompt'
import { Database } from '@/lib/supabase/types'

type Guest = Database['public']['Tables']['guests']['Row']

export default function AdminDashboard() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
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

  const loadGuestsData = useCallback(async () => {
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
  }, [supabase])

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        // Check if user is admin
        const { data: guestData } = await supabase
          .from('guests')
          .select('is_admin')
          .eq('email', session.user.email!)
          .single()

        const adminStatus = guestData?.is_admin ?? false
        setIsAdmin(adminStatus)

        if (adminStatus) {
          await loadGuestsData()
        } else {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Check if user is admin
          const { data: guestData } = await supabase
            .from('guests')
            .select('is_admin')
            .eq('email', session.user.email!)
            .single()

          const adminStatus = guestData?.is_admin ?? false
          setIsAdmin(adminStatus)

          if (adminStatus) {
            await loadGuestsData()
          }
        } else {
          setIsAdmin(false)
          setGuests([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, loadGuestsData])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const sendEmail = async (type: 'save-the-date' | 'reminder') => {
    setEmailLoading(true)
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      
      const recipients = guests
        .filter(guest => !guest.is_admin)
        .map(guest => guest.email)

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
        },
        credentials: 'include',
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

  // If not logged in, show sign-in prompt
  if (!user) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Please sign in to access the admin dashboard</p>
          </div>
          <SignInPrompt 
            title="Admin Sign In"
            message="Please sign in with your admin email to access the dashboard."
          />
        </div>
      </main>
    )
  }

  // If logged in but not admin, show access denied
  if (!isAdmin) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-800">Access Denied</h2>
            <p className="text-red-700">You don&apos;t have admin privileges. Your email ({user.email}) is not authorized to access this page.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome, {user.email}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Guests</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">RSVP&apos;d</h3>
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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

        {/* Guest List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-semibold">Guest List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plus One</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dietary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{guest.email}</div>
                        {guest.is_admin && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Admin</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        guest.has_rsvped 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {guest.has_rsvped ? 'RSVP&apos;d' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        guest.is_attending === true 
                          ? 'bg-green-100 text-green-800' 
                          : guest.is_attending === false 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {guest.is_attending === true ? 'Yes' : guest.is_attending === false ? 'No' : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {guest.has_plus_one ? `${guest.plus_one_name || 'Yes'}` : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {guest.dietary_preferences ? '✓' : ''}
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