import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Family, Child, Connection, AvailabilityWindow, PlaydateEvent, PlaydateInvite } from '@playdate/shared-types';

// Database types
export interface Database {
  public: {
    Tables: {
      families: {
        Row: Family;
        Insert: Omit<Family, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Family, 'id' | 'created_at' | 'updated_at'>>;
      };
      children: {
        Row: Child;
        Insert: Omit<Child, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Child, 'id' | 'created_at' | 'updated_at'>>;
      };
      connections: {
        Row: Connection;
        Insert: Omit<Connection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Connection, 'id' | 'created_at' | 'updated_at'>>;
      };
      availability_windows: {
        Row: AvailabilityWindow;
        Insert: Omit<AvailabilityWindow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AvailabilityWindow, 'id' | 'created_at' | 'updated_at'>>;
      };
      playdate_events: {
        Row: PlaydateEvent;
        Insert: Omit<PlaydateEvent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PlaydateEvent, 'id' | 'created_at' | 'updated_at'>>;
      };
      playdate_invites: {
        Row: PlaydateInvite;
        Insert: Omit<PlaydateInvite, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PlaydateInvite, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// Client factory
export function createSupabaseClient(supabaseUrl: string, supabaseAnonKey: string): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

// Client type export
export type TypedSupabaseClient = SupabaseClient<Database>;

// Auth utilities
export const authHelpers = {
  signInWithMagicLink: async (client: TypedSupabaseClient, email: string) => {
    return await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  signOut: async (client: TypedSupabaseClient) => {
    return await client.auth.signOut();
  },

  getCurrentUser: async (client: TypedSupabaseClient) => {
    const { data: { user }, error } = await client.auth.getUser();
    return { user, error };
  },
};

// Database utilities
export const dbHelpers = {
  families: {
    getById: async (client: TypedSupabaseClient, id: string) => {
      return await client
        .from('families')
        .select('*')
        .eq('id', id)
        .single();
    },

    create: async (client: TypedSupabaseClient, family: Database['public']['Tables']['families']['Insert']) => {
      return await client
        .from('families')
        .insert(family)
        .select()
        .single();
    },

    update: async (client: TypedSupabaseClient, id: string, updates: Database['public']['Tables']['families']['Update']) => {
      return await client
        .from('families')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },
  },

  children: {
    getByFamilyId: async (client: TypedSupabaseClient, familyId: string) => {
      return await client
        .from('children')
        .select('*')
        .eq('family_id', familyId)
        .order('birth_date', { ascending: false });
    },

    create: async (client: TypedSupabaseClient, child: Database['public']['Tables']['children']['Insert']) => {
      return await client
        .from('children')
        .insert(child)
        .select()
        .single();
    },

    update: async (client: TypedSupabaseClient, id: string, updates: Database['public']['Tables']['children']['Update']) => {
      return await client
        .from('children')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },
  },

  connections: {
    getForFamily: async (client: TypedSupabaseClient, familyId: string) => {
      return await client
        .from('connections')
        .select(`
          *,
          family_a:families!connections_family_a_fkey(*),
          family_b:families!connections_family_b_fkey(*)
        `)
        .or(`family_a.eq.${familyId},family_b.eq.${familyId}`)
        .eq('status', 'connected');
    },

    create: async (client: TypedSupabaseClient, connection: Database['public']['Tables']['connections']['Insert']) => {
      return await client
        .from('connections')
        .insert(connection)
        .select()
        .single();
    },
  },
};

// Export all types and utilities
export * from '@playdate/shared-types';