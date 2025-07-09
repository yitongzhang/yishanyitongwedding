// Re-export the client creation function only (for client components)
export { createClient } from './supabase/client'

// Re-export types
export type { Database, Tables, TablesInsert, TablesUpdate } from './supabase/types'