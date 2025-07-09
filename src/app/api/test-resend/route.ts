import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function GET(request: NextRequest) {
  try {
    // Test 1: Check if Resend API key is valid
    const domains = await resend.domains.list()
    
    // Test 2: Try sending a test email
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's test domain
      to: 'delivered@resend.dev', // Use Resend's test email
      subject: 'Test Email',
      html: '<p>Test email from wedding website</p>',
    })
    
    return NextResponse.json({
      apiKeyValid: !domains.error,
      domains: domains.data || [],
      domainsError: domains.error || null,
      testEmailSent: !error,
      testEmailError: error || null,
      testEmailId: data?.id || null,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 