// Re-export the client creation functions
export { createClient } from './supabase/client'
export { createClient as createServerClient } from './supabase/server'

// Re-export types
export type { Database, Tables, TablesInsert, TablesUpdate } from './supabase/types'