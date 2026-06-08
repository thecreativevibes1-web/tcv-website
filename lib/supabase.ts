import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === 'your_supabase_url_here') {
    console.warn('[Supabase] Missing or placeholder env vars — running in offline mode')
    return null
  }

  try {
    _client = createClient(url, key)
    return _client
  } catch (err) {
    console.error('[Supabase] Failed to initialize client:', err)
    return null
  }
}

export interface Lead {
  id?: string
  name: string
  business_type: string
  goal: string
  whatsapp: string
  created_at?: string
}

export interface Metric {
  id?: number
  label: string
  value: number
  updated_at?: string
}

export async function insertLead(lead: Omit<Lead, 'id' | 'created_at'>) {
  const client = getClient()
  if (!client) {
    console.warn('[Supabase] No client — lead not persisted:', lead)
    return []
  }

  const { data, error } = await client
    .from('leads')
    .insert([lead])
    .select()

  if (error) {
    console.error('[Supabase] Failed to insert lead:', error)
    throw error
  }

  return data
}

export async function fetchMetrics(): Promise<Metric[]> {
  const client = getClient()
  if (!client) {
    console.warn('[Supabase] No client — using fallback metrics')
    return []
  }

  const { data, error } = await client
    .from('metrics')
    .select('*')

  if (error) {
    console.error('[Supabase] Failed to fetch metrics:', error)
    return []
  }

  return data || []
}
