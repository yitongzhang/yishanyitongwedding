import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== LOG REQUEST ===')
  console.log('URL:', request.url)
  console.log('Headers:', Object.fromEntries(request.headers.entries()))
  console.log('Search Params:', Object.fromEntries(request.nextUrl.searchParams.entries()))
  console.log('==================')
  
  return NextResponse.json({ 
    message: 'Request logged', 
    url: request.url,
    searchParams: Object.fromEntries(request.nextUrl.searchParams.entries())
  })
} 