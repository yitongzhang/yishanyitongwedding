'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Check if user is admin
        console.log('Navigation: Checking admin status for email:', session.user.email)
        
        // Hardcoded admin check as fallback to bypass RLS issues
        const adminEmails = ['zha.yitong@gmail.com', 'yishan.zhang007@gmail.com']
        const isHardcodedAdmin = adminEmails.includes(session.user.email!)
        
        console.log('Navigation: Hardcoded admin check:', { email: session.user.email, isHardcodedAdmin })
        
        // Try database query but fallback to hardcoded check
        let guest = null
        try {
          const { data: directData, error: directError } = await supabase
            .from('guests')
            .select('is_admin, email')
            .eq('email', session.user.email!)
            .single()
          
          console.log('Navigation: Database query result:', { directData, directError })
          
          if (directError) {
            console.log('Navigation: Database query failed, using hardcoded check')
            guest = { is_admin: isHardcodedAdmin }
          } else {
            guest = directData
          }
        } catch (err) {
          console.log('Navigation: Database query exception, using hardcoded check:', err)
          guest = { is_admin: isHardcodedAdmin }
        }
        
        const adminStatus = guest?.is_admin ?? false
        console.log('Navigation: Admin status:', adminStatus)
        setIsAdmin(adminStatus)
      } else {
        setIsAdmin(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Check if user is admin
          console.log('Navigation (auth change): Checking admin status for email:', session.user.email)
          
          // Hardcoded admin check as fallback to bypass RLS issues
          const adminEmails = ['zha.yitong@gmail.com', 'yishan.zhang007@gmail.com']
          const isHardcodedAdmin = adminEmails.includes(session.user.email!)
          
          console.log('Navigation (auth change): Hardcoded admin check:', { email: session.user.email, isHardcodedAdmin })
          
          // Try database query but fallback to hardcoded check
          let guest = null
          try {
            const { data: directData, error: directError } = await supabase
              .from('guests')
              .select('is_admin, email')
              .eq('email', session.user.email!)
              .single()
            
            console.log('Navigation (auth change): Database query result:', { directData, directError })
            
            if (directError) {
              console.log('Navigation (auth change): Database query failed, using hardcoded check')
              guest = { is_admin: isHardcodedAdmin }
            } else {
              guest = directData
            }
          } catch (err) {
            console.log('Navigation (auth change): Database query exception, using hardcoded check:', err)
            guest = { is_admin: isHardcodedAdmin }
          }
          
          const adminStatus = guest?.is_admin ?? false
          console.log('Navigation (auth change): Admin status:', adminStatus)
          setIsAdmin(adminStatus)
        } else {
          setIsAdmin(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">
              Yishan & Yitong Wedding
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                RSVP
              </button>
              <button
                onClick={() => router.push('/admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.email}
                  {isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-600">Not signed in</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 