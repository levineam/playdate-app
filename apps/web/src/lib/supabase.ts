import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function for server-side Supabase client
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Types for our database tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      families: {
        Row: {
          id: string
          profile_id: string
          name: string
          primary_contact_name: string
          primary_contact_phone: string | null
          city: string | null
          bio: string | null
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          primary_contact_name: string
          primary_contact_phone?: string | null
          city?: string | null
          bio?: string | null
          preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          primary_contact_name?: string
          primary_contact_phone?: string | null
          city?: string | null
          bio?: string | null
          preferences?: any
          created_at?: string
          updated_at?: string
        }
      }
      children: {
        Row: {
          id: string
          family_id: string
          first_name: string
          birth_date: string | null
          grade: string | null
          interests: string[]
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          first_name: string
          birth_date?: string | null
          grade?: string | null
          interests?: string[]
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          first_name?: string
          birth_date?: string | null
          grade?: string | null
          interests?: string[]
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          family_a: string
          family_b: string
          status: 'pending' | 'connected' | 'declined' | 'blocked'
          initiated_by: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_a: string
          family_b: string
          status?: 'pending' | 'connected' | 'declined' | 'blocked'
          initiated_by: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_a?: string
          family_b?: string
          status?: 'pending' | 'connected' | 'declined' | 'blocked'
          initiated_by?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      availability_windows: {
        Row: {
          id: string
          child_id: string
          day_of_week: number | null
          specific_date: string | null
          start_time: string
          end_time: string
          title: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          day_of_week?: number | null
          specific_date?: string | null
          start_time: string
          end_time: string
          title?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          day_of_week?: number | null
          specific_date?: string | null
          start_time?: string
          end_time?: string
          title?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      playdate_events: {
        Row: {
          id: string
          created_by: string
          title: string
          description: string | null
          event_date: string
          start_time: string
          end_time: string
          location: string
          location_type: 'home' | 'park' | 'indoor_activity' | 'other'
          max_children: number | null
          age_min: number | null
          age_max: number | null
          notes: string | null
          status: 'planned' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          title: string
          description?: string | null
          event_date: string
          start_time: string
          end_time: string
          location: string
          location_type?: 'home' | 'park' | 'indoor_activity' | 'other'
          max_children?: number | null
          age_min?: number | null
          age_max?: number | null
          notes?: string | null
          status?: 'planned' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          title?: string
          description?: string | null
          event_date?: string
          start_time?: string
          end_time?: string
          location?: string
          location_type?: 'home' | 'park' | 'indoor_activity' | 'other'
          max_children?: number | null
          age_min?: number | null
          age_max?: number | null
          notes?: string | null
          status?: 'planned' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      playdate_invites: {
        Row: {
          id: string
          event_id: string
          family_id: string
          invited_children: string[]
          status: 'pending' | 'accepted' | 'declined' | 'maybe'
          response_message: string | null
          attending_children: string[]
          response_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          family_id: string
          invited_children?: string[]
          status?: 'pending' | 'accepted' | 'declined' | 'maybe'
          response_message?: string | null
          attending_children?: string[]
          response_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          family_id?: string
          invited_children?: string[]
          status?: 'pending' | 'accepted' | 'declined' | 'maybe'
          response_message?: string | null
          attending_children?: string[]
          response_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}