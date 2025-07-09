import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resend } from '@/lib/resend'
import { SaveTheDateEmail } from '@/emails/save-the-date'
import { ReminderEmail } from '@/emails/reminder'
import { render } from '@react-email/render'

export async function POST(request: NextRequest) {
  try {
    console.log('Send email API called')
    
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const value = cookieStore.get(name)?.value
            console.log(`Getting cookie ${name}:`, value ? 'exists' : 'missing')
            return value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('User check:', { user: user?.email, error: userError })
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - No user found' }, { status: 401 })
    }

    // Check if user is admin
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('is_admin')
      .eq('email', user.email!)
      .single()
    
    console.log('Admin check:', { isAdmin: guestData?.is_admin, error: guestError })

    if (!guestData?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized - Not an admin' }, { status: 401 })
    }

    const { type, recipients } = await request.json()

    if (!type || !recipients || recipients.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let emailComponent
    let subject
    
    switch (type) {
      case 'save-the-date':
        emailComponent = SaveTheDateEmail
        subject = 'Save the Date - Yishan & Yitong Wedding'
        break
      case 'reminder':
        emailComponent = ReminderEmail
        subject = 'RSVP Reminder - Yishan & Yitong Wedding'
        break
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    const results = []
    
    for (const recipient of recipients) {
      try {
        const html = render(emailComponent({ guestEmail: recipient }))
        
        const { data, error } = await resend.emails.send({
          from: 'Yishan & Yitong <noreply@yishanandyitong.wedding>',
          to: recipient,
          subject,
          html,
        })

        if (error) {
          results.push({ email: recipient, success: false, error: error.message })
        } else {
          results.push({ email: recipient, success: true, id: data?.id })
        }
      } catch (error) {
        results.push({ 
          email: recipient, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}