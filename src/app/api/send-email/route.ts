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
    
    // Check for Authorization header
    const authHeader = request.headers.get('Authorization')
    console.log('Authorization header:', authHeader ? 'present' : 'missing')
    
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
        global: {
          headers: {
            Authorization: authHeader || '',
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

    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend API key not configured')
      return NextResponse.json({ 
        error: 'Email service not configured. Please set RESEND_API_KEY in environment variables.' 
      }, { status: 503 })
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

    // Fetch guest names for personalization
    const { data: guestsInfo } = await supabase
      .from('guests')
      .select('email, name')
      .in('email', recipients)
    
    const guestMap = new Map(guestsInfo?.map(g => [g.email, g.name]) || [])
    
    const results = []
    
    console.log(`Processing ${recipients.length} emails to:`, recipients)
    
    for (const recipient of recipients) {
      try {
        console.log(`Attempting to send ${type} email to ${recipient}`)
        const guestName = guestMap.get(recipient) || null
        const html = render(emailComponent({ guestEmail: recipient, guestName }))
        
        // Generate plain text version
        const greeting = guestName ? `Dear ${guestName},` : 'Dear Friend,'
        const plainText = type === 'reminder' 
          ? `RSVP Reminder\n\n${greeting}\n\nWe hope you're as excited as we are about our upcoming wedding!\n\nYishan & Yitong\nDate: October 4th, 2025\nVenue: Penny Roma\nAddress: 3000 20th St, San Francisco, CA 94110\n\nWe haven't received your RSVP yet, and we'd love to know if you can join us! Please visit our wedding website to let us know if you'll be attending.\n\nRSVP at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://yishanandyitong.wedding'}\n\nIf you have any questions, please don't hesitate to reach out to us.\n\nLooking forward to celebrating with you!\nYishan & Yitong`
          : `Save the Date\n\n${greeting}\n\nYishan and Yitong warmly invite you to our wedding celebration in San Francisco on October 4th, 2025\n\nVenue: Penny Roma\nAddress: 3000 20th St, SF, CA\n\nRSVP at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://yishanandyitong.wedding'}\n\nMore info coming soon!`

        const { data, error } = await resend!.emails.send({
          from: 'Yishan & Yitong Wedding <wedding@yishanandyitong.wedding>',
          to: recipient,
          subject,
          html,
          text: plainText,
          reply_to: 'zha.yitong@gmail.com',
          headers: {
            'List-Unsubscribe': '<mailto:zha.yitong@gmail.com?subject=Unsubscribe>',
          },
        })

        if (error) {
          console.error(`Failed to send to ${recipient}:`, JSON.stringify(error, null, 2))
          results.push({ email: recipient, success: false, error: error.message || JSON.stringify(error) })
        } else {
          console.log(`Successfully sent to ${recipient}, ID:`, data?.id)
          results.push({ email: recipient, success: true, id: data?.id })
        }
        
        // Add delay to respect Resend's 2 requests per second limit (600ms for safety)
        await new Promise(resolve => setTimeout(resolve, 600))
        
      } catch (error) {
        console.error(`Exception sending to ${recipient}:`, error)
        results.push({ 
          email: recipient, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }
    
    console.log('Email send results:', results)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}