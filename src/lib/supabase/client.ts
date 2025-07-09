import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export const createClient = () => {
  if (supabaseClient) {
    return supabaseClient
  }
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Creating NEW Supabase client instance with:')
  console.log('URL:', url)
  console.log('Anon Key:', anonKey ? `${anonKey.substring(0, 20)}...` : 'MISSING')
  
  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  supabaseClient = createSupabaseClient<Database>(url, anonKey)
  return supabaseClient
}